var gulp = require('gulp')
var browserify = require('gulp-browserify')
var _ = require('underscore')
var shell = require('gulp-shell')
var concat = require('gulp-concat')
var File = require('vinyl')
var fs = require('fs')
var path = require('path')
var gettext = require('gulp-angular-gettext')
var brfs = require('gulp-brfs')

gulp.task('browserify', function () {
  gulp.src('angular.js')
  .pipe(brfs())
  .pipe(browserify())
  .on('error', onError)
  .pipe(gulp.dest('static/js'))
})

function onError (err) {
  console.error(err)
  this.emit('end')
}

gulp.task('default', ['no-watch'], function () {
  gulp.watch(['angular.js', '**/*.js', '!gulpfile.js', '!static/js/angular.js'], ['browserify'])
})

gulp.task('no-watch', ['browserify'])
