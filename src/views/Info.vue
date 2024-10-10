<template>
	<div class="info__page">
		<!-- <div class="info__tit">
			<div class="title1">填寫信息</div>
			<div class="title2">免費查看報告</div>
		</div> -->
		<div class="form__wrap">
			<form @submit.prevent="handleSubmit">
				<div class="radio__group">
					<div>請選擇性別</div>
					<div
						class="custom__radio"
						:class="{ active: formData.gender === 'male' }"
						@click="selectGender('male')"
					>
						<i class="icon-male"></i>
						<span>男</span>
					</div>
					<div
						class="custom__radio"
						:class="{ active: formData.gender === 'female' }"
						@click="selectGender('female')"
					>
						<i class="icon-female"></i>
						<span>女</span>
					</div>
				</div>
				<div class="input__group">
					<input
						type="text"
						placeholder="請輸入姓名"
						v-model="formData.name"
						id="name"
					/>
				</div>
				<!-- 使用 DatePickerGroup 组件 -->
				<DatePickerGroup
					v-model:lunarBirthday="formData.lunarBirthday"
					v-model:gregorianBirthday="formData.gregorianBirthday"
				/>

				<div class="requirement__group">
					<van-button
						:class="{ active: selectedValue === 'Button1' }"
						@click="selectButton($event, 'Button1')"
					>
						單身尋找姻緣
					</van-button>
					<van-button
						:class="{ active: selectedValue === 'Button2' }"
						@click="selectButton($event, 'Button2')"
					>
						破裂關係走向
					</van-button>
				</div>
				<div class="privacy">
					<van-checkbox
						v-model="privacyChecked"
						name="1"
						checked-color="#f46825"
						icon-size="20"
						>我已閲讀並同意</van-checkbox
					><a
						href="privacy"
						target="_blank"
						rel="noopener noreferrer"
						class="privacy__link"
					>
						《用户隱私協議》</a
					>
				</div>
				<div v-if="!showFootBtn" class="submit__btn" @click="handleSubmit">
					免費查看報告
				</div>
				<div v-if="showFootBtn" class="foot__btn">
					<div class="submit__btn" @click="handleScrollToTop">免費查看報告</div>
				</div>
			</form>
		</div>
	</div>
</template>

<script>
	import { showDialog } from "vant"
	import { ref, toRaw, nextTick, onMounted, onBeforeUnmount } from "vue"
	import { useRouter, useRoute } from "vue-router" // 引入 useRouter

	import DatePickerGroup from "@/components/DatePicker.vue"
	import { usePageEntryTime } from "@/utils/pageEntryTime" // 引入页面时间钩子函数
	import { useDataStore } from "@/stores/dataStore"
	import { postTrackInfo } from "@/services/index"
	import FingerprintJS from "@fingerprintjs/fingerprintjs"

	export default {
		components: {
			DatePickerGroup,
		},
		setup() {
			const { entryTime } = usePageEntryTime() //调用页面进入时间
			const router = useRouter()
			const route = useRoute()
			const dataStore = useDataStore()
			const showFootBtn = ref(false)
			const privacyChecked = ref(true)
			//表单数据
			const formData = ref({
				gender: null,
				name: "",
				lunarBirthday: "",
				gregorianBirthday: "",
				destinyType: "",
				uid: "",
				destinyParts: "baseInfo,characters,broken,yourLove",
			})

			const selectGender = (gender) => {
				formData.value.gender = gender
			}

			const selectedValue = ref(null)

			// 需求按钮
			const selectButton = async (event, value) => {
				if (selectedValue.value === value) {
					selectedValue.value = null
					formData.value.destinyType = ""
				} else {
					selectedValue.value = value
					if (value == "Button1") {
						formData.value.destinyType = "destiny_type_single"
					}
					if (value == "Button2") {
						formData.value.destinyType = "destiny_type_broken"
					}
				}
				await nextTick()
			}

			// 验证环节
			const validate = ({
				gender,
				name,
				lunarBirthday,
				gregorianBirthday,
				destinyType,
				privacyChecked,
			}) => {
				const checks = [
					{ condition: !gender, message: "請選擇性別" },
					{ condition: !name, message: "請填寫姓名" },
					{
						condition: !lunarBirthday && !gregorianBirthday,
						message: "請選擇出生日期",
					},
					{ condition: !destinyType, message: "請選擇您的需求" },
					{ condition: !privacyChecked, message: "請同意用戶協議" },
				]

				for (const { condition, message } of checks) {
					if (condition) {
						showDialog({ title: "提示", message })
						return false // Stop further validation
					}
				}

				return true // All validations passed
			}

			// 滚动处理逻辑
			const handleScroll = () => {
				const scrollY = window.scrollY || window.pageYOffset
				// 设定阈值，超过 200px 时显示第二个按钮
				showFootBtn.value = scrollY > 500
			}
			// 点击按钮滚动到顶部
			const handleScrollToTop = () => {
				window.scrollTo({
					top: 0, // 滚动到页面顶部
					behavior: "smooth", // 平滑滚动
				})
			}
			// 提交信息查看免费报告
			const handleSubmit = async () => {
				if (
					validate({
						...formData.value,
						privacyChecked: privacyChecked.value, // 手动添加 privacyChecked
					})
				) {
					const rawFormData = toRaw(formData.value)
					dataStore.setRawFormData(rawFormData)
					dataStore.setTrackData({
						...rawFormData,
					})
					router.push({
						name: "detailPage",
						query: route.query,
					})
				}
			}
			onMounted(async () => {
				const inputFields = document.querySelectorAll("input, textarea")

				window.addEventListener("scroll", handleScroll)
				inputFields.forEach((input) => {
					input.addEventListener("focus", () => {
						setTimeout(() => {
							input.scrollIntoView({ behavior: "smooth", block: "nearest" })
						}, 300) // 延迟确保键盘弹出
					})
				})
				// 使用 FingerprintJS 初始化并获取 UID
				const fp = await FingerprintJS.load()
				const result = await fp.get()
				formData.value.uid = result.visitorId
			})

			// 组件销毁前移除滚动事件监听器
			onBeforeUnmount(() => {
				window.removeEventListener("scroll", handleScroll)
			})
			return {
				formData,
				handleSubmit,
				selectButton,
				selectedValue,
				selectGender,
				entryTime,
				dataStore,
				showFootBtn,
				handleScrollToTop,
				privacyChecked,
			}
		},
	}
</script>
