const gulp = require('gulp');
const sass = require('gulp-sass');
const logger = require('gulp-logger');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const babel = require('gulp-babel');


// SassとCssの保存先を指定
gulp.task('sass', done => {
	gulp.src('./assets/sass/*.scss')
		.pipe(logger({
			before: 'Start Compiling...',
      after: 'Compile Finished!',
      extname: '.scss',
      showChange: true
		}))
		.pipe(sass({outputStyle: 'expanded'})).on('error', sass.logError)
		.pipe(gulp.dest('./assets/css/'));
	done();
});

gulp.task('js-minify', done => {
	gulp.src(['./assets/js/*.js', '!./assets/js/*.min.js'])
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
		.pipe(gulp.dest('./assets/js/'));
	done();
});


gulp.task('watch', () => {
	let watchSCSS = gulp.watch(["./assets/sass/*.scss", "./assets/sass/**/*.scss"], gulp.series('sass'));
	let watchJS = gulp.watch(["./assets/js/*.js", '!./assets/js/*.min.js'], gulp.series('js-minify'));

	// watchSCSS.on('change', function(event) {
	//   console.log('File ' + event + ' has been changed.');
	// });
	// watchJS.on('change', function(event) {
	//   console.log('File ' + event + ' has been minified.');
	// });
});

//自動監視のタスクを作成(sass-watchと名付ける)
gulp.task('default',	gulp.series('sass', 'js-minify', 'watch'));
