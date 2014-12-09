// Dependencies
var gulp = require('gulp');

// Skip loading each dependency individually and load via gulp-load-plugins task
var gulpLoadPlugins = require('gulp-load-plugins');
var browserSync = require('browser-sync');
var plugins = gulpLoadPlugins();

// Load config file
var config = require('./config.json');

// CSS COMPILE
gulp.task('sass', function () {
    gulp.src('./source/scss/_css-compile/*.scss')
        .pipe(plugins.sass())
        .pipe(gulp.dest('./source/css/'));
});


// INLINE CSS (Two step process)
// 1. GULP INLINE - Copies external css to doc head
gulp.task('inline', function () {
	gulp.src('./source/html/development.html')
	  .pipe(plugins.inline({
	    base: './',
	    css: plugins.minifyCss()
	  }))
	  .pipe(gulp.dest('./source/gulp/'))
});

// 2. GULP PREMAILER - Inlines at a tag level
gulp.task('premailer', function () {
    gulp.src('./source/gulp/*.html')
        .pipe(plugins.premailer())
        .pipe(gulp.dest('./build/'));
});


// BROWSER-SYNC
gulp.task('browser-sync', function () {
   var files = [
      './build/*.html'
   ];

   browserSync.init(files, {
      server: {
         baseDir: './build'
      }
   });
});


// WATCH TASK
gulp.task('dev', function() {
    //a list of watchers, so it will watch all of the following files waiting for changes
    gulp.watch('./source/scss/*.scss', ['sass', 'inline', 'premailer']);
    gulp.watch('./source/html/*.html', ['inline', 'premailer']);
});

// BUILD TASK
gulp.task('default', ['premailer', 'browser-sync'], function () {
  gulp.start('sass', 'inline', 'premailer');
});