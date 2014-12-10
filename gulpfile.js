// CONFIGERATION
// Dependencies
var gulp = require('gulp');

// Load browser-sync & gulp-del pkg individually
var browserSync = require('browser-sync');
var del = require('del');

// Skip loading the rest of the dependencies individually and load via gulp-load-plugins task
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();

// Load config file
var config = require('./config.json');

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

// *

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