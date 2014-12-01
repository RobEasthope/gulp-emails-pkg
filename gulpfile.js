// Dependencies
var gulp = require('gulp');

// Skip loading each dependency individually and load via gulp-load-plugins task
var gulpLoadPlugins = require('gulp-load-plugins');
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

// WATCH TASK
gulp.task('watch', function () {
   gulp.watch('./source/scss/*.scss', ['sass']);
   gulp.watch('./source/html/*.html', ['inline', 'premailer']);
});

gulp.task('build', function () {
  gulp.start('sass', 'inline', 'premailer');
});

// BUILD TASK
gulp.task('dev', ['sass', 'inline', 'premailer', 'watch']);


// Email testing
