var gulp = require('gulp'),

    // scss/CSS stuff
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-clean-css'),

    // JavaScript
	uglify = require('gulp-uglify'),

	// Images
	svgmin = require('gulp-svgmin'),
	imagemin = require('gulp-imagemin'),

	// Stats and Things
    size = require('gulp-size'),
    
    //Shell Commands
    shell = require('gulp-shell'),

    //Rename
    rename = require('gulp-rename'),

    //Browser-sync
    bs = require('browser-sync').create(), 

    //Babel
    babel = require('gulp-babel'),

    //Sourcemaps
    sourcemaps = require('gulp-sourcemaps');

// Creating folders structure
gulp.task('dir', function() {
    return gulp.src('*.*', {read: false})
    .pipe(gulp.dest('./src/js'))
    .pipe(gulp.dest('./src/scss'))
    .pipe(gulp.dest('./src/img'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(gulp.dest('./dist/img'))
})


//Creating index.html, app.js, style.scss and folders structure
gulp.task('shell', function() {
    return gulp.src('*.js', {read: false})
    .pipe(shell([
      'mkdir src dist src//scss src//js src//img dist//css dist//js dist//img dist//svg dist//font',
      'touch index.html',
      'cd ./src/scss && touch style.scss',
      'cd ./src/js && touch app.js'
    ]))
})

gulp.task('sass', function(){
    return gulp.src('src/scss/*.scss')
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./dist/css'))
        .pipe(bs.reload({stream: true}))
        .pipe(minifycss({debug: true}, (details) => {
                console.log(`${details.name} original: ${details.stats.originalSize}`);
                console.log(`${details.name} minified: ${details.stats.minifiedSize}`);
              }
        ))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/css'))
  });

// Uglify JS
gulp.task('uglify', function(){
    gulp.src('./src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});


// Babel Loader
gulp.task('babel-loader', function(){
    gulp.src('./src/js/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
})

// Images
gulp.task('svgmin', function() {
    gulp.src('./src/img/svg/*.svg')
    .pipe(svgmin())
    .pipe(gulp.dest('./src/img/svg'))
    .pipe(gulp.dest('./dist/img/svg'));
});

gulp.task('imagemin', function () {
    gulp.src('./src/img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./src/img'))
    .pipe(gulp.dest('./dist/img'));
});

// Stats and Things
gulp.task('stats', function () {
    gulp.src('./dist/**/*')
    .pipe(size())
    .pipe(gulp.dest('./dist'));
});

// Browser-sync
gulp.task('browser-sync', ['sass'], function() {
    bs.init({
        server: {
            baseDir: "./"
        }
    });
});

//
gulp.task('watch', ['browser-sync'], function () {
    gulp.watch('./src/scss/**/*.scss', ['sass']);
    gulp.watch('./src/img/**/*', ['imagemin'])
    gulp.watch("*.html").on('change', bs.reload);
});