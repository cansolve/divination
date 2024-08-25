# 活动脚手架 vite 版

## 功能

- 自动压缩图片
- 自动图片 sprites
- 支持前后端分离和不分离模式
- px 转 rem
- 集成组内规范 eslint 和 stylelint
- 集成 eruda
- 集成前端多语开发包 (仅支持前后端分离模式)
- 支持多 theme 模式

## 开发

1. 安装依赖

```
yarn
```

2. 运行开发命令

```
yarn dev
```

3. 打开浏览器

```
http://localhost:3000
```

## 发布

### 自动发布

集成在后端仓库自动发布

### 手动发布

```
yarn deploy
```

## 多语言

## 多语图片

多语图片指需要将文字切在图片里的图片  
多语图片应放在`src/assets/img/locale`目录下，以`文件名+双横线+语言编码+扩展名`命名, 如：`bg_header--chs.png`  
开发的时候，可以选择任意一张插入 html，正式上线后，php sdk 会根据当前语言选择对应图片插入。  
语言代码为 3 位，详见[WIKI](https://wiki.skyunion.net/index.php?title=%E5%9B%BD%E5%AE%B6/%E5%9C%B0%E5%8C%BA%E8%AF%AD%E8%A8%80%E6%A0%87%E5%87%86%E5%AF%B9%E7%85%A7)。

> 提示 1: 以上仅针对非前后端分离模式，在前后端分离模式下，你要自己选择正确语言的图片  
> 提示 2: 所有的放在 locale 文件夹下的多语图片，即使未引用也会被编译到 dist 目录中

## Sprites

项目内集成 [vite-plugin-spritesmith](https://github.com/evont/vite-plugin-spritesmith) 自动合成雪碧图, 将需要合成雪碧图的 png 图片(注意：仅支持 png 图片)放在`src/assets/img/sprites`目录下，即会在`src/assets/img`目录下生成`sprite.png`, 以及在 `src/assets/style`目录下生成`sprite.scss`文件，`sprite.scss`文件已默认引入到项目内。  
其它使用说明请自行查阅插件文档。

## 推荐的 vscode 插件

- Browse Lite
- Vite

## theme

当前主题通过后端传入主题名得到，有以下两个方式：
- 非前后端分离模式：在页面模板添加全局变量 theme
- 前后端分离模式：在页面初始化接口加入 theme 字段



默认 theme 名为: default  
将 theme 相关的样式抽离为 `src/assets/style/theme/${themeName}.scss`  
应用根元素 #app 将会添加一个类名 `theme-${themeName}`


