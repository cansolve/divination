/**
 * @ Author: Ryan Tong
 * @ Create Time: 2024-08-25 11:22:08
 * @ Modified by: Ryan Tong
 * @ Modified time: 2024-09-04 17:33:49
 * @ Email: tongxiang608@gmail.com
 */

import { createApp } from "vue"
import "./assets/style/style.scss"
import { createPinia } from "pinia"
import App from "./App.vue"
import router from "./router"

import Vant from "vant"
import "vant/lib/index.css"

const pinia = createPinia()

const app = createApp(App)
app.use(router).use(Vant).use(pinia).mount("#app")
