var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var jade = require('gulp-jade');
var nodemon = require('gulp-nodemon');
var rename = require('gulp-rename');
var sh = require('shelljs');
var es = require('event-stream');
var bowerFiles = require('main-bower-files')();
var gulpFilter = require('gulp-filter');
var del = require('del');
var livereload  = require('gulp-livereload');
var express = require('express');
var app = express();
var marked = require('marked'); // For :markdown filter in jade
var path = require('path');


var paths = {
	sass: ['./src/sass/**/*.scss'],
	jade: ['./src/jade/**/*.jade'],
	js: ['./src/js/**/*.js']
};

// additional, not recognized bower files
bowerFiles
	.push("./src/lib/jade/jade.js");

gulp.task('sass', function(done) {
	// www
	gulp.src('./src/sass/style.scss')
		.pipe(sass({
			errLogToConsole: true
		}))
		.pipe(gulp.dest('./dist/css'))
		.pipe(minifyCss({
			keepSpecialComments: 0
		}))
		.pipe(rename({ extname: '.min.css' }))
		.pipe(gulp.dest('./dist/css/'))
		.pipe( livereload())
		.on('end',done);
});


gulp.task('jade', function(done) {
	// TODO: get from config
	var YOUR_LOCALS = {};

	var filterForViews = gulpFilter(['*','!views/']);
	
	del([
		'./dist/views/**/*'
	], function(){
		gulp.src('./src/jade/**/*.jade')
			.pipe(filterForViews)
			.pipe(jade({
				locals: YOUR_LOCALS,
				pretty: true
			}))
			.pipe(filterForViews.restore())
			.pipe(gulp.dest('./dist/'))
			.pipe( livereload())
			.on('end',done);
	});
});


gulp.task("bower-files", function(done){

	// var filterForWww = gulpFilter(['*','!*ionic*']);
	// var filterForMobile = gulpFilter(['*','!*bootstrap*']);
	del([
		'./dist/lib/**/*'
	], function(){
		gulp.src(bowerFiles)
			// .pipe(filterForWww)
			.pipe(gulp.dest("./dist/lib"))
			// .pipe(filterForWww.restore())
			// .pipe(filterForMobile)
			// .pipe(gulp.dest("./mobile/www/lib"))
			.pipe( livereload())
			.on('end',done);
	});
});

gulp.task('js', function(done) {
		//.pipe( uglify() )
		//.pipe( concat('all.min.js'))
	gulp.src('./src/js/**/*.js')
//		.pipe(jshint())
//		.pipe(jshint.reporter('jshint-stylish'))
		.pipe( gulp.dest('./dist/js/'))
		.pipe( livereload())
		.on('end',done);
});


/*gulp.task('nodemon', function () {
	nodemon({
		script: 'index.js',
		ext: 'js json',
		ignore: ["src/*","dist/*"],
		env: { 'NODE_ENV': 'development' }
	})
})
*/

gulp.task('express', function() {
	app.use(express.static(path.resolve('./dist')));
	app.use(require('connect-livereload')({
		port: 35729
	}));
	app.listen(8080);
	gutil.log('Listening on port: 8080');
});


gulp.task('livereload', function(){
	livereload.listen({ basePath: './dist' });
});

gulp.task('watch', function() {
	gulp.watch(paths.sass, ['sass']);
	gulp.watch(paths.jade, ['jade']);
	gulp.watch(paths.js, ['js']);
});

gulp.task('build', ['sass','jade','js','bower-files']);

gulp.task('serve', ['express','livereload','watch']);

gulp.task('default',['build','serve']);