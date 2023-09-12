//  Globs - EDIT HERE
const globs = {
  html: "project/*.html",
  css: "project/css/**/*.css",
  js: "project/js/*.js",
  img: "project/pics/*",
};

// Task for html files
const { src, dest } = require("gulp");
const replace = require("gulp-replace");
const htmlMin = require("gulp-html-minifier-terser");
function htmlTask() {
  // read all HTML files
  return (
    src(globs.html)
      //   Minify html files
      .pipe(htmlMin({ collapseWhitespace: true, removeComments: true }))
      //   Remove all the css links
      .pipe(replace(/<link.*?href=['"](.*?)['"].*?>/g, ""))
      //   Add the new css link
      .pipe(
        replace(
          "</head>",
          '<link rel="stylesheet" href="./assets/style.min.css">\n</head>'
        )
      )
      //   To replace the pics folder path to images folder path
      .pipe(replace("pics", "images"))
      //   move to production folder(dist)
      .pipe(dest("dist"))
  );
}
// exports.htmlTask = htmlTask;

// Task for css files
const concat = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");
function cssTask() {
  // read all CSS files
  return (
    src(globs.css)
      // reduce resources - concat resource files
      .pipe(concat("style.min.css"))
      // minify the produced css file
      .pipe(cleanCSS())
      // move the file to the production folder
      .pipe(dest("dist/assets"))
  );
}
// exports.cssTask = cssTask;

// Task for JS files
const terser = require("gulp-terser");
function jsTask() {
  return src(globs.js)
    .pipe(concat("sctipt.min.js"))
    .pipe(terser())
    .pipe(dest("dist/assets"));
}
// exports.jsTask = jsTask;

//Task for images
const imgOptimize = require("gulp-optimize-images");
function imgTask() {
  return (
    src(globs.img)
      // compress images
      .pipe(
        imgOptimize({
          compressOptions: {
            jpeg: {
              quality: 85,
            },
            png: {
              quality: 60,
            },
          },
        })
      )
      .pipe(dest("dist/images"))
  );
}
// exports.imgTask = imgTask;

// To have a global task handler to use as default by gulp:
const { series } = require("gulp");
// exports.default = series(htmlTask, cssTask, jsTask, imgTask);

// Parallel
const { parallel } = require("gulp");
exports.default = parallel(htmlTask, cssTask, jsTask, imgTask);
