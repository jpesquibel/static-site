'use strict';
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const browserSync = require('browser-sync').create();
const image = require('gulp-image');

sass.compiler = require('node-sass');

const watchFiles = () => {
    gulp.watch('./css/**.css', gulp.series('moveCssFiles'));
    gulp.watch('./css/style.scss', gulp.series('sass'));
    //gulp.watch('./js/*.js', gulp.series('compressJs'));
    gulp.watch('./*.html', gulp.series('minifyHtml'));
    gulp.watch('./img/**.*', gulp.series('image'));
};

gulp.task('watch', () => {
    watchFiles();
});

gulp.task('sass', () => {
    return gulp.src('./css/*.scss')
        .pipe(concat('style.scss'))
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./dist/css/'))
});

gulp.task('compressJs', () => {
    return pipeline(
        gulp.src('./js/*.js'),
        uglify(),
        gulp.dest('./dist/js/')
    );
});

gulp.task('minifyHtml', () => {
    return gulp.src('*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('moveCssFiles', async () => {
    gulp.src([
        './css/**.css',
        './css/fonts/**.*'
    ], { base: './' })
        .pipe(gulp.dest('dist'));
});

gulp.task('image', () => {
    return gulp.src('./img/*.{png,jpg,jpeg,gif,svg}')
        .pipe(image())
        .pipe(gulp.dest('./dist/img'));
});

const browserSyncInit = () => {
    browserSync.init({
        server: {
            baseDir: "./dist",
            index: "index.html"
        }
    })
};

gulp.task('browserSync',  browserSyncInit);

gulp.task('start', () => {
    browserSyncInit();
    watchFiles();
});