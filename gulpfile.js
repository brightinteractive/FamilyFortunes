var gulp = require('gulp'),
	util = require('gulp-util'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	sourcemaps = require('gulp-sourcemaps'),
	jshint = require('gulp-jshint'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	htmlmin = require('gulp-htmlmin'),
	clean = require('gulp-clean'),
	changed = require('gulp-changed'),
	plumber = require('gulp-plumber'),
	browserSync = require('browser-sync'),
	reload = browserSync.stream;

var config = {
	scss: 'src/assets/css/styles.scss',
	js: 'src/assets/js/*.js',
	html: 'src/*.html',
	audio: 'src/assets/audio/**/*',
	images: 'src/assets/img/**/*',
	fonts: 'src/assets/font/*',
	tmp: 'tmp/',
	dist: 'dist/',
	production: !!util.env.production
};


// SASS
gulp.task("sass", done => {
	gulp.src(config.scss)
		.pipe(plumber())
		.pipe(config.production ? util.noop() : sourcemaps.init())
		.pipe(config.production ?
			sass({
				outputStyle: 'compressed'
			}).on('error', sass.logError) :
			sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions', '> 1%'],
			cascade: false
		}))
		.pipe(config.production ? util.noop() : sourcemaps.write())
		.pipe(gulp.dest((config.production ? config.dist : config.tmp) + 'assets/css'))
		.pipe(reload());
	done();
});


// JS
gulp.task('js', done => {
	gulp.src(config.js)
		.pipe(plumber())
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(config.production ? util.noop() : sourcemaps.init())
		.pipe(concat('scripts.js'))
		.pipe(config.production ? uglify() : util.noop())
		.pipe(config.production ? util.noop() : sourcemaps.write())
		.pipe(gulp.dest((config.production ? config.dist : config.tmp) + 'assets/js'))
		.pipe(reload());
	done();
});


// HTML
gulp.task('html', done => {
	gulp.src(config.html)
		.pipe(changed(config.production ? config.dist : config.tmp))
		.pipe(plumber())
		.pipe(config.production ? htmlmin({
			collapseWhitespace: true
		}) : util.noop())
		.pipe(gulp.dest(config.production ? config.dist : config.tmp))
		.pipe(reload());
	done();
});


// IMAGES
gulp.task('images', done => {
	gulp.src(config.images)
		.pipe(gulp.dest((config.production ? config.dist : config.tmp) + 'assets/img'));
	done();
});


// FONTS
gulp.task('fonts', done => {
	gulp.src(config.fonts)
		.pipe(gulp.dest((config.production ? config.dist : config.tmp) + 'assets/font'));
	done();
});


// AUDIO
gulp.task('audio', done => {
	gulp.src(config.audio)
		.pipe(gulp.dest((config.production ? config.dist : config.tmp) + 'assets/audio'));
	done();
});


// CLEAN
gulp.task('clean', done => {
	gulp.src(['tmp', 'dist'], {
			read: false
		})
		.pipe(clean());
	done();
});


// BROWSERSYNC
gulp.task('browser-sync', done => {
	browserSync.init({
		server: {
			baseDir: config.production ? config.dist : config.tmp
		}
	});
	done();
});


// WATCH
gulp.task('watch', done => {
	gulp.watch('src/assets/css/**/*.scss', gulp.series('sass'));
	gulp.watch('src/assets/img/**/*', gulp.series('images'));
	gulp.watch('src/assets/js/**/*.js', gulp.series('js'));
	gulp.watch(['src/*.html'], gulp.series('html'));
	done();
});


// DEFAULT TASK
gulp.task('default', gulp.series('sass', 'images', 'js', 'html', 'audio', 'fonts', 'browser-sync', 'watch'), done => {done();});
gulp.task('build', gulp.series('sass', 'images', 'js', 'html', 'audio', 'fonts'), done => {done();});