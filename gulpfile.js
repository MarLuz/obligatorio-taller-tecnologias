/**
 * @author Martin Luz
 * @since 08/03/2017
 * @version 1.0
 */
var gulp   = require("gulp");
var concat = require("gulp-concat");
var uglify = require('gulp-uglify');

gulp.task('buildJs', function() {
  return gulp.src('./resources/js/**/*.js')
    .pipe(concat('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./resources/dist/'));
});

// Watch changes
gulp.task('watch', function() {
  gulp.watch('./resources/js/**/*.js', ['buildJs']);
});