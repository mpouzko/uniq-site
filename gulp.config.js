module.exports = {
  html: {
    minify: false, // Will resulting HTML be minified, or not (true/false)
  },
  js: {
    sourcemaps: true, // Will sourcemaps be created in dist/js, or not (true/false)
    minify: true, // Will resulting bundle be minified, or not (true/false)
    hash_names: true, // Will bundle filenames be hashed, or not
  },
  css: {
    sourcemaps: true, // Will sourcemaps be created in dist/css, or not (true/false)
    minify: true, // Will resulting bundle be minified, or not (true/false)
    hash_names: true, // Will bundle filenames be hashed, or not
  },
  server: {
    port: 3000, // Port to listen
    host: "0.0.0.0", // Bind address
    root: "./dist", // Dir to serve
    open: "true", // Open in browser on start
    file: "index.html", // Page for 404
    wait: 1000, // Delay before reload
    logLevel: 2, // Show most of errors
  },
};
