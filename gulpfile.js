const {series, watch, src, dest, parallel} = require('gulp');
const pump = require('pump');

const livereload = require('gulp-livereload');
const postcss = require('gulp-postcss');
const zip = require('gulp-zip');
const uglify = require('gulp-uglify-es').default;
const beeper = require('beeper');

const autoprefixer = require('autoprefixer');
const colorFunction = require('postcss-color-function');
const cssnano = require('cssnano');
const customProperties = require('postcss-custom-properties');
const easyimport = require('postcss-easy-import');
const sass = require('gulp-sass');

function serve(done) {
  livereload.listen();
  done();
}

const handleError = (done) => {
  return function (err) {
    if (err) {
      beeper();
    }
    return done(err);
  };
};

function hbs(done) {
  pump([
      src(['*.hbs', 'partials/**/*.hbs', '!node_modules/**/*.hbs']),
      livereload()
  ], handleError(done));
}

function fonts(done) {
  pump([
    src('assets/src/fonts/**', {}),
    dest('assets/dist/fonts/', {}),
    livereload()
  ], handleError(done));
}

function images(done) {
  pump([
    src('assets/src/images/**', {}),
    dest('assets/dist/images/', {}),
    livereload()
  ], handleError(done));
}

function css(done) {
  var processors = [
    easyimport,
    customProperties({preserve: false}),
    colorFunction(),
    autoprefixer({browsers: ['last 2 versions']}),
    cssnano()
  ];

  pump([
    src('assets/src/css/*.css', {sourcemaps: true}),
    postcss(processors),
    dest('assets/dist/', {sourcemaps: '.'}),
    livereload()
  ], handleError(done));
}

function scss(done) {
  pump([
    src('assets/src/styles/*.scss', {sourcemaps: true}),
    sass(),
    dest('assets/dist/', {sourcemaps: '.'}),
    livereload()
  ], handleError(done));
}

function js(done) {
  pump([
    src('assets/src/scripts/**/*.js', {sourcemaps: true}),
    uglify(),
    dest('assets/dist/scripts/', {sourcemaps: '.'}),
    livereload()
  ], handleError(done));
}

function zipper(done) {
  var targetDir = 'dist/';
  var themeName = require('./package.json').name;
  var filename = themeName + '.zip';

  pump([
    src([
      '**',
      '!node_modules', '!node_modules/**',
      '!dist', '!dist/**'
    ]),
    zip(filename),
    dest(targetDir)
  ], handleError(done));
}

const jsWatcher = () => watch('assets/src/scripts/**', js);
const fontWatcher = () => watch('assets/src/fonts/**', fonts);
const imageWatcher = () => watch('assets/src/images/**', images);
const sassWatcher = () => watch('assets/src/styles/**', scss);
const cssWatcher = () => watch('assets/src/css/**', css);
const hbsWatcher = () => watch(['*.hbs', 'partials/**/*.hbs', '!node_modules/**/*.hbs'], hbs);
const watcher = parallel(cssWatcher, hbsWatcher, sassWatcher, imageWatcher, fontWatcher, jsWatcher);
const build = series(css, js, scss, images, fonts);
const dev = series(build, serve, watcher);

exports.build = build;
exports.zip = series(build, zipper);
exports.default = dev;
