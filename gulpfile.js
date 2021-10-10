const fs = require("fs");
const gulp = require("gulp");
const gulpif = require("gulp-if");
const hash = require("gulp-hash");

const twig = require("gulp-twig");
const htmlmin = require("gulp-htmlmin");
const prettify = require("gulp-html-prettify");

const babel = require("gulp-babel");
const include = require("gulp-include");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");

const sass = require("gulp-sass")(require("node-sass"));
sass.compiler = require("node-sass");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");

const imagemin = require("gulp-imagemin");

var del = require("del");

const liveServer = require("live-server");

const config = require("./gulp.config");

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

function buildCSS() {
  return gulp
    .src("./src/css/*.*ss")
    .on("error", console.log)
    .pipe(gulpif(config.css.sourcemaps, sourcemaps.init()))
    .pipe(sass().on("error", sass.logError))
    .pipe(include())
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(gulpif(config.css.minify, cleanCSS({ compatibility: "ie8" })))
    .pipe(gulpif(config.css.hash_names, hash()))
    .pipe(gulpif(config.css.sourcemaps, sourcemaps.write(".")))
    .pipe(gulp.dest("./dist/css"))
    .pipe(
      gulpif(
        config.css.hash_names,
        hash.manifest("./src/manifest.css.json", {
          // Generate the manifest file
          deleteOld: true,
          sourceDir: "./dist/css/",
        })
      )
    )
    .pipe(gulpif(config.css.hash_names, gulp.dest(".")));
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
  const manifest = createManifest();
  return gulp
    .src("./src/html/*.twig")
    .pipe(
      twig({
        data: { ...manifest },
      })
    )
    .pipe(
      gulpif(
        config.html.minify,
        htmlmin({ collapseWhitespace: true }),
        prettify({ indent_char: " ", indent_size: 2 })
      )
    )
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
  gulp.src("./src/css/vendor/**.*").pipe(gulp.dest("./dist/css/"));
  return gulp.src("./src/css/vendor/*/**.*").pipe(gulp.dest("./dist/css/"));
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
    .pipe(gulpif(config.js.sourcemaps, sourcemaps.init()))
    .pipe(include())
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .on("error", console.error)
    .pipe(
      gulpif(
        config.js.minify,
        uglify({
          mangle: true,
        })
      )
    )
    .pipe(gulpif(config.js.hash_names, hash()))
    .pipe(gulpif(config.js.sourcemaps, sourcemaps.write(".")))
    .pipe(gulp.dest("./dist/js/"))
    .pipe(
      gulpif(
        config.js.hash_names,
        hash.manifest("./src/manifest.js.json", {
          // Generate the manifest file
          deleteOld: true,
          sourceDir: "./dist/js/",
        })
      )
    )
    .pipe(gulpif(config.js.hash_names, gulp.dest(".")));
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
    .src("./src/media/*/*.*")
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
  liveServer.start(config.server);
}

/**
 *
 * Gulp default task to watch everyting in src/
 * and publish it into dist/
 *
 */

gulp.task("default", function (cb) {
  gulp.watch("./src/css/**/*.(c|sa|sc)ss", buildCSS);
  gulp.watch("./src/js/vendor/**/*", copyVendorJS);
  gulp.watch("./src/css/vendor/**/*", copyVendorCSS);
  gulp.watch("./src/js/modules/*.js", buildJS);
  gulp.watch("./src/js/(*.js|es5/*.js)", buildJS);
  gulp.watch("./src/html/**/*.(twig|html)", buildHTML);
  gulp.watch("./src/*.json", buildHTML);
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
  del.sync("dist/*");
  gulp.series(
    buildCSS,
    buildJS,
    buildHTML,
    copyVendorJS,
    copyVendorCSS,
    imageOptimize,
    copyIcons
  )();
  cb();
});

/**
 *
 * Helper function to create hashed bundles manifest
 * for HTML templating
 *
 */

function createManifest() {
  const result = {};
  if (config.css.hash_names) {
    result.css = {};
    const srccss = JSON.parse(fs.readFileSync("./src/manifest.css.json"));
    for (let asset in srccss) {
      result.css[asset] = "/css/" + srccss[asset];
    }
  }
  if (config.js.hash_names) {
    result.js = {};
    const srcjs = JSON.parse(fs.readFileSync("./src/manifest.js.json"));
    for (let asset in srcjs) {
      result.js[asset] = "/js/" + srcjs[asset];
    }
  }

  return result;
}
