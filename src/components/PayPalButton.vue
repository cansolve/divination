<template>
	<div id="paypal-button-container" class="my-custom-button"></div>
</template>

<script>
	import { postOrderInfo, postEmail, postOrderApprove } from "@/services/index"
	import { useDataStore } from "@/stores/dataStore"

	export default {
		props: {
			showPaypalDialog: Boolean,
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
				let orderIdNum = "" // 确保 orderIdNum 可以在 onApprove 中访问

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
									currency_code: "USD", // 设置为香港币
									value: "10",
								},
							},
						],
						// 创建订单
						async createOrder() {
							try {
								// 调用 postOrderInfo，传递支付信息
								const response = await postOrderInfo({
									amount: "10",
									currency: "USD",
									uid: trackStore.trackData.uid,
									landingType: trackStore.trackData.landingType,
									channel: trackStore.trackData.channel,
									material: trackStore.trackData.material,
								})

								// 确保 response.orderID 存在
								if (response && response.orderID) {
									orderIdNum = response.orderID
									console.log("Order created:", orderIdNum)

									// 返回 PayPal 订单 ID
									return orderIdNum
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
								// // 捕获订单并发起后端请求
								//       const details = await actions.order.capture();
								// console.log("Payment Success:", details);

								const approveResponse = await postOrderApprove({
									orderId: orderIdNum, // 使用之前创建的订单 ID
								})
								if (approveResponse.status === "success") {
									// 发起邮箱请求
									const emailResponse = await postEmail({
										email: trackStore.emailAddr,
										uid: trackStore.trackData.uid,
										orderId: orderIdNum,
									})
									if (emailResponse.status === "success") {
										// console.log("Email sent successfully:", emailResponse)
										this.$emit("paymentSuccess", data)
									} else {
										throw new Error("Email sending failed")
									}
								} else {
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
