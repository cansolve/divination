<template>
	<div class="payment__page">
		<div class="pay__body">
			<div class="pay__tips">
				已為2978346人進行測試，成功幫助208538人找到愛情，97.8%以上的測算用戶都覺得對自身的感情有很大的幫助。
			</div>
			<div class="pay__tips">
				透過傳統紫微斗數，為您精準推演感情運勢，包含結婚時機、另一半的長相與家世等重要關鍵，讓您更清楚自己的緣分走向，輕鬆把握幸福！
			</div>
			<div class="pay__wrap">
				<div class="pay__hd">
					<div class="destiny__type">
						測算項目：
						<span
							class="tit"
							v-show="
								trackStore.rawFormData.destinyType === 'destiny_type_single'
							"
							>單身尋找姻緣</span
						>
						<span
							class="tit"
							v-show="
								trackStore.rawFormData.destinyType === 'destiny_type_broken'
							"
							>破裂關係走向</span
						>
						<span
							class="tit"
							v-show="
								!['destiny_type_single', 'destiny_type_broken'].includes(
									trackStore.rawFormData.destinyType,
								)
							"
							>姻緣命書</span
						>
					</div>
					<div class="left__time">
						<div class="time__title">距優惠結束：</div>
						<div class="time__num">{{ formattedTime }}</div>
					</div>
				</div>
				<div class="pay__bd">
					<div class="special__price" v-if="!countdownEnded">
						特惠價格：USD 12.21
					</div>
					<div :class="{ through: !countdownEnded }" class="old__price">
						測算原價：USD 19.21
					</div>
				</div>
				<van-divider>支付方式</van-divider>
				<div class="pay-radio__box">
					<van-radio-group v-model="selectedPaymentType">
						<van-radio
							name="PayPal"
							label-position="left"
							checked-color="#d51e00"
						>
							<i class="pay-radio-icon"></i>
						</van-radio>
						<van-radio
							name="MyCard"
							label-position="left"
							checked-color="#d51e00"
						>
							<b class="pay-mycard-icon">{{ mycardData?.PaymentTypeDesc }}</b>
						</van-radio>
					</van-radio-group>
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
				<button class="pay__btn" @click="handlePayButtonClick">立即支付</button>
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
	</div>
</template>

<script>
	import { ref, computed, onMounted } from "vue"

	import { showDialog, showConfirmDialog } from "vant"

	import PayPalButton from "@/components/PayPalButton.vue"
	import FootWidget from "@/components/FootWidget.vue"

	import { usePageEntryTime } from "@/utils/pageEntryTime" // 引入页面时间钩子函数
	import {
		postTrackInfo,
		getMycardPayments,
		postMycardData,
	} from "@/services/index"

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
			const email = ref("")
			const showPaypalDialog = ref(false)
			const mycardData = ref(null) //mycard文案
			const router = useRouter() // 获取 router 实例
			const route = useRoute() // 获取当前路由信息

			const selectedPaymentType = ref("") // 支付方式初始化为一个空字符串

			const countdownTime = ref(10 * 60 * 1000) // 5分钟倒计时，初始值为5分钟的毫秒数
			const countdownEnded = ref(false)

			const trackStore = useDataStore()
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
			// 处理支付按钮点击
			const handlePayButtonClick = async () => {
				if (!email.value) {
					showDialog({ message: "請輸入郵箱地址！" })
					return
				}
				if (!isValidEmail(email.value)) {
					showDialog({ message: "請輸入有效的郵箱地址！" })
					return
				}
				if (!selectedPaymentType.value) {
					showDialog({ message: "請選擇支付方式！" })
					return
				}
				// 如果通过验证，执行下一步操作，例如跳转页面或提交数据
				showConfirmDialog({
					message: "請再次確認郵箱是否正確" + email.value,
				})
					.then(async () => {
						if (selectedPaymentType.value === "MyCard") {
							try {
								const response = await postMycardData({
									uid: trackStore.trackData.uid,
									email: email.value,
									paymentType: mycardData.value.PaymentType,
									itemCode: mycardData.value.Items[0].ItemCode,
									amount: countdownEnded ? "12.21" : "19.21",
									currency: mycardData.value.Items[0].Currency,
								})
								if (response && response.code === 200 && response.data) {
									console.log("Redirecting to:", response.data)
									window.location.href = response.data // 重定向到返回的链接
								} else {
									showDialog({ message: "支付失败，服务器返回数据异常！" })
								}
							} catch (error) {
								console.error("提交 MyCard 支付接口失败：", error)
								showDialog({ message: "支付失敗，請重試！" })
							}
						} else if (selectedPaymentType.value == "PayPal") {
							trackStore.setEmail(email.value)
							trackStore.setTrackData({
								action: "action_pay",
								email: email.value,
							})
							await postTrackInfo(trackStore.trackData)
							showPaypalDialog.value = true
						}
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
				// 关闭 PayPal Dialog
				showPaypalDialog.value = false
				// 显示支付成功提示
				showDialog({ message: "支付成功！邮件正在发送中" })
				trackStore.setTrackData({
					action: "action_send_email_success",
				})
				await postTrackInfo(trackStore.trackData)
				// 执行支付成功后的逻辑
				try {
					await router.push({
						name: "home", // 目标页面的名称
						query: route.query,
						params: "",
					})
					trackStore.setTrackData({
						action: "action_recovery",
					})
					await postTrackInfo(trackStore.trackData)
				} catch (err) {
					console.error("Failed to navigate to home:", err)
				}
			}

			const handlePaymentError = async (error) => {
				// console.log("Payment Error:", error)
				showPaypalDialog.value = false
				showDialog({ message: "支付失败，请重试！" })
				// 执行支付失败后的逻辑
				trackStore.setTrackData({
					action: "action_pay_failed",
				})
				await postTrackInfo(trackStore.trackData)
			}
			onMounted(async () => {
				startCountdown()
				const cardData = await getMycardPayments()

				try {
					if (
						cardData &&
						cardData.code === 200 &&
						cardData.data &&
						cardData.data.length > 2
					) {
						mycardData.value = cardData.data[2]
					} else {
						console.warn("Invalid data format:", cardData.data)
					}
				} catch (error) {
					console.error("Error loading mycardData:", error)
				}

				if (!trackStore.hasPostedTrackInfo2) {
					try {
						trackStore.setTrackData({
							actionTimestamp: entryTime.value,
							action: "action_pay_enter",
						})
						// console.log(trackStore.trackData)
						// 发送 POST 请求
						await postTrackInfo(trackStore.trackData)
						// 标记为已发送
						trackStore.markTrackInfoAsPosted()
						// console.log(trackResponse)
					} catch (error) {
						console.error("Mounted hook 中发生错误:", error)
					}
				}
			})

			return {
				selectedPaymentType,
				email,
				mycardData,
				trackStore,
				showPaypalDialog,
				formattedTime,
				countdownEnded,
				handlePayButtonClick,
				handlePaymentSuccess,
				handlePaymentError,
			}
		},
	}
</script>
