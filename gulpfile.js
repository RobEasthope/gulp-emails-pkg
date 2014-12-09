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


// HTML BUILD TASK
gulp.task('build', ['sass', 'browser-sync'], function () {
  gulp.src('./source/html/index.html')
    .pipe(plugins.inline({
      base: './',
      css: plugins.minifyCss()
    }))
    .pipe(plugins.premailer())
    .pipe(plugins.replace('{TEST}', 'SUCCESSFUL FULL BUILD TEST'))
    .pipe(gulp.dest('./build/'))
    .pipe(plugins.filter('./build/*.html')) // Filtering stream to only html build files
    .pipe(browserSync.reload({stream:true}));
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
gulp.task('dev', ['sass', 'inline', 'premailer', 'browser-sync'], function() {
    //a list of watchers, so it will watch all of the following files waiting for changes
    gulp.watch('./source/scss/*.scss', ['sass', 'inline', 'premailer']);
    gulp.watch('./source/html/*.html', ['inline', 'premailer']);
});