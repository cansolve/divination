/**
 * 生成 assets.json 和 .phtml 模板文件
 */

const path = require('path')
const fs = require('fs-extra')
const { webPath, eventPath } = require('../.cli/config.json')
let { publicPath } = require('../.cli/config.json')
const distPath = path.resolve(__dirname, '../dist')
const htmls = {}
const isPre = process.argv.length === 4 && process.argv[3] === '--pre' // build:pre
const isDev = process.argv.length === 4 && process.argv[3] === '--dev' // build:dev
const devPath = `/auto-assets${eventPath.startsWith('/') ? '' : '/'}${eventPath}${eventPath.endsWith('/') ? '' : '/'}`
// 删除不需要的locale文件
fs.rmSync(path.resolve(__dirname, '../dist/img/locale-temp'), { recursive: true, force: true })

if (!publicPath.endsWith('/')) {
  publicPath = `${publicPath}/`
}

let prefixPath = path.resolve(__dirname, '../').split('frontend')[1].replace(/\\/g, '/')
if (prefixPath.startsWith('/')) {
  prefixPath = prefixPath.substr(1)
}

const assets = {
  publicPath,
  devPath,
  webPath,
  assets: {},
}

function mapDir(dir, list = {}) {
  const dirs = fs.readdirSync(dir)
  dirs.forEach(filename => {
    const fileDir = path.join(dir, filename)
    const stats = fs.statSync(fileDir)
    const isFile = stats.isFile()
    const isDir = stats.isDirectory()
    if (isFile) {
      const ext = path.extname(fileDir)
      const relativePath = path.relative(distPath, fileDir).replace(/\//g, '\\')
      // 多语图片名包含--
      if (filename.indexOf('--') > -1) {
        const file = `${filename.split('--')[0]}${ext}`
        const folderName = relativePath.split('\\')[0]
        const key = `${prefixPath}/${folderName}/${file}`
        const lang = filename.split('--')[1].split('.')[0]
        if (!list[key]) {
          list[key] = {}
        }
        list[key][lang] = relativePath.replace(/\\/g, '/')
      } else {
        list[`${prefixPath}/${removeHash(relativePath)}`] = relativePath.replace(/\\/g, '/')
      }
      if (ext === '.html') {
        htmls[removeHash(relativePath)] = fs.readFileSync(fileDir, 'utf8')
      }
    } else if (isDir) {
      mapDir(fileDir, list)
    }
  })
  return list
}

function removeHash(filename) {
  filename = filename.replace(/\\/g, '/')
  const name = filename.split('.')[0]
  const ext = filename.split('.').pop()
  return `${name}.${ext}`
  // if (ext === 'html') {
  //   return `${name}.${ext}`
  // }
  // return isPre ? `${name}.pre.${ext}` : `${name}.${ext}`
}

assets.assets = mapDir(distPath)

Object.keys(htmls).forEach(html => {
  let content = htmls[html]
  Object.keys(assets.assets).forEach(asset => {
    const assetFileName = assets.assets[asset]
    let file
    if (typeof assetFileName === 'object') {
      file = []
      Object.keys(assetFileName).forEach(v => {
        file.push(`${publicPath}${assetFileName[v]}`)
      })
      file.forEach(v => {
        const fileName = removeHash(v.split('/').pop())
        const reg = `${publicPath}img/locale-temp/${fileName}`
        content = content.replace(new RegExp(reg, 'g'), `<?php staticFile('${asset}'); ?>`)
      })
    } else {
      file = `${publicPath}${assetFileName}`
      content = content.replace(new RegExp(file, 'g'), `<?php staticFile('${asset}'); ?>`)
    }
  })
  htmls[html] = content
  writeHTML(html, content)
})

function writeHTML(filePath, content) {
  const fileFullPath = path.resolve(distPath, filePath)
  const filename = path.basename(fileFullPath, '.html')
  filePath = path.dirname(fileFullPath)
  fs.writeFileSync(path.resolve(filePath, `${filename}.phtml`), content, 'utf8')
}

function writeAssetsJSON() {
  const targetPath = path.resolve(`${__dirname.split('frontend')[0]}`, 'assets-maps', eventPath)
  const fileName = isDev ? 'assets.dev.json' : isPre ? 'assets.pre.json' : 'assets.json'

  fs.ensureDirSync(targetPath)
  fs.writeFileSync(path.resolve(targetPath, fileName), JSON.stringify(assets), 'utf8')
  fs.writeFileSync(path.resolve(__dirname, '../dist', fileName), JSON.stringify(assets), 'utf8')
}

writeAssetsJSON()
