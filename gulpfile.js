'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

gulp.task('jshint', function() {
  return gulp.src(['*.js', 'lib/*.js', 'spec/*.js']).
    pipe(jshint()).
    pipe(jshint.reporter(stylish));
});

var jasmine = require('gulp-jasmine');

gulp.task('test', function() {
  return gulp.src('spec/*.js').
    pipe(jasmine());
});

gulp.task('default', [ 'jshint', 'test' ]);

