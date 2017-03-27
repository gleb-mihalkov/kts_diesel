'use strict'

const DST_DIR = './dist'
const SRC_DIR = './src'

const Gulp = require('gulp')
const GulpUtil = require('gulp-util')
const GulpNotify = require('gulp-notify')
const PrettyError = require('pretty-error')
const Path = require('path')
const Util = require('util')
const browserSync = require('browser-sync')
const watch = require('gulp-watch')
const plumber = require('gulp-plumber')
const rename = require('gulp-rename')
const include = require('gulp-include')
const autoprefixer = require('gulp-autoprefixer')
const cssnano = require('gulp-cssnano')
const stylus = require('gulp-stylus')
const uglify = require('gulp-uglify')
const twig = require('gulp-twig')
const imagemin = require('gulp-imagemin')
const changed = require('gulp-changed')
const gulpif = require('gulp-if')
const debug = require('gulp-debug')
const clean = require('gulp-clean')
const sequence = require('gulp-sequence')

let errorRenderer = null
let errorNotifier = null

let isServer = false

function errorHandler(cb) {
  if (errorNotifier == null) {
    errorNotifier = GulpNotify.onError('Gulp error! See terminal log.')
    errorRenderer = new PrettyError()
    errorRenderer.skipNodeFiles()
  }

  return (error) => {
    let message = errorRenderer.render(error)
    errorNotifier(error)
    console.log(message)
    cb && cb()
  }
}

function singleCall(cb) {
  let result = null

  let wrapper = function() {
    result = wrapper.isCalled ? result : cb.apply(this, arguments)
    wrapper.isCalled = true
    return result
  }

  return wrapper
}

function globPath(base, glob) {
  if (glob == null) {
    return base
  }

  if (typeof(glob) == 'string') {
    glob = [glob]
  }

  let baseLen = __dirname.length
  let list = []

  for (let i = 0; i < glob.length; i++) {
    let item = glob[i]

    let isIgnore = item[0] == '!'
    
    if (isIgnore) {
      item = item.substr(1)
    }
    
    let prefix = isIgnore ? '!' : ''
    let value = prefix + '.' + Path.resolve(base, item).substr(baseLen)

    list.push(value)
  }

  return list
}

function src(glob, cb, opts) {
  let files = globPath(SRC_DIR, glob)

  if (opts == null) {
    opts = {}
  }

  opts.base = SRC_DIR

  return Gulp.src(files, opts).pipe(plumber({
    errorHandler: errorHandler(cb)
  }))
}

function dst(cb) {
  let stream = Gulp.dest(DST_DIR)

  if (cb) {
    stream.on('end', cb)
  }

  if (isServer) {
    stream.pipe(browserSync.reload({
      stream: true
    }))
  }

  return stream
}

function dstMinify(name, cb) {
  let dotPos = name.lastIndexOf('.')

  let extName = name.substr(dotPos + 1)
  let fileName = name.substr(0, dotPos)

  let streamDst = Gulp.dest(DST_DIR)
  let streamRename = rename(name)
  let streamMin = null

  let streamStart = streamRename
  let streamEnd = null

  streamRename.pipe(streamDst)

  if (extName === 'css') {
    streamMin = cssnano({
    	safe: true
    })
  }
  else if (extName === 'js') {
    streamMin = uglify()
  }

  if (streamMin) {
    let minName = fileName + '.min.' + extName
    let streamMinRename = rename(minName)
    let streamMinDst = Gulp.dest(DST_DIR)

    streamEnd = streamDst
      .pipe(streamMin)
      .pipe(streamMinRename)
      .pipe(streamMinDst)
  }
  else {
    streamEnd = streamDst
  }

  if (cb) {
    streamEnd.on('end', cb)
  }

  if (isServer) {
    streamDst.pipe(browserSync.reload({
      stream: true
    }))
  }

  return streamStart
}

function observe(glob, taskName) {
  let files = globPath(SRC_DIR, glob)
  watch(files, () => {
    Gulp.start(taskName)
  })
}

process.on('uncaughtException', errorHandler())

Gulp.task('build:css', (cb) => {
  cb = singleCall(cb)

  src('./main.styl', cb)
    .pipe(stylus())
    .pipe(include())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(dstMinify('style.css', cb))
})

Gulp.task('build:js', (cb) => {
  cb = singleCall(cb)

  src('main.js', cb)
    .pipe(include())
    .pipe(dstMinify('script.js', cb))
})

Gulp.task('build:html', (cb) => {
  cb = singleCall(cb)

  src('./*.twig', cb)
    .pipe(twig())
    .pipe(dst(cb))
})

Gulp.task('build:json', (cb) => {
  cb = singleCall(cb)
  src('./*.json', cb).pipe(dst())
})

Gulp.task('build:assets', (cb) => {
  cb = singleCall(cb)
  
  let source = [
    './fonts/**/*',
    './img/**/*',
    './res/**/*'
  ]

  let imageOpts = {
    interlaced: true,
    progressive: true,
    optimizationLevel: 7,
    svgoPlugins: [{removeViewBox: true}]
  }

  src(source)
    .pipe(changed(DST_DIR))
    .pipe(gulpif(/.(jpg|png)$/g, imagemin(imageOpts)))
    .pipe(dst(cb))
})

Gulp.task('watch', (cb) => {
  observe(['./img/**/*', './res/**/*', './fonts/**/*'], 'build:assets')
  observe('./**/*.styl', 'build:css')
  observe('./**/*.js', 'build:js')
  observe('./**/*.twig', 'build:html')
  observe('./**/*.json', 'build:json')
})

Gulp.task('server', () => {
  let isTunnel = GulpUtil.env.tunnel != null

  browserSync({
    server: {baseDir: DST_DIR},
    tunnel: isTunnel,
    port: 3010
  })

  isServer = true
})

Gulp.task('clean', () => {

  let files = globPath(DST_DIR, [
    '!./.git',
    './*'
  ])

  let opts = {
    base: DST_DIR,
    read: false
  }

  return Gulp.src(files, opts)
    .pipe(clean())
})

Gulp.task('build', sequence('clean', [
  'build:css',
  'build:js',
  'build:json',
  'build:assets',
  'build:html'
]))

Gulp.task('serve', [
  'watch',
  'server'
])

Gulp.task('default', [
  'build',
  'serve'
])