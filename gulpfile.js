/* globals require */
/* jshint node:true */

'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var compass = require('gulp-compass');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var _ = require('lodash');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var del = require('del');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var nodemon = require('gulp-nodemon');

//Build configuration object
var config = {
  watch: false,
  inputFiles: {
    //HTML gets passed through directly
    html: './src/extension/html/*.html',
    //Browserify-compatible start file
    manifest: './src/extension/manifest.json',
    background: './src/extension/js/background.js',
    js: './src/extension/js/start.js',
    jslibs: './src/extension/js/libs/*.js',
    //For library CSS that doesn't get passed through SASS
    images: './src/extension/img/*',
    css: './src/extension/css/*.css',
    fonts: './src/extension/fonts/*',
    scss: ['./src/extension/scss/*.scss',
      './src/extension/scss/**/*.scss'
    ],
    //Server gets copied through directly
    server: './src/server/*',
  },
  outputDirs: {
    server: './dist/server/',
    extension: './dist/extension/',
  },
  outputFiles: {
    js: 'js/app.js',
    //Concat CSS libraries
    css: 'css/libs.css',
    scss: 'css/main.css',
  },
  browserifyOpts: {
    basedir: './',
    paths: [
      './src/extension/js/',
      './src/extension/js/libs/',
    ],
    extensions: ['.html'],
  },
  autoprefixerOpts: {
    cascade: false,
  },
  sassOpts: {
    style: 'expanded',
  },
  bundler: false,
};

//Our browserify transforms
var transforms = {
  dev: {
    compileTemplates: require('node-underscorify').transform({
      extensions: ['html']
    }),
  },
  prod: {
    compileTemplates: require('node-underscorify').transform({
      extensions: ['html']
    }),
    uglifyify: {
      opts: {
        global: true,
      },
      transform: require('uglifyify')
    }
  }
};

//Set our environment, and extend config with environment-specific options
function setEnvironment() {
  config.environment = (gutil.env.hasOwnProperty('env') ? gutil.env.env : 'dev');

  if (config.environment === 'dev') {
    //Dev-only config here
    config.browserifyOpts.debug = true;
  }

  if (config.environment === 'prod') {
    //Production only config here
    //Minify CSS
    config.sassOpts.style = 'compressed';
  }
}

//Log errors
function logError(err) {
  gutil.log('Error! ' + err.message);
}

//Apply browserify stream transforms
function applyTransforms(stream) {
  _.each(transforms[config.environment], function (transform) {
    //If transform object has own options
    if (transform.hasOwnProperty('opts')) {
      //Transform with options
      stream.transform(transform.opts, transform.transform);
    } else {
      //Just transform
      stream.transform(transform);
    }
  });

  return stream;
}

//Get our bundler
function getBundler() {
  if (config.watch) {
    config.bundler = watchify(browserify(config.inputFiles.js, _.extend(config.browserifyOpts, watchify.args)));
  } else {
    config.bundler = browserify(config.inputFiles.js, _.extend(config.browserifyOpts, watchify.args));
  }

  return config.bundler;
}

function bundle() {
  config.bundler
    .bundle()
    .on('error', logError)
  //Pipe bundle into vinyl temporary output file
  .pipe(source(config.outputFiles.js))
  //Write file
  .pipe(gulp.dest(config.outputDirs.extension))
  //Trigger livereload
  .pipe(gulpif(config.watch, reload({
    stream: true
  })));
}

//Build our JS one time
function buildJS() {

  //Get our transformed browserify bundle
  config.bundler = applyTransforms(getBundler());
  if (config.watch) {
    config.bundler.on('update', bundle);
  }

  bundle();

}

//For building libraries
function buildCSS() {
  //Move our libraries
  return gulp.src(config.inputFiles.css)
    .pipe(gulpif(config.environment === 'prod', concat(config.outputFiles.css)))
    .pipe(gulp.dest(config.outputDirs.extension + 'css/'));
}

function buildSCSS() {
  //Pipe our CSS through autoprefixer, SASS, and concat
  return gulp.src(config.inputFiles.scss)
    .pipe(compass({
      config_file: './conf/config.rb',
      css: './src/extension/css/',
      sass: './src/extension/scss/',
    }))
    .pipe(concat(config.outputFiles.scss))
    .pipe(gulp.dest(config.outputDirs.extension))
    .pipe(gulpif(config.watch, reload({
      stream: true
    })));
}

function buildHTML() {
  return gulp.src(config.inputFiles.html)
    .pipe(gulp.dest(config.outputDirs.extension))
    .pipe(gulpif(config.watch, reload({
      stream: true
    })));
}

function buildFonts() {
  return gulp.src(config.inputFiles.fonts)
    .pipe(gulp.dest(config.outputDirs.extension + 'css/fonts/'))
    .pipe(gulpif(config.watch, reload({
      stream: true
    })));
}

function buildImages() {
  return gulp.src(config.inputFiles.images)
    .pipe(gulp.dest(config.outputDirs.extension + 'img/'))
    .pipe(gulpif(config.watch, reload({
      stream: true
    })));
}

function buildJSLibs() {
  return gulp.src(config.inputFiles.jslibs)
    .pipe(gulp.dest(config.outputDirs.extension + 'js/'))
    .pipe(gulpif(config.watch, reload({
      stream: true
    })));
}

function buildServer() {
  return gulp.src(config.inputFiles.server)
    .pipe(gulp.dest(config.outputDirs.server));
}

//Set environment based on passed flag
gulp.task('setEnvironment', function () {
  setEnvironment();
});

// clean the output directory
gulp.task('clean', ['setEnvironment'], function (callback) {
  //Clean out the target directory
  del(['./dist/'], callback);
});

gulp.task('static', ['clean'], function () {
  buildHTML();
  buildCSS();
  buildFonts();
  buildImages();
  buildJSLibs();

  gulp.src(config.inputFiles.manifest)
    .pipe(gulp.dest(config.outputDirs.extension));

  gulp.src(config.inputFiles.background)
    .pipe(gulp.dest(config.outputDirs.extension));
});

gulp.task('scss', ['clean'], function () {
  buildSCSS();
});

gulp.task('js', ['clean'], function () {
  buildJS();
});

gulp.task('fonts', ['clean'], function () {
  buildFonts();
});

gulp.task('server', ['clean'], function () {
  buildServer();
});

//Persistent build task
gulp.task('build', ['clean', 'server', 'static', 'scss', 'js']);

//Doesn't re-run the JS task because we only want to construct one
//watchify bundler
gulp.task('watch', ['clean', 'server', 'static', 'scss'], function () {
  config.watch = true;
  buildJS();

  gulp.watch(config.inputFiles.html, buildHTML);
  gulp.watch(config.inputFiles.css, buildCSS);
  gulp.watch(config.inputFiles.scss, buildSCSS);
  gulp.watch(config.inputFiles.fonts, buildFonts);
  gulp.watch(config.inputFiles.images, buildImages);
  gulp.watch(config.inputFiles.server, buildServer);

  browserSync({
    server: {
      baseDir: './dist/extension/'
    }
  });

  setTimeout(function () {
    nodemon({
      script: './dist/server/server.js',
      ext: 'js',
    }).on('restart', function () {
      console.log('Node server restarted!');
    });
  }, 1000);
});

gulp.task('default', ['build']);

/* jshint ignore:end */