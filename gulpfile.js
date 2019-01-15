const gulp = require('gulp');
const sass = require('gulp-sass');
const logger = require('gulp-logger');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');
const cleanHTML = require('gulp-htmlmin');

// SassとCssの保存先を指定
gulp.task('sass', done => {
	gulp.src('./assets/src/sass/*.scss')
		.pipe(logger({
			before: 'Start Compiling...',
      after: 'Compile Finished!',
      extname: '.scss',
      showChange: true
		}))
		.pipe(sass({outputStyle: 'expanded'})).on('error', sass.logError)
		.pipe(gulp.dest('./assets/src/css/'));
	done();
});

gulp.task('css-minify', done => {
	gulp.src(['./assets/src/css/*.css', '!./assets/src/css/*.min.css'])
    .pipe(cleanCSS())
		.pipe(rename({ extname: '.min.css' }))
		.pipe(gulp.dest('./assets/dest/css/'));

	gulp.src(['!./assets/src/css/*.css', './assets/src/css/*.min.css'])
		.pipe(gulp.dest('./assets/dest/css/'));
	done();
});

gulp.task('js-minify', done => {
	gulp.src(['./assets/src/js/*.js', '!./assets/src/js/*.min.js'])
		.pipe(logger({
			before: 'Start Minifying...',
			after: 'Minify Finished!',
			extname: '.js',
			showChange: true
		}))
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
		.pipe(uglify())
		.pipe(rename({extname: '.min.js'}))
		.pipe(gulp.dest('./assets/dest/js/'));
	gulp.src(['!./assets/src/js/*.js', './assets/src/js/*.min.js'])
		.pipe(gulp.dest('./assets/dest/js/'));
	done();
});

gulp.task('html-minify', done => {
	gulp.src(['./assets/src/html/*.html', '!./assets/src/html/*.min.html'])
		.pipe(logger({
			before: 'Start Minifying...',
      after: 'Minify Finished!',
      extname: '.html',
      showChange: true
		}))
    .pipe(cleanHTML({
        collapseWhitespace : true,
        removeComments : true
    }))
		.pipe(rename({extname: '.min.html'}))
    .pipe(gulp.dest('./'));
	done();
});


gulp.task('watch', () => {
	let watchSCSS = gulp.watch(["./assets/src/sass/*.scss", "./assets/src/sass/**/*.scss"], gulp.series('sass', 'css-minify'));
	let watchJS = gulp.watch(["./assets/src/js/*.js"], gulp.series('js-minify'));
	let watchHTML = gulp.watch(['./assets/src/html/*.html'], gulp.series('html-minify'));
});

//自動監視のタスクを作成(sass-watchと名付ける)
gulp.task('default',	gulp.series('sass', 'css-minify', 'js-minify', 'html-minify', 'watch'));
