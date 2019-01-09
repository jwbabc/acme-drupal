const gulp         = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const babel        = require('gulp-babel');
const eslint       = require('gulp-eslint');
const concat       = require('gulp-concat')
const imagemin     = require('gulp-imagemin');
const sass         = require('gulp-sass');
const sasslint     = require('gulp-sass-lint');
const sourcemaps   = require('gulp-sourcemaps');
const uglify       = require('gulp-uglify');
const rename       = require('gulp-rename');
const pump         = require('pump');

const SASS         = 'sass';
const CSS          = 'css';
const IMG          = 'img';
const JS           = 'js';

// Set the gulp-sass compiler for forwards-compatibility
sass.compiler = require('node-sass');

// CSS/SASS Tasks

// SASS linting
// SASS lint configuration is located in .sass-lint.yml
function sassLint() {
  return gulp
    .src(SASS + '/**/*.scss')
    .pipe(sasslint())
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError());
}

// SASS to CSS translation
function sassTranslate() {
  return gulp
    .src(SASS + '/**/*.scss')
    // Generate source maps for debugging
    .pipe(sourcemaps.init(
      {
        largeFile: true
      }
    ))
    // An identity source map will be generated at this step
    .pipe(sourcemaps.identityMap())
    // Translate SASS to CSS
    .pipe(sass().on('error', sass.logError))
    // Add browser vendor prefixes (-webkit, -moz, etc)
    .pipe(autoprefixer(
      {
        browsers: ['> 1%']
      }
    ))
    // Write source maps to directory
    .pipe(sourcemaps.write('/maps'))
    // Write CSS files to directory
    .pipe(gulp.dest(CSS));
}

// Drupal 8 handles aggregation of CSS files

// JS Tasks

// JS linting
function jsLint() {
  return gulp
    .src(JS + '/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

// JS transpilation
function jsBabel() {
  return gulp
    .src([JS + '/lib/*.js', JS + '/*.js'])
    .pipe(babel({presets: ['@babel/env']}))
    .pipe(concat('transpiled.js'))
    .pipe(gulp.dest(JS + '/babel'));
}

// JS uglification and minification
// Outputs js/dist/app.min.js
function jsUglify(cb) {
  pump([
    gulp
      .src(JS + '/babel/*.js')
      .pipe(uglify())
      .pipe(rename({basename: 'app', suffix: '.min'})),
    gulp
      .dest(JS + '/dist')
  ], cb);
}

// Drupal 8 handles aggregation of JS

// Image minification tasks (not currently used)
function imageMin() {
  gulp
    .src(IMG + '/src/*')
    .pipe(imagemin())
    .pipe(gulp.dest(IMG));
}

gulp.task('watch-lint', function(done) {
  var sasswatcher = gulp.watch(SASS + '/**/*.scss', gulp.series(sassLint));
  var jswatcher = gulp.watch([JS + '/**/*.js', '!' + JS + '/dist/*.js'], gulp.series(jsLint));
  done();
});

// Task bundles
gulp.task('build', gulp.series([sassTranslate, jsBabel, jsUglify]));
gulp.task('lint', gulp.series([sassLint, jsLint]));
