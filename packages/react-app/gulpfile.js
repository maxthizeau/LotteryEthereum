const gulp = require('gulp')
const gulpless = require('gulp-less')
const postcss = require('gulp-postcss')
const debug = require('gulp-debug')
var csso = require('gulp-csso')
// const autoprefixer = require('autoprefixer')
const NpmImportPlugin = require('less-plugin-npm-import')
const autoprefixer = require('gulp-autoprefixer')

gulp.task('less', function (done) {
  const plugins = [autoprefixer()]

  gulp
    .src('src/themes/*-theme.less')
    .pipe(debug({ title: 'Less files:' }))
    .pipe(
      gulpless({
        javascriptEnabled: true,
        plugins: [new NpmImportPlugin({ prefix: '~' })],
      })
    )
    .pipe(autoprefixer())
    .pipe(
      csso({
        debug: true,
      })
    )
    .pipe(gulp.dest('./src/themes/generated'))
  done()
})
