<template>
	<div class="info__page">
		<div class="info__tit">
			<div class="title1">填寫信息</div>
			<div class="title2">免費查看報告</div>
		</div>
		<div class="form__wrap">
			<form @submit.prevent="handleSubmit">
				<div class="radio__group">
					<label
						class="custom__radio"
						:class="{ active: formData.gender === 'male' }"
						@click="selectGender('male')"
					>
						<input
							type="radio"
							name="gender"
							value="male"
							v-model="formData.gender"
						/>
						<span>男</span>
					</label>
					<label
						class="custom__radio"
						:class="{ active: formData.gender === 'female' }"
						@click="selectGender('female')"
					>
						<input
							type="radio"
							name="gender"
							value="female"
							v-model="formData.gender"
						/>
						<span>女</span>
					</label>
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
				<div class="foot__btn">
					<div class="submit__btn" @click="handleSubmit">免費查看報告</div>
				</div>
			</form>
		</div>
	</div>
</template>

<script>
	import { showDialog } from "vant"
	import { ref, reactive, toRaw, nextTick, onMounted } from "vue"
	import { useRouter } from "vue-router" // 引入 useRouter

	import FingerprintJS from "@fingerprintjs/fingerprintjs"

	import DatePickerGroup from "../components/DatePicker.vue"
	import { usePageEntryTime } from "../utils/pageEntryTime" // 引入页面时间钩子函数
	import { postUserInfo } from "../services/index"

	export default {
		components: {
			DatePickerGroup,
		},
		setup() {
			const { entryTime } = usePageEntryTime() //调用页面进入时间
			const router = useRouter()

			//表单数据
			const formData = ref({
				gender: null,
				name: "",
				lunarBirthday: "",
				gregorianBirthday: "",
				destinyType: "DESTINY_TYPE_SINGLE",
				uid: "",
				destinyParts: "baseInfo,characters",
			})

			const selectGender = (gender) => {
				formData.gender = gender
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
						formData.value.destinyType = "DESTINY_TYPE_SINGLE"
					}
					if (value == "Button2") {
						formData.value.destinyType = "DESTINY_TYPE_BROKEN"
					}
				}
				// console.log(formData.value.destinyType)
				await nextTick()
			}

			// 验证环节
			const validate = ({
				gender,
				name,
				lunarBirthday,
				gregorianBirthday,
				destinyType,
			}) => {
				const checks = [
					{ condition: !gender, message: "請選擇性別" },
					{ condition: !name, message: "請填寫姓名" },
					{
						condition: !lunarBirthday && !gregorianBirthday,
						message: "請選擇出生日期",
					},
					{ condition: !destinyType, message: "請選擇您的需求" },
				]

				for (const { condition, message } of checks) {
					if (condition) {
						showDialog({ title: "提示", message })
						return false // Stop further validation
					}
				}

				return true // All validations passed
			}

			const handleSubmit = async () => {
				if (validate(formData.value)) {
					const rawFormData = toRaw(formData.value)
					console.log("rawFormData", rawFormData)
					// 在这里处理表单提交逻辑，例如发送 API 请求
					try {
						const response = await postUserInfo(rawFormData, "example") // 发送 POST 请求
						console.log("Response:", response.data)
						// router.push({
						// 	name: "DetailPage",
						// 	params: { destinyType: formData.value.destinyType },
						// }) //测试成功跳转
					} catch (error) {
						console.error("Failed to post data:", error)
					}
				}
			}
			onMounted(() => {
				// 通过 FingerprintJS v3+ 初始化
				FingerprintJS.load()
					.then((fp) => fp.get())
					.then((result) => {
						// 获取浏览器指纹ID
						formData.value.uid = result.visitorId
						// console.log("用户设备ID：" + formData.value.uid);
					})
					.catch((error) => {
						console.error("Failed to load FingerprintJS", error)
					})
				console.log("信息填写页面进入时间：" + entryTime.value) //页面进入时间
			})

			return {
				formData,
				handleSubmit,
				selectButton,
				selectedValue,
				selectGender,
				entryTime,
			}
		},
	}
</script>

<style scoped></style>
