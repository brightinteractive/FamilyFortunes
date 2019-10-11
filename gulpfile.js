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
gulp.task("sass", function () {
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
		.pipe(reload())
});


// JS
gulp.task('js', function () {
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
});


// HTML
gulp.task('html', function () {
	gulp.src(config.html)
		.pipe(changed(config.production ? config.dist : config.tmp))
		.pipe(plumber())
		.pipe(config.production ? htmlmin({
			collapseWhitespace: true
		}) : util.noop())
		.pipe(gulp.dest(config.production ? config.dist : config.tmp))
		.pipe(reload());
});


// IMAGES
gulp.task('images', function () {
	gulp.src(config.images)
		.pipe(gulp.dest((config.production ? config.dist : config.tmp) + 'assets/img'))
});


// FONTS
gulp.task('fonts', function () {
	gulp.src(config.fonts)
		.pipe(gulp.dest((config.production ? config.dist : config.tmp) + 'assets/font'))
});


// AUDIO
gulp.task('audio', function () {
	gulp.src(config.audio)
		.pipe(gulp.dest((config.production ? config.dist : config.tmp) + 'assets/audio'))
});


// CLEAN
gulp.task('clean', function () {
	gulp.src(['tmp', 'dist'], {
			read: false
		})
		.pipe(clean());
});


// BROWSERSYNC
gulp.task('browser-sync', function () {
	browserSync.init({
		server: {
			baseDir: config.production ? config.dist : config.tmp
		}
	});
});


// WATCH
gulp.task('watch', function () {
	gulp.watch('src/assets/css/**/*.scss', ['sass'])
	gulp.watch('src/assets/img/**/*', ['images'])
	gulp.watch('src/assets/js/**/*.js', ['js'])
	gulp.watch(['src/*.html'], ['html'])
});


// DEFAULT TASK
gulp.task('default', ['sass', 'images', 'js', 'html', 'audio', 'fonts', 'browser-sync', 'watch']);
gulp.task('build', ['sass', 'images', 'js', 'html', 'audio', 'fonts']);