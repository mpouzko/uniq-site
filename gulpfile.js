const gulp = require("gulp");

const twig = require("gulp-twig");
const htmlmin = require("gulp-htmlmin");

const babel = require("gulp-babel");
const include = require("gulp-include");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");

const sass = require("gulp-sass");
sass.compiler = require("node-sass");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");

const imagemin = require("gulp-imagemin");

var del = require("del");

const liveServer = require("live-server");

/**
 *
 * Creates optimized CSS Bundles
 *
 * Put your bundle templates in src/css
 * Put your source [s]css modules in src/css/modules
 *
 * Import sources into bundle using //=include or //=require
 * or @import statement
 * See src/css/app.scss for example
 * Those templates will be minified, autoprefixed
 * and transfered to dist/css with sourcemaps
 *
 */

function buildCss() {
  return gulp
    .src("./src/css/*.*ss")
    .on("error", console.log)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(include())
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./dist/css"));
}

/**
 *
 * Compiles Twig HTML templates
 *
 * Put your pages templates in src/html
 * Put your chunks into src/html/chunks
 * Your templates will be processed and put into dist/
 *
 */

function buildHTML() {
  return gulp
    .src("./src/html/*.twig")
    .pipe(twig())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("./dist"));
}

/**
 *
 * Copies icons
 * from src/html into dist/
 *
 *
 */

function copyIcons() {
  return gulp.src("./src/html/*.ico").pipe(gulp.dest("./dist"));
}
/**
 *
 * Moves vendor modules that do not require
 * additional processing
 *
 * Copies everything (include subdirectories)
 * from src/js/vendor into dist/js
 *
 */

function copyVendorJS() {
  return gulp.src("./src/js/vendor/**/*").pipe(gulp.dest("./dist/js/"));
}

/**
 *
 * Moves vendor packages that do not require
 * additional processing
 *
 * Copies everything (include subdirectories)
 * from src/css/vendor into dist/css
 *
 */

function copyVendorCSS() {
  return gulp.src("./src/css/vendor/**.*").pipe(gulp.dest("./dist/css/"));
}

/**
 *
 * Creates optimized JS Bundles
 *
 * Put your bundle templates in src/js
 * Put your source ES5/ES6 scripts into src/js/modules
 *
 * Import sources into bundle using //=include or //=require statement
 * See src/app.js for example
 *
 * Those bundles will be minified, mangled
 * and transfered to dist/js with sourcemaps
 *
 */

function buildJS() {
  return gulp
    .src("./src/js/*.js")
    .pipe(sourcemaps.init())
    .pipe(include())

    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .on("error", console.error)
    .pipe(
      uglify({
        mangle: true,
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./dist/js/"));
}

/**
 *
 * Image optimizer
 *
 * Optimizes your images
 * That are in src/media
 * And copies into dist/media
 *
 */
function imageOptimize() {
  return gulp
    .src("./src/media/**/*")
    .pipe(imagemin([imagemin.mozjpeg(), imagemin.optipng(), imagemin.svgo()]))
    .pipe(gulp.dest("dist/media/"));
}

/**
 *
 * Live reload server
 * Starts automaticaly
 *
 */

function liveReload() {
  var config = {
    port: 3000, // Port to listen
    host: "0.0.0.0", // Bind address
    root: "./dist", // Dir to serve
    open: true, // Open in browser on start
    file: "index.html", // Page for 404
    wait: 1000, // Delay before reload
    logLevel: 2, // Show most of errors
  };

  liveServer.start(config);
}

/**
 *
 * Gulp default task to watch everyting in src/
 * and publish it into dist/
 *
 */

gulp.task("default", function (cb) {
  gulp.watch("./src/css/**/*.(c|sa|sc)ss", buildCss);
  gulp.watch("./src/js/vendor/**/*", copyVendorJS);
  gulp.watch("./src/css/vendor/**/*", copyVendorCSS);
  gulp.watch("./src/js/modules/*.js", buildJS);
  gulp.watch("./src/js/(*.js|es5/*.js)", buildJS);
  gulp.watch("./src/html/**/*.(twig|html)", buildHTML);
  gulp.watch("./src/media/**/*", imageOptimize);
  gulp.watch("./src/html/*.ico", copyIcons);
  liveReload();
  cb();
});

/**
 *
 * Build everyting
 *
 * Wipes (!!!) dist/ folder
 * and creates new bundles
 *
 */

gulp.task("build", function (cb) {
  del.sync("dist/**");
  buildHTML();
  buildCss();
  buildJS();
  copyVendorJS();
  copyVendorCSS();
  imageOptimize();
  cb();
});
