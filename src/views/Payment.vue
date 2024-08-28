<template>
	<div class="payment__page">
		<div class="payment__banner">
			<img src="../assets/img/payment-banner.jpg" alt="" />
		</div>
		<div class="pay__body">
			<div class="pay__tips">
				已将测算问题发给专业老师，支付后可获得老师的专业分析
			</div>
			<div class="pay__wrap">
				<div class="pay__hd">
					<div class="destiny__type">
						测算项目：<span class="tit">单身寻找姻缘</span>
					</div>
					<div class="left__time">
						<div class="time__title">距优惠结束：</div>
						<div class="time__num">{{ formattedTime }}</div>
					</div>
				</div>
				<div class="pay__bd">
					<div class="special__price" v-if="!countdownEnded">
						特惠价格：$39.9
					</div>
					<div :class="{ through: !countdownEnded }" class="old__price">
						测算原价：$69.9
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
					placeholder="请输入邮箱地址接受完整报告"
				/>
			</div>
			<div class="pay__btn-wrap">
				<div
					:class="{ lock: isLocked }"
					class="pay__btn"
					@click="handlePayButtonClick"
				>
					立即支付
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { ref, computed, onMounted } from "vue"

	import { showConfirmDialog } from "vant"

	export default {
		name: "PaymentPage",
		setup() {
			const checked = ref(false)
			const email = ref("")
			const isLocked = ref(true)

			const countdownTime = ref(5 * 60 * 1000) // 5分钟倒计时，初始值为5分钟的毫秒数
			const countdownEnded = ref(false)

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
				return emailPattern.test(email)
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
					alert("请输入邮箱地址！")
					return
				}
				if (!isValidEmail(email.value)) {
					alert("请输入有效的邮箱地址！")
					return
				}
				// 如果通过验证，执行下一步操作，例如跳转页面或提交数据
				showConfirmDialog({
					message: "请再次确认邮箱是否正确",
				})
					.then(() => {
						// on confirm
						alert("邮箱验证通过，进入下一步操作")
					})
					.catch(() => {
						// on cancel
					})
			}

			onMounted(() => {
				startCountdown()
			})

			return {
				checked,
				email,
				isLocked,
				formattedTime,
				countdownEnded,
				handleCheckboxChange,
				handlePayButtonClick,
			}
		},
	}
</script>
