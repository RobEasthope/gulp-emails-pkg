// CONFIG
// Dependencies
var gulp = require('gulp');

// Load config file
var config = require('./config.json');

// Skip loading each dependency individually and load via gulp-load-plugins task
var gulpLoadPlugins = require('gulp-load-plugins');
var browserSync = require('browser-sync');
var plugins = gulpLoadPlugins();


// Browser-sync settings
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


// CSS COMPILE
gulp.task('sass', function () {
    gulp.src('./source/scss/_css-compile/*.scss')
        .pipe(plugins.sass())
        .pipe(gulp.dest('./source/css/'));
});


// HTML BUILD TASK
gulp.task('html-build', function () {
  gulp.src('./source/html/index.html')
    .pipe(plugins.inline({
      base: './',
      css: plugins.minifyCss()
    }))
    .pipe(plugins.premailer())
    .pipe(plugins.replace('{TEST}', 'SUCCESSFUL FULL BUILD TEST'))
    .pipe(gulp.dest('./build/'))
});


// WATCH TASK
gulp.task('dev', ['browser-sync'], function() {
    //a list of watchers, so it will watch all of the following files waiting for changes
    gulp.watch('./source/scss/*.scss', ['sass', 'html-build']);
    gulp.watch('./source/html/*.html', ['html-build']);
    .pipe(plugins.filter('./build/*.html')) // Filtering stream to only html build files
    .pipe(browserSync.reload({stream:true}));
});