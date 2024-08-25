const fs = require('fs-extra')
const path = require('path')
const { webPath, eventPath } = require('../.cli/config.json')
const webPathInRoot = webPath === '/'
let targetPath

if (webPathInRoot) {
  targetPath = path.resolve(`${__dirname.split('frontend')[0]}`, `auto-assets/${eventPath}`)
} else {
  targetPath = path.resolve(`${__dirname.split('frontend')[0]}`, `public/auto-assets/${eventPath}`)
}

fs.copySync(path.resolve(__dirname, '../dist'), targetPath)
