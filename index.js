'use strict';

var gutil = require('gulp-util'),
    path = require('path'),
    fs = require('fs'),
    through = require('through2'),
    MessageFormat = require('messageformat'),
    EOL = require('os').EOL;

module.exports = function (options) {

    if (!options.locale) {
        throw new gutil.PluginError('gulp-messageformat', '`locale` required');
    }

    var langs = options.locale.trim().split(/[ ,]+/);
    var mf = new MessageFormat(langs[0], false, 'i18n');
    var scripts = [];
    var fakeFile;

    langs.forEach(function (lang) {
        MessageFormat.loadLocale(lang);
    });

    function combine(file, encoding, next) {

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

        // get the first files path, base, cwd etc. and no contents.
        if (!fakeFile) {
            fakeFile = new gutil.File({
                path: path.join(file.base, options.locale + '.js'),
                base: file.base,
                cwd: file.cwd,
                contents: new Buffer('')
            });
        }

        try {
            //scripts.push(EOL+compile(JSON.parse(file.contents.toString()), file, options));
            var namespace = path.basename(file.path, path.extname(file.path));
            if (path.basename(path.dirname(file.path)) != options.locale) {
                namespace = path.join(path.basename(path.dirname(file.path)), namespace);
            }
            var compiled = '"'+namespace+'":'+mf.precompileObject(JSON.parse(file.contents.toString()));
            scripts.push(compiled);

        } catch (err) {
            this.emit('error', new gutil.PluginError('gulp-messageformat', err));
        }

        next();

    }

    function flush(next) {

        var umd = fs.readFileSync(path.resolve(path.join(__dirname, 'umd.js')), 'utf8');

        var result = umd.replace(/return;/g, [
            'var i18n = ',
            mf.functions() + ';',
            'return {', scripts.join(','+EOL), '};'
        ].join(EOL));

        fakeFile.contents = new Buffer(result);

        this.push(fakeFile);
        next();

    }

    return through.obj(combine, flush);

};
