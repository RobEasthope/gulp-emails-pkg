// CONFIGERATION
// Dependencies
var gulp = require('gulp');

// Load browser-sync, gulp-del, and fs pkgs individually
var browserSync = require('browser-sync');
var del = require('del');
var fs = require("fs");

// Skip loading the rest of the dependencies individually and load via gulp-load-plugins task
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();

// Load project config file
var config = require('./config.json');

// Load AWS S3 config file
aws = JSON.parse(fs.readFileSync('./aws.json'));

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


// *


// CLEAN TASK
gulp.task('clean', function (cb) {
  del([
    './build/**'
  ], cb);
});

// DEVELOPMENT TASKS
// Build email with local development paths (See config file for )
gulp.task('dev-build', ['clean'], function () {

  // Compile css
  gulp.src('./source/scss/_css-compile/*.scss')
      .pipe(plugins.sass())
      .pipe(gulp.dest('./source/css/'));

  // Inline css
  gulp.src('./source/html/index.html')
    .pipe(plugins.inline({
      base: './',
      css: plugins.minifyCss()
    }))
    .pipe(plugins.premailer())
    .pipe(plugins.replace('{{IMAGE-PATH}}', config.DEVPATH))
    .pipe(gulp.dest('./build/'))
    
    .pipe(plugins.notify("Development build complete"));
});

// Development watch task
gulp.task('dev', ['dev-build', 'browser-sync'], function() {
    // Watch entire source directory for changes
    gulp.watch('./source/*/*.*', ['dev-build'])
    .pipe(plugins.filter('./build/*.html')) // Filtering stream to only html build files
    .pipe(browserSync.reload({stream:true}));
});

// Development watch task sans Browser-Sync
gulp.task('watch', ['dev-build'], function() {
    // Watch entire source directory for changes
    gulp.watch('./source/*/*.*', ['dev-build']);
});


// *


// DEPLOYMENT TASKS
// Build email with deployment paths
gulp.task('deploy', ['clean'], function () {

  // Compile css
  gulp.src('./source/scss/_css-compile/*.scss')
      .pipe(plugins.sass())
      .pipe(gulp.dest('./source/css/'));

  // Inline css
  gulp.src('./source/html/index.html')
    .pipe(plugins.inline({
      base: './',
      css: plugins.minifyCss()
    }))
    .pipe(plugins.premailer())
    .pipe(plugins.replace('{{IMAGE-PATH}}', config.DEPLOYPATH))
    .pipe(gulp.dest('./build/'))
    .pipe(plugins.notify("Deployment build complete"));
});

// Push images to AWS S3
gulp.task('aws-push', function() {
    gulp.src('./source/images/**')
        .pipe(plugins.s3(aws));
});