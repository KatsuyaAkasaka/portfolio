const gulp = require('gulp');
const sass = require('gulp-sass');
const logger = require('gulp-logger');

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

gulp.task('watch', () => {
	var watcher = gulp.watch(["./assets/sass/*.scss", "./assets/sass/**/*.scss"], gulp.series('sass'));

	watcher.on('change', function(event) {
		console.log('File ' + event + ' has been changed.');
	});
});

//自動監視のタスクを作成(sass-watchと名付ける)
gulp.task('default', gulp.series('sass', 'watch'));
