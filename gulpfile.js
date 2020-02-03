const {src, dest, parallel, series, watch} = require('gulp');
const del = require('del');
const path = require('path');
const sass = require("gulp-sass");
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const ts = require('gulp-typescript');
const uglify = require('gulp-uglify');
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
    TARGET: path.join(paths.build, paths.html)
  },
  SASS: {
    SOURCE: path.join(paths.source, paths.css, '**/*.scss'),
    TARGET: path.join(paths.build, paths.css)
  },
  'TS': {
    SOURCE: path.join(paths.source, paths.js, '**/*.ts'),
    TARGET: path.join(paths.build, paths.js)
  },
  'FONT': {
    SOURCE: path.join(paths.source, paths.font, '**/*'),
    TARGET: path.join(paths.build, paths.font)
  },
  'IMAGE': {
    SOURCE: path.join(paths.source, paths.image, '**/*.+(jpg|jpeg|png|gif|svg)'),
    TARGET: path.join(paths.build, paths.image)
  },
  BROWSERSYNC: {
    DOCUMENT_ROOT: paths.build,
    INDEX: 'index.html',
    GHOSTMODE: {
      clicks : false,
      forms  : false,
      scroll : false,
    }
  }
};

const source = {
  root: paths.source,
  html: path.join(paths.source, paths.html),
  css: path.join(paths.source, paths.css),
  js: path.join(paths.source, paths.js),
  font: path.join(paths.source, paths.font),
  image: path.join(paths.source, paths.image)
};

const build = {
  root: paths.build,
  html: path.join(paths.build, paths.html),
  css: path.join(paths.build, paths.css),
  js: path.join(paths.build, paths.js),
  font: path.join(paths.build, paths.font),
  image: path.join(paths.build, paths.image)
};

const server = {
  host: 'localhost',
  port: '8000'
};

const browserSyncOption = {
  port: 8000,
  server: {
    baseDir: build.root,
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
  return src(path.join(source.html, '**/*.html'))
    .pipe(dest(build.html))
}

function css(){
  return src(path.join(source.css, '**/*.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('all.min.css'))
    .pipe(cleanCSS())
    .pipe(dest(build.css))
}

function typescript(){
  return src(path.join(source.js, '**/*.ts'))
    .pipe(ts({
      noImplicitAny: true,
      outFile: 'all.min.js'
    }))
    .pipe(uglify())
    .pipe(dest(build.js))
}

function font(){
  return src(path.join(source.font, '**/*'))
  .pipe(dest(build.font));
}

function image(){
  const glob = '**/*.+(jpg|jpeg|png|gif|svg)';
  return src(path.join(source.image, glob))
    .pipe(imagemin())
    .pipe(dest(build.image));
}

function clean(callback){
  return del([build.root], callback);
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
  watch(CONF.BROWSERSYNC.DOCUMENT_ROOT + '/**/*.html').on('change', series(browserReload));
  watch(CONF.SASS.SOURCE).on('change', series(css, browserReload));
  watch(CONF.TS.SOURCE).on('change', series(typescript, browserReload));
}

exports.clean = clean;
exports.build = series(
    clean,
    parallel(html, css, typescript, font, image),
);
exports.start = series(
    exports.build,
    series(browsersync, watchFiles)
);
exports.default = exports.start;

