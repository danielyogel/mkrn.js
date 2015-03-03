// libs
var Promise = require('bluebird'),
    gulp = require('gulp'),
    rimraf = require('rimraf'),
    colors = require('colors'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    babelify = require("babelify"),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    sourcemaps = require('gulp-sourcemaps'),
    watchify = require('watchify'),
    karma = require('karma'),
    gutil = require('gulp-util'),
    browserSync = require('browser-sync');

// src
var srcDir = 'src/';
var testsDir = 'tests/';
var src_js_files = srcDir + '**/*.js';
var src_mainjs = srcDir + 'main.js';
var src_scss_files = srcDir + '**/*.scss';
var src_scss_main = srcDir + 'main.scss';
var src_unit_tests_files = testsDir + '**/*.js';
// dist
var distDir = 'dist/',
    dist_css_dir = distDir + 'css/';

//  WATCH
function watchTask() {
    browserSync({proxy: 'localhost:' + 3000});
    logStillWatching();
    deleteDistDir().then(watchifyBundle).then(karmaWatchify).then(compileSass).then(logStillWatching);
    gulp.watch(src_scss_files, function (event) {
        console.log(('Event type: ' + event.type + 'Event path: ' + event.path).rainbow.bold.inverse);
        deleteCssDir().then(compileSass).then(logStillWatching);
    });
}

/* \-----------------------------------------------/
 *             WATCHIFY
 * /-----------------------------------------------\ */
var bundler = watchify(browserify('./src/main.js', {cache: {}, packageCache: {}, fullPaths: true, debug: true}));
bundler.transform(babelify);
bundler.on('update', watchifyBundle);
bundler.on('log', console.log.bind(this, 'BROWSERIFY BUNDLED -'));
bundler.on('log', logStillWatching);
function watchifyBundle() {
    bundler.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(distDir))
        .pipe(browserSync.reload({stream: true}));
}


/* \-----------------------------------------------/
 *          TDD: KARMA-WATCHIFY
 * /-----------------------------------------------\ */
function karmaWatchify() {
    //return new Promise(function (resolve, reject) {
    karma.server.start({
        frameworks: ['mocha', 'browserify'],
        files: [src_unit_tests_files, {pattern: 'src/**/*.js', watched: true, included: false}],
        reporters: ['spec'],
        preprocessors: {'tests/**/*.js': ['browserify']},
        browsers: ['PhantomJS'/*, 'Firefox'*/],
        logLevel: 'INFO',
        autoWatch: true,
        browserify: {transform: [babelify], debug: true}
    }, function (exitStatus) {
        //exitStatus ? reject(exitStatus) : resolve();
    });
    //});
}

/* \-----------------------------------------------/
 *             SASS
 * /-----------------------------------------------\ */
function compileSass() {
    return promsifyStream('compile scss', sass(src_scss_main)
        .on('error', console.log.bind(this))
        .pipe(autoprefixer({browsers: ['last 3 versions'], cascade: false}))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({stream: true})));
}

/* \---------------------------------------------------------------------------------------------------------------------------------------/
 *          delete functions
 * /---------------------------------------------------------------------------------------------------------------------------------------\ */
function deleteDistDir() {
    return new Promise(function (resolve, reject) {
        console.log(('STARTING deleteDistDir  ').cyan.bold.inverse);
        rimraf(distDir, function (err) {
            if (err) return reject();
            resolve();
            console.log(('ENDED deleteDistDir  ').green.bold.inverse);
        });
    });
}

function deleteCssDir() {
    return new Promise(function (resolve, reject) {
        console.log(('STARTING deleteCssDir  ').cyan.bold.inverse);
        rimraf(dist_css_dir, function (err) {
            if (err) return reject();
            resolve();
            console.log(('ENDED deleteCssDir  ').green.bold.inverse);
        });
    });
}
/*  ================================================================================================================================================================================================
 *  =============    MAIN AND HELPERS   ============================================================================================================================================================
 *  ================================================================================================================================================================================================ */
var args = process.argv.slice(2);
if (args.length > 1) {
    console.log('Only one task is allowed !'.red);
    process.exit(0);
}

switch (args[0]) {
    default:
        watchTask();
        break;
}


/*  =============== HELPERS ==============================================*/
function promsifyStream(name, stream) {
    return new Promise(function (reslove, reject) {
        console.log(('STARTING  ' + name).cyan.bold.inverse);
        stream.on('end', function () {
            reslove();
            console.log(('ENDED  ' + name).green.bold.inverse);
        });
    });
}
function logStillWatching() {
    console.log('Still watching for changes ...'.rainbow.bold.inverse);
}
