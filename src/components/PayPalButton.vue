<template>
	<div id="paypal-button-container" class="my-custom-button"></div>
</template>

<script>
	import {
		postOrderInfo,
		postEmail,
		postOrderApprove,
		postTrackInfo,
	} from "@/services/index"
	import { useDataStore } from "@/stores/dataStore"

	export default {
		props: {
			showPaypalDialog: Boolean,
		},
		data() {
			return {
				orderIdNum: "", // 将 orderIdNum 存储在组件的状态中
			}
		},
		mounted() {
			// 确保 PayPal SDK 已加载
			if (window.paypal) {
				this.renderPayPalButton()
			}
		},
		emits: ["paymentSuccess", "paymentError"],
		methods: {
			renderPayPalButton() {
				const trackStore = useDataStore()
				window.paypal
					.Buttons({
						style: {
							shape: "rect",
							color: "gold",
							layout: "vertical",
							label: "paypal",
							tagline: false,
						},
						purchase_units: [
							{
								amount: {
									currency_code: "HKD", // 设置为香港币
									value: "99",
								},
							},
						],
						// 创建订单
						createOrder: async () => {
							try {
								// 调用 postOrderInfo，传递支付信息
								const response = await postOrderInfo({
									amount: "99",
									currency: "HKD",
									uid: trackStore.trackData.uid,
									landingType: trackStore.trackData.landingType,
									channel: trackStore.trackData.channel,
									material: trackStore.trackData.material,
									email: trackStore.trackData.email,
								})

								// 确保 response.orderID 存在
								if (response.code === 200) {
									this.orderIdNum = response.data.orderID // 更新 orderIdNum
									console.log("Order created:", this.orderIdNum)

									// 返回 PayPal 订单 ID
									return this.orderIdNum
								} else {
									throw new Error("Invalid order creation response")
								}
							} catch (error) {
								console.error("Error creating PayPal order:", error)
								this.$emit("paymentError", error)
							}
						},

						// 当支付被批准时
						onApprove: async (data, actions) => {
							try {
								// 捕获订单并发起后端请求
								const approveResponse = await postOrderApprove({
									orderId: this.orderIdNum, // 使用之前创建的订单 ID
								})
								if (approveResponse.code === 200) {
									trackStore.setTrackData({
										action: "action_pay_success",
									})
									await postTrackInfo(trackStore.trackData)
									// 发起邮箱请求
									const emailResponse = await postEmail({
										email: trackStore.emailAddr,
										uid: trackStore.trackData.uid,
										orderId: this.orderIdNum,
									})
									if (emailResponse.code === 200) {
										this.$emit("paymentSuccess", data)
									} else {
										trackStore.setTrackData({
											action: "action_send_email_failed",
										})
										await postTrackInfo(trackStore.trackData)
										throw new Error("Email sending failed")
									}
								} else {
									trackStore.setTrackData({
										action: "action_pay_failed",
									})
									await postTrackInfo(trackStore.trackData)
									throw new Error("Order approval failed")
								}
							} catch (err) {
								console.error(
									"Error capturing order or posting order info:",
									err,
								)
								this.$emit("paymentError", err)
							}
						},

						// 支付出错时
						onError: (err) => {
							console.error("PayPal Checkout Error:", err)
							this.$emit("paymentError", err)
						},
					})
					.render("#paypal-button-container") // 渲染 PayPal 按钮
			},
		},
	}
</script>
