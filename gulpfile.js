'use strict';

var del = require('del');
var path = require('path');
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css')
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var webserver = require('gulp-webserver');


var paths = {
    source: 'source',
    build: 'build',
    html: '',
    css: 'stylesheets',
    js: 'javascripts',
    font: 'fonts',
    image: 'images',
};

var source = {
    root: paths.source,
    html: path.join(paths.source, paths.html),
    css: path.join(paths.source, paths.css),
    js: path.join(paths.source, paths.js),
    font: path.join(paths.source, paths.font),
    image: path.join(paths.source, paths.image)
};

var build = {
    root: paths.build,
    html: path.join(paths.build, paths.html),
    css: path.join(paths.build, paths.css),
    js: path.join(paths.build, paths.js),
    font: path.join(paths.build, paths.font),
    image: path.join(paths.build, paths.image)
};

var server = {
    host: 'localhost',
    port: '8000'
};

gulp.task('html', function(){
    return gulp.src(path.join(source.html, '**/*.html'))
	.pipe(gulp.dest(build.html));
});

gulp.task('css', function(){
    return gulp.src(path.join(source.css, '**/*.css'))
	.pipe(concat('all.min.css'))
	.pipe(cleanCSS())
	.pipe(gulp.dest(build.css));
});

gulp.task('js', function(){
    return gulp.src(path.join(source.js, '**/*.js'))
	.pipe(uglify())
	.pipe(concat('all.min.js'))
	.pipe(gulp.dest(build.js));
});

gulp.task('font', function(){
    return gulp.src(path.join(source.font, '**/*'))
	.pipe(gulp.dest(build.font));
});

gulp.task('image', function(){
    var glob = '**/*.+(jpg|jpeg|png|gif|svg)';
    return gulp.src(path.join(source.image, glob))
	.pipe(imagemin())
	.pipe(gulp.dest(build.image));
});

gulp.task('clean', function(callback){
    del([build.root], callback);
});

gulp.task('webserver', function(){
    gulp.src(build.root)
	.pipe(webserver({
	    host: server.host,
	    port: server.port,
	    livereload: true
	}));
});

gulp.task('watch', function(){
    gulp.watch(path.join(source.html, '**/*.html'), ['html']);
    gulp.watch(path.join(source.css, '**/*.css'), ['css']);
    gulp.watch(path.join(source.js, '**/*.js'), ['js']);
});

gulp.task('build', function(callback){
    runSequence(
	'clean',
	['html', 'css', 'js', 'font', 'image'],
	callback
    );
});

gulp.task('start', function(callback) {
    runSequence(
	'build',
	'webserver',
	'watch',
	callback
    )
});
