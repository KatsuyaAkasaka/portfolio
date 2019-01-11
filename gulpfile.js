var gulp = require('gulp');
var sass = require('gulp-sass');

// SassとCssの保存先を指定
gulp.task('sass', function(){
	gulp.src('./assets/sass/main.scss')
		.pipe(sass({outputStyle: 'expanded'}))
		.pipe(gulp.dest('./assets/css/'));
});

//自動監視のタスクを作成(sass-watchと名付ける)
gulp.task('default', function() {
	var watcher = gulp.watch("./assets/sass/main.scss", gulp.series('sass'));
	// function() {
	//   gulp.start(['sass']);
	// });
	watcher.on('change', function(event) {
		console.log('File ' + event + ' has been changed.');
	});
});
