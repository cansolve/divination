import { createApp } from "vue"
import "./assets/style/style.scss"
import App from "./App.vue"
import router from "./router"

import Vant from "vant"
import "vant/lib/index.css"

const app = createApp(App)
app.use(router).use(Vant).mount("#app")
