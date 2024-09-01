<template>
	<div id="paypal-button-container" class="my-custom-button"></div>
</template>

<script>
	export default {
		props: {
			onClick: Function, // 接收点击事件的函数
		},

		mounted() {
			// 确保 PayPal SDK 已加载
			if (window.paypal) {
				this.renderPayPalButton()
			}
		},
		methods: {
			renderPayPalButton() {
				window.paypal
					.Buttons({
						style: {
							shape: "rect", // 按钮形状：'rect'（矩形）或 'pill'（圆角）
							color: "gold", // 按钮颜色：'gold', 'blue', 'silver', 'white', 'black'
							layout: "vertical", // 布局：'vertical'（垂直）或 'horizontal'（水平）
							label: "paypal", // 标签：'paypal', 'checkout', 'buynow', 'pay', 'installment'
							tagline: false, // 是否显示标语（tagline）：true 或 false
						},

						createOrder: (data, actions) => {
							if (this.onClick) {
								this.onClick() // 先调用父组件传入的点击事件
							}
							return actions.order.create({
								purchase_units: [
									{
										amount: {
											value: "0.5", // 替换为你希望的支付金额
										},
									},
								],
							})
						},

						onApprove: (data, actions) => {
							return actions.order.capture().then((details) => {
								console.log("Payment Details:", details)
								console.log(
									"Transaction completed by " + details.payer.name.given_name,
								)
								// 你可以在这里处理支付成功后的逻辑
							})
						},
						onError: (err) => {
							console.error("PayPal Checkout Error:", err)
							// 处理支付错误
						},
					})
					.render("#paypal-button-container")
			},
		},
	}
</script>
