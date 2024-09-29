import { defineConfig } from "vite"
import { resolve } from "path"
import viteImagemin from "vite-plugin-imagemin"
import Banner from "vite-plugin-banner"
import eruda from "vite-plugin-eruda"
import smartAsset from "rollup-plugin-smart-asset"
import vue from "@vitejs/plugin-vue"
import { version } from "./package.json" // 使用 package.json 版本号

const isProd = process.env.NODE_ENV === "production"
const isPre = process.argv.length === 5 && process.argv[4] === "--pre"
const isDev = process.argv.length === 5 && process.argv[4] === "--dev"
const staticFileName = isPre ? "[name].pre" : "[name]"
let base

if (isDev) {
	base = "./"
} else if (isProd) {
	base = "/dist"
} else {
	base = "./"
}

// 自定义版本号，可以直接使用 package.json 中的 version
const versionQuery = `?v=${version}`

export default defineConfig({
	base,
	resolve: {
		alias: {
			"@": `${resolve(__dirname, "src")}`,
		},
	},
	hmr: true,
	build: {
		assetsInlineLimit: 0,
		rollupOptions: {
			output: {
				// 移除哈希值，添加版本号查询参数
				entryFileNames: ({ name }) => `js/${name}.js`,
				chunkFileNames: ({ name }) => `js/${name}.js`,
				assetFileNames: ({ name }) => {
					const ext = name.split(".").pop()
					// 对 CSS 文件添加版本号查询参数
					if (ext === "css") {
						return `css/${name}`
					}
					// 图片文件不添加版本号
					if (name.indexOf("img/locale") > -1) {
						return `img/locale-temp/${name}`
					}
					return `img/${name}`
				},
			},
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
			useHash: false, // 不使用哈希
			keepName: true,
			nameFormat: `img/locale/${staticFileName}[ext]`,
			include: resolve(__dirname, "./src/assets/img/locale/*.*"),
		}),
		viteImagemin({
			gifsicle: {
				optimizationLevel: 7,
				interlaced: false,
			},
			optipng: {
				optimizationLevel: 7,
			},
			mozjpeg: {
				quality: 80,
			},
			pngquant: {
				quality: [0.8, 0.9],
				speed: 4,
			},
			svgo: {
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
		// 针对 HTML 文件的 transformIndexHtml 钩子
		{
			name: "html-transform",
			transformIndexHtml(html) {
				// 为所有引用的 JS 和 CSS 文件添加版本号查询参数
				return html.replace(
					/(href|src)="(.+?\.(js|css))"/g,
					(match, p1, p2, p3) => {
						return `${p1}="${p2}${versionQuery}"`
					},
				)
			},
		},
	],
	server: {
		proxy: {
			"/comments": {
				target: "https://www.pooobs.com",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/comments/, "/comments"),
			},
			"/destiny": {
				target: "https://www.pooobs.com",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/destiny/, "/destiny"),
			},
			"/track": {
				target: "https://www.pooobs.com",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/track/, "/track"),
			},
			"/email": {
				target: "https://www.pooobs.com",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/email/, "/email"),
			},
			"/order": {
				target: "https://www.pooobs.com",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/order/, "/order"),
			},
			"/orderApprove": {
				target: "https://www.pooobs.com",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/orderApprove/, "/orderApprove"),
			},
		},
	},
})
