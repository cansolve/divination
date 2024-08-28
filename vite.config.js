import { defineConfig } from "vite"
import { resolve } from "path"
import viteImagemin from "vite-plugin-imagemin"
import Banner from "vite-plugin-banner"
import eruda from "vite-plugin-eruda"
import Spritesmith from "vite-plugin-spritesmith"
import smartAsset from "rollup-plugin-smart-asset"
import vue from "@vitejs/plugin-vue"

import { publicPath } from "./.cli/config.json"

const isProd = process.env.NODE_ENV === "production"
const isPre = process.argv.length === 5 && process.argv[4] === "--pre"
const isDev = process.argv.length === 5 && process.argv[4] === "--dev"
const staticFileName = isPre ? "[name].pre" : "[name]"
let base

if (isDev) {
	base = "./"
} else if (isProd) {
	base = publicPath
} else {
	base = "./"
}

export default defineConfig({
	base,
	resolve: {
		alias: {
			"@": `${resolve(__dirname, "src")}`,
			"swiper/css": "swiper/swiper-bundle.css",
		},
	},
	hmr: true,
	build: {
		assetsInlineLimit: 0,
		rollupOptions: {
			output: {
				entryFileNames: `js/${staticFileName}.js`,
				chunkFileNames: `js/${staticFileName}.js`,
				assetFileNames: ({ name }) => {
					const ext = name.split(".").pop()
					const path = ext === "css" ? "css" : "img"
					if (name.indexOf("img/locale") > -1) {
						return `img/locale-temp/${staticFileName}.[ext]`
					}
					return `${path}/${staticFileName}.[ext]`
				},
			},
			// input: {
			//   main: resolve(__dirname, 'index.html'),
			//   nested: resolve(__dirname, 'pages/demo/index.html')
			// }
		},
		assetsDir: "",
	},
	plugins: [
		vue(),
		Banner(
			`Build Date: ${new Date().toLocaleString("zh-CN", { hour12: false })}`,
		),
		// eruda(),
		smartAsset({
			url: "copy",
			useHash: true,
			keepName: true,
			nameFormat: `img/locale/${staticFileName}[ext]`,
			include: resolve(__dirname, "./src/assets/img/locale/*.*"),
			hashOptions: {
				encoding: "hex",
			},
		}),
		Spritesmith({
			watch: process.env.NODE_ENV !== "production",
			src: {
				cwd: "./src/assets/img/sprites",
				glob: "*.png",
			},
			target: {
				image: "./src/assets/img/sprite.png",
				css: "./src/assets/style/sprite.scss",
			},
		}),
		viteImagemin({
			gifsicle: {
				//处理和压缩 GIF 文件
				optimizationLevel: 7,
				interlaced: false,
			},
			optipng: {
				//用于优化 PNG 图像
				optimizationLevel: 7,
			},
			mozjpeg: {
				//用于压缩 JPEG 图像
				quality: 80,
			},
			pngquant: {
				//另一种用于 PNG 的压缩工具
				quality: [0.8, 0.9],
				speed: 4,
			},
			svgo: {
				//优化 SVG 图像，
				plugins: [
					{
						name: "removeViewBox",
					},
					{
						name: "removeEmptyAttrs",
						active: false,
					},
				],
			},
		}),
	],
	server: {
		// proxy: {
		//   '/event': {
		//     target: 'http://10.0.8.67:8868',
		//     changeOrigin: true
		//   }
		// }
	},
})
