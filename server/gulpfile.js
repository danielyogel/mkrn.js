#!/usr/bin/env node
var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    Promise = require('bluebird'),
    colors = require('colors'),
    gutil = require('gulp-util'),
    rimraf = require('rimraf'),
    growl = require('growl'),
    istanbul = require('gulp-istanbul'),
    plumber = require('gulp-plumber'),
    babel = require('gulp-babel'),
    sourcemaps = require('gulp-sourcemaps');

// src
var srcDir = 'src/',
//src_all_files = srcDir + './helpers/**/*.js';
    src_all_files = srcDir + '**/*.js';
// dist
var distDir = 'dist/',
    dist_test_files = distDir + 'tests/**/*.js',
    dist_app_files = distDir + 'app/**/*.js',
    dist_all_files = distDir + '**/*.js';

// main
watchTask();

// watch
function watchTask() {
    deleteDistDir().then(compileES6).then(mochaTests).then(logStillWatching);
    gulp.watch([src_all_files], function (event) {
        console.log(('Event type: ' + event.type + 'Event path: ' + event.path).rainbow.bold.inverse);
        deleteDistDir().then(compileES6).then(mochaTests).then(logStillWatching);
    });
}

// tasks
function mochaTests() {
    return promsifyStream('mochaTests', gulp.src(dist_test_files, {read: false})
        .pipe(plumber())
        .pipe(mocha({reporter: 'spec', ignoreLeaks: false, globals: 'globalMocks', timeout: 10000})));
}

function compileES6() {
    return promsifyStream('BABEL', gulp.src(src_all_files)
        .pipe(sourcemaps.init())
        .pipe(babel({whitelist: ['es6.arrowFunctions', 'es6.forOf', 'es6.properties.computed', 'es6.modules', 'es6.destructuring']}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(distDir)));
}

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

function coverage() {
    gulp.src(dist_app_files)
        .pipe(istanbul({includeUntested: true}))
        .on('finish', function () {
            gulp.src(dist_test_files)
                .pipe(mocha())
                .pipe(istanbul.writeReports())
                .on('end', function () {
                    console.log('TEST COVERAGE ENDED '.rainbow.bold.inverse);
                });
        });
}


// helpers
process.on('exit', function (code) {
    if (code === 1) {
        console.log(('Restart manually !!! GulpBird is exiting on error, Exit code: ' + code).underline.red);
        growl('Restart manually !!!', {title: 'GulpBird is exiting, Exit code: ' + code});
        gutil.beep();
    } else {
        console.log(('Restart manually !!! GulpBird is exiting because script ended, Exit code: ' + code).underline.green);
        growl('Restart manually !!!', {title: 'GulpBird is exiting, Exit code: ' + code});
        gutil.beep();
    }
});

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
