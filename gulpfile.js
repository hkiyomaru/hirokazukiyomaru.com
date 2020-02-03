const {src, dest, parallel, series, watch} = require('gulp');
const del = require('del');
const path = require('path');
const sass = require("gulp-sass");
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const imagemin = require('gulp-imagemin');
const browserSync  = require('browser-sync');

const paths = {
  source: 'source',
  build: 'build',
  html: '',
  css: 'stylesheets',
  js: 'javascripts',
  font: 'fonts',
  image: 'images',
};

const CONF = {
  HTML: {
    SOURCE: path.join(paths.source, paths.html, '**/*.html'),
    OUTPUT: path.join(paths.build, paths.html)
  },
  SASS: {
    SOURCE: path.join(paths.source, paths.css, '**/*.scss'),
    OUTPUT: path.join(paths.build, paths.css)
  },
  JS: {
    SOURCE: path.join(paths.source, paths.js, '**/*.js'),
    OUTPUT: path.join(paths.build, paths.js)
  },
  FONT: {
    SOURCE: path.join(paths.source, paths.font, '**/*'),
    OUTPUT: path.join(paths.build, paths.font)
  },
  IMAGE: {
    SOURCE: path.join(paths.source, paths.image, '**/*.+(jpg|jpeg|png|gif|svg)'),
    OUTPUT: path.join(paths.build, paths.image)
  },
  BROWSERSYNC: {
    DOCUMENT_ROOT: paths.source,
    INDEX: 'index.html',
    GHOSTMODE: {
      clicks : false,
      forms  : false,
      scroll : false,
    }
  }
};

const bootstrapSass = {
  SOURCE: 'node_modules/bootstrap/scss'
};

const browserSyncOption = {
  port: 8000,
  server: {
    baseDir: paths.build,
    index: 'index.html',
  },
  ghostMode: {
    clicks : false,
    forms  : false,
    scroll : false,
  },
  reloadOnRestart: true,
};

function html(){
  return src(CONF.HTML.SOURCE)
    .pipe(dest(CONF.HTML.OUTPUT))
}

function css(){
  return src(CONF.SASS.SOURCE)
    .pipe(sass({
      'includePaths': [bootstrapSass.SOURCE]
    }))
    .pipe(postcss([autoprefixer()]))
    .pipe(concat('all.min.css'))
    .pipe(cleanCSS())
    .pipe(dest(CONF.SASS.OUTPUT))
}

function javascript(){
  return src(CONF.JS.SOURCE)
    .pipe(concat('all.min.js'))
    .pipe(dest(CONF.JS.OUTPUT))
}

function font(){
  return src(CONF.FONT.SOURCE)
  .pipe(dest(CONF.FONT.OUTPUT));
}

function image(){
  return src(CONF.IMAGE.SOURCE)
    .pipe(imagemin())
    .pipe(dest(CONF.IMAGE.OUTPUT));
}

function clean(callback){
  return del([paths.build], callback);
}

function browsersync(done) {
  browserSync.init(browserSyncOption);
  done();
}

function watchFiles(done) {
  const browserReload = () => {
    browserSync.reload();
    done();
  };
  watch(CONF.BROWSERSYNC.DOCUMENT_ROOT + '/**/*.html').on('change', series(html, browserReload));
  watch(CONF.SASS.SOURCE).on('change', series(css, browserReload));
  watch(CONF.JS.SOURCE).on('change', series(javascript, browserReload));
}

exports.clean = clean;
exports.build = series(
    clean,
    parallel(html, css, javascript, font, image),
);
exports.start = series(
    exports.build,
    series(browsersync, watchFiles)
);
exports.default = exports.start;
