'use strict';

var gutil = require('gulp-util'),
    path = require('path'),
    fs = require('fs'),
    through = require('through2'),
    MessageFormat = require('messageformat'),
    EOL = require('os').EOL;


function compile(phrases, file, options) {
    var namespace = path.basename(file.path, path.extname(file.path));
    var compiler = new MessageFormat(options.locale);

    var fns = [];
    Object.keys(phrases).forEach(function (key) {
        fns.push('"' + key + '":' + compiler.precompile(compiler.parse(phrases[key])));
    });

    return '"' + namespace + '":{' + fns.join(',' + EOL) + '}';
}


module.exports = function (options) {

    if (!options.locale) {
        throw new gutil.PluginError('gulp-messageformat', '`locale` required');
    }

    var scripts = [];
    var fakeFile;

    function combine(file, encoding, next) {

        if (!fakeFile) {
            fakeFile = new gutil.File({
                path: path.join(file.base, options.locale + '.js'),
                base: file.base,
                cwd: file.cwd,
                contents: new Buffer('')
            });
        }

        if (file.isNull()) {
            /* jshint validthis:true*/
            this.push(file);
            next();
            return;
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError('gulp-messageformat', 'Streaming not supported'));
            next();
            return;
        }

        try {
            scripts.push(EOL+compile(JSON.parse(file.contents.toString()), file, options));
        } catch (err) {
            this.emit('error', new gutil.PluginError('gulp-messageformat', err));
        }

        next();

    }

    function flush(next) {

        var _this = this;

        fs.readFile('commonjsStrict.js', 'utf8', function (err, data) {
            if (err) {
                this.emit('error', new gutil.PluginError('gulp-messageformat', err));
            }
            var result = data.replace(/null/g, '{' + EOL + scripts.join(','+EOL) + EOL + '}');

            fakeFile.contents = new Buffer(result);

            /* jshint validthis:true*/
            _this.push(fakeFile);
            next();

        });

    }

    return through.obj(combine, flush);

};
