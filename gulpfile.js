/*global -$ */
'use strict';

// GULP CONFIG
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var browserSync = require('browser-sync');
var reload = browserSync.reload;
var fs = require("fs");

// Badly named tasks
var awspublish = require('gulp-awspublish');
var minifyHTML = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');

// Load project config file
// var appConfig = require('./gulp-config.json');


// *


// HTML
gulp.task('html', function () {
  return gulp.src('./source/html/build.html')
    .pipe($.premailer())
    .pipe(minifyHTML())
    .pipe($.rename("index.html"))
    .pipe(gulp.dest('./build'))
    .pipe(browserSync.reload({stream:true}))
    .pipe($.notify("HTML processing complete"));
});


// CSS
gulp.task('css', function () {
  return gulp.src('source/scss/app.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'nested',
      precision: 10,
      includePaths: ['.'],
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe($.postcss([
      require('autoprefixer-core')({browsers: ['last 2 version']})
    ]))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('./build/css'))

    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe($.rename("app.min.css"))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.reload({stream:true}))

    .pipe($.notify("CSS compile complete"));
});


// Images
gulp.task('images', function () {
  return gulp.src('source/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    })))
    .pipe(gulp.dest('build/images'))

    .pipe(browserSync.reload({stream:true}))
    .pipe($.notify("Image processing complete"));
});


// *


// BUILD TASKS
// Clean task
gulp.task('clean', require('del').bind(null, ['build']));

// Build task
gulp.task('build', gulp.series('css', 'html', 'images'), function () {
  
});

// Clean & build
gulp.task('default', gulp.series('clean', 'build'), function () {});


// *


// WATCH TASKS
// Browser-Sync task
gulp.task('browser-sync', function () {
  var files = [
    'build/index.html'
  ];

  browserSync.init(files, {
    server: {
       baseDir: './build'
    }
  });
});


// Watch task
gulp.task('watch', function() {
  gulp.watch('source/html/**/*.*', gulp.parallel('html'));
  gulp.watch('source/scss/**/*.*', gulp.parallel('css'));
  gulp.watch('source/images/**/*.*', gulp.parallel('images'));
});


// Localhost server & build
gulp.task('dev', gulp.series('build', 'watch', 'browser-sync'), function () {
  
});


// *


// PUBLISH TASKS
// Publish the app to S3
gulp.task('publish-images', function() {
  // create a new publisher 
  var publisher = awspublish.create({
    "key": "",
    "secret": "",
    "bucket": "",
    "region": ""
    });
 
  return gulp.src('build/images/**/*.*')
    .pipe(publisher.publish())
    .pipe(publisher.cache())
    .pipe($.awspublish.reporter());
});
