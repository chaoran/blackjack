'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

gulp.task('jshint', function() {
  return gulp.src(['*.js', 'lib/*.js', 'spec/*.js']).
    pipe(jshint()).
    pipe(jshint.reporter(stylish)).
    pipe(jshint.reporter('fail'));
});

var jasmine = require('gulp-jasmine');

gulp.task('test', [ 'jshint' ], function() {
  return gulp.src('spec/*.js').
    pipe(jasmine());
});

gulp.task('default', [ 'jshint', 'test' ]);

