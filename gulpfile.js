/*jshint node:true */

'use strict';

var gulp = require('gulp'),
    path = require('path'),
    messageFormat = require('./index'),//gulp-messageformat'),
    gutil = require('gulp-util');



function handleError(err) {
    gutil.error(err);
}


gulp.task('mf', function () {
    gulp.src(['../outfound/nls/en/**/*.json'])
        .pipe(messageFormat({
            locale: 'en'
        }))
        .pipe(gulp.dest(path.resolve('./tmp')))
        .on('error', handleError);
});







