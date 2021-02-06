const gulp = require('gulp');
const sass = require('gulp-sass');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();

//sass
function cssTask(){
  return gulp.src(['dist/*.scss'])
		.pipe(plumber({ errorHandler: notify.onError("<%= error.message %>") }))
		.pipe(sass({outputStyle: "compressed"}).on("error", sass.logError))
		.pipe(autoprefixer("last 2 version"))
        .pipe(gulp.dest('dist/'))
  		.pipe(browserSync.stream())
}

function serve() {
	browserSync.init({
        server: ""
    });
	gulp.watch('dist/*.scss', cssTask);
	gulp.watch('dist/*.js').on('change', browserSync.reload);
    gulp.watch("*.html").on('change', browserSync.reload);
}

gulp.task('default', serve)