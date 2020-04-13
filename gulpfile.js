const gulp = require("gulp");

const twig = require("gulp-twig");
const htmlmin = require("gulp-htmlmin");

const babel = require("gulp-babel");
const include = require("gulp-include");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");

const sassLint = require("gulp-sass-lint");

var liveServer = require("live-server");

const LIVE_PORT = 3000;

function buildCss() {
  return gulp
    .src("./src/css/*.scss")

    .pipe(
      sassLint({
        options: {
          formatter: "stylish",
          "merge-default-rules": false,
        },

        rules: {
          "no-ids": 1,
          "no-mergeable-selectors": 0,
          indentaion: 0,
        },
      })
    )
    .pipe(
      sassLint.format({
        formatter: "stylish",
      })
    )
    .pipe(sassLint.failOnError());
}

function buildHTML() {
  return gulp
    .src("./src/html/*.twig")
    .pipe(twig())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("./dist"));
}

function copyVendorJS() {
  return gulp.src("./src/js/vendor/*.js").pipe(gulp.dest("./dist/js/"));
}

function buildJS() {
  return gulp
    .src("./src/js/*.js")
    .pipe(include())
    .pipe(sourcemaps.init())
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

function liveReload() {
  var params = {
    port: LIVE_PORT, // Set the server port. Defaults to 8080.
    host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
    root: "./dist", // Set root directory that's being served. Defaults to cwd.
    open: true, // When false, it won't load your browser by default.
    ignore: "scss,my/templates", // comma-separated string for paths to ignore
    file: "index.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
    wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
    mount: [["/components", "./node_modules"]], // Mount a directory to a route.
    logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
    middleware: [
      function (req, res, next) {
        next();
      },
    ], // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
  };
  liveServer.start(params);
}

gulp.task("build", function (cb) {
  liveReload();
  gulp.watch("./src/css/*.s[ac?]ss", buildCss);
  gulp.watch("./src/js/vendor/*.js", copyVendorJS);
  gulp.watch("./src/js/modules/*.js", buildJS);
  gulp.watch("./src/js/(*.js|es5/*.js)", buildJS);
  gulp.watch("./src/html/**/*.(twig|html)", buildHTML);
  cb();
});
