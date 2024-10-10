/**
 * @ Author: Ryan Tong
 * @ Create Time: 2024-08-25 11:22:08
 * @ Modified by: Ryan Tong
 * @ Modified time: 2024-09-04 17:32:36
 * @ Email: tongxiang608@gmail.com
 */

import { createRouter, createWebHistory } from "vue-router"
import HomePage from "../views/Home.vue"
import InfoPage from "../views/Info.vue"
import DetailPage from "../views/Detail.vue"
import PaymentPage from "../views/Payment.vue"
import PrivacyPolicy from "@/views/PrivacyPolicy.vue"

const routes = [
	{
		path: "/",
		redirect: "/home", // 将根路径重定向到 /home
	},
	{
		path: "/home",
		name: "home",
		component: HomePage,
	},
	{
		path: "/info",
		name: "info",
		component: InfoPage,
	},
	{
		path: "/detail",
		name: "detailPage",
		component: DetailPage,
	},
	{
		path: "/payment",
		name: "paymentPage",
		component: PaymentPage,
	},
	{
		path: "/privacy",
		name: "PrivacyPolicy",
		component: PrivacyPolicy,
	},
]

const router = createRouter({
	history: createWebHistory(), // 硬编码基础路径
	routes,
})

export default router
