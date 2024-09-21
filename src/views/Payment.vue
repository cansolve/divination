<template>
	<div class="payment__page">
		<div class="payment__banner">
			<img src="../assets/img/payment-banner.jpg" alt="" />
		</div>
		<div class="pay__body">
			<div class="pay__tips">
				已將測算問題發給專業老師，支付後可獲得老師的專業分析
			</div>
			<div class="pay__wrap">
				<div class="pay__hd">
					<div class="destiny__type">
						測算項目：<span class="tit">單身尋找姻緣</span>
					</div>
					<div class="left__time">
						<div class="time__title">距優惠結束：</div>
						<div class="time__num">{{ formattedTime }}</div>
					</div>
				</div>
				<div class="pay__bd">
					<div class="special__price" v-if="!countdownEnded">
						特惠價格：USD 99
					</div>
					<div :class="{ through: !countdownEnded }" class="old__price">
						測算原價：USD 199
					</div>
				</div>
				<van-divider>支付方式</van-divider>
				<div class="pay-radio__box">
					<van-checkbox
						v-model="checked"
						label-position="left"
						checked-color="#d51e00"
						@change="handleCheckboxChange"
						><i class="pay-radio-icon"></i
					></van-checkbox>
				</div>
			</div>
			<div class="email__wrap">
				<input
					type="email"
					v-model="email"
					placeholder="請輸入郵箱地址接受完整報告"
				/>
			</div>
			<div class="pay__btn-wrap">
				<button
					@click="handlePayButtonClick"
					:class="{ lock: isLocked }"
					class="pay__btn"
				>
					立即支付
				</button>
				<van-dialog
					v-model:show="showPaypalDialog"
					title="支付"
					:show-cancel-button="false"
				>
					<div class="paypalbutton-box">
						<PayPalButton
							@paymentSuccess="handlePaymentSuccess"
							@paymentError="handlePaymentError"
						/>
					</div>
				</van-dialog>
			</div>
		</div>
		<FootWidget />
	</div>
</template>

<script>
	import { ref, computed, onMounted } from "vue"

	import { showDialog, showConfirmDialog } from "vant"

	import PayPalButton from "@/components/PayPalButton.vue"
	import FootWidget from "@/components/FootWidget.vue"

	import { usePageEntryTime } from "@/utils/pageEntryTime" // 引入页面时间钩子函数
	import { postTrackInfo } from "@/services/index"

	import { useDataStore } from "@/stores/dataStore"
	import { useRoute, useRouter } from "vue-router"
	export default {
		name: "PaymentPage",
		components: {
			PayPalButton,
			FootWidget,
		},
		setup() {
			const { entryTime } = usePageEntryTime()
			const checked = ref(false)
			const email = ref("")
			const isLocked = ref(true)
			const showPaypalDialog = ref(false)

			const router = useRouter() // 获取 router 实例
			const route = useRoute() // 获取当前路由信息

			const countdownTime = ref(5 * 60 * 1000) // 5分钟倒计时，初始值为5分钟的毫秒数
			const countdownEnded = ref(false)

			const trackStore = useDataStore()

			// const trackData = ref({
			// 	paymentPageEntryTime: "",
			// 	orderCreateTime: "",
			// 	orderId: "",
			// 	orderStatus: "",
			// 	orderUpdateTime: "",
			// 	orderPurchaseValue: "",
			// 	payerIp: "",
			// })

			// 格式化时间为 mm:ss:ms
			const formattedTime = computed(() => {
				const totalMilliseconds = countdownTime.value
				const minutes = Math.floor(totalMilliseconds / (60 * 1000)) // 分钟
				const remainingTimeInMilliseconds = totalMilliseconds % (60 * 1000) // 剩余的毫秒数
				const seconds = Math.floor(remainingTimeInMilliseconds / 1000) // 秒
				const milliseconds = Math.floor(
					(remainingTimeInMilliseconds % 1000) / 10,
				) // 毫秒精确到2位
				return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
					2,
					"0",
				)}:${String(milliseconds).padStart(2, "0")}`
			})

			// 倒计时函数
			const startCountdown = () => {
				const interval = setInterval(() => {
					if (countdownTime.value > 0) {
						countdownTime.value -= 10 // 每次减少10毫秒
					} else {
						clearInterval(interval)
						countdownEnded.value = true // 标记倒计时结束
					}
				}, 10) // 每10毫秒执行一次
			}

			// 验证邮箱格式
			const isValidEmail = (email) => {
				const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
				// 检查域名中不能有连续的 "." 符号
				const domainPart = email.split("@")[1]
				return emailPattern.test(email) && !/(\.\.)/.test(domainPart)
			}

			// 处理复选框变化
			const handleCheckboxChange = () => {
				if (checked.value) {
					isLocked.value = false
				} else {
					isLocked.value = true
				}
			}

			// 处理支付按钮点击
			const handlePayButtonClick = () => {
				if (!email.value) {
					showDialog({ message: "請輸入郵箱地址！" })
					return
				}
				if (!isValidEmail(email.value)) {
					showDialog({ message: "請輸入有效的郵箱地址！" })
					return
				}
				// 如果通过验证，执行下一步操作，例如跳转页面或提交数据
				showConfirmDialog({
					message: "請再次確認郵箱是否正確" + email.value,
				})
					.then(async () => {
						trackStore.setEmail(email.value)
						showPaypalDialog.value = true
					})
					.catch(() => {
						// on cancel
					})
			}
			const handlePaymentSuccess = async (details) => {
				if (!details) {
					console.error("No payment details provided.")
					return
				}
				// console.log("Payment Success:", details)
				// 关闭 PayPal Dialog
				showPaypalDialog.value = false
				// 显示支付成功提示
				showDialog({ message: "支付成功！邮件正在发送中" })

				// 处理并保存支付信息
				// trackData.value.orderCreateTime = details.create_time || "未提供"
				// trackData.value.orderId = details.id || "未提供"
				// trackData.value.orderStatus = details.status || "未知状态"
				// trackData.value.orderUpdateTime = details.update_time || "未提供"
				// trackData.value.orderPurchaseValue =
				// 	details.purchase_units[0].amount.value || "未提供"

				// 获取并保存国家代码（添加防错处理）
				// const payerAddress = details?.payer?.address
				// trackData.value.payerIp = payerAddress?.country_code || "未知国家"

				// console.log("跟踪数据:", trackData.value)
				const trackResponse = await postTrackInfo(trackStore.trackData)
				// console.log(trackResponse)
				// 执行支付成功后的逻辑
				router.push({
					name: "home", // 目标页面的名称
					query: route.query,
					params: "",
				})
			}

			const handlePaymentError = (error) => {
				// console.log("Payment Error:", error)
				showPaypalDialog.value = false
				showDialog({ message: "支付失败，请重试！" })
				// 执行支付失败后的逻辑
			}
			onMounted(async () => {
				startCountdown()
				try {
					trackStore.setTrackData({
						actionTimestamp: entryTime.value,
						action: "action_pay_enter",
					})
					// console.log(trackStore.trackData)
					// 发送 POST 请求
					const trackResponse = await postTrackInfo(trackStore.trackData)
					// console.log(trackResponse)
				} catch (error) {
					console.error("Mounted hook 中发生错误:", error)
				}
			})

			return {
				checked,
				email,
				isLocked,
				showPaypalDialog,
				formattedTime,
				countdownEnded,
				handleCheckboxChange,
				handlePayButtonClick,
				handlePaymentSuccess,
				handlePaymentError,
			}
		},
	}
</script>
<style lang="scss" scoped></style>
