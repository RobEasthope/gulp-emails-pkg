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


// DEVELOPMENT TASK
// Build email with local development paths (See config file for )
gulp.task('dev-build', function () {

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
    .pipe(plugins.replace('{TEST}', config.DEVPATH))
    .pipe(gulp.dest('./build/'))
    .pipe(plugins.notify("Development build complete"));
});

// Development watch task
gulp.task('dev', ['dev-build', 'browser-sync'], function() {
    //a list of watchers, so it will watch all of the following files waiting for changes
    gulp.watch('./source/scss/*.scss', ['dev-build'])
    gulp.watch('./source/html/*.html', ['dev-build'])
    .pipe(plugins.filter('./build/*.html')) // Filtering stream to only html build files
    .pipe(browserSync.reload({stream:true}));
});


// DEPLOYMENT TASKS
// Build email with deployment paths
gulp.task('deploy', function () {

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
    .pipe(plugins.replace('{TEST}', config.DEPLOYPATH))
    .pipe(gulp.dest('./build/'))
    .pipe(plugins.notify("Deployment build complete"));
});