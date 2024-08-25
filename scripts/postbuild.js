const fs = require('fs-extra')
const path = require('path')
const config = fs.readJSONSync(path.resolve(__dirname, '../.cli/config.json'))
const imgDir = fs.pathExistsSync(path.resolve(__dirname, '../dist/img'))
const jsDir = fs.pathExistsSync(path.resolve(__dirname, '../dist/js'))
const cssDir = fs.pathExistsSync(path.resolve(__dirname, '../dist/css'))

if (fs.pathExistsSync(imgDir)) {
  fs.copySync(imgDir, path.resolve(__dirname, `${config.staticsPath}/img`))
}
if (fs.pathExistsSync(jsDir)) {
  fs.copySync(jsDir, path.resolve(__dirname, `${config.staticsPath}/js`))
}
if (fs.pathExistsSync(cssDir)) {
  fs.copySync(cssDir, path.resolve(__dirname, `${config.staticsPath}/css`))
}
