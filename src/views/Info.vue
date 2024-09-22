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
	import { ref, toRaw, nextTick, onMounted } from "vue"
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
			//表单数据
			const formData = ref({
				gender: null,
				name: "",
				lunarBirthday: "",
				gregorianBirthday: "",
				destinyType: "destiny_type_single",
				uid: "",
				destinyParts: "baseInfo,characters,broken,yourLove",
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
						formData.value.destinyType = "destiny_type_single"
					}
					if (value == "Button2") {
						formData.value.destinyType = "destiny_type_broken"
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
					dataStore.setRawFormData(rawFormData)
					dataStore.setTrackData({
						...rawFormData,
					})
					const trackResponse = await postTrackInfo(dataStore.trackData)
					router.push({
						name: "detailPage",
						query: route.query,
					})
				}
			}
			onMounted(async () => {
				// 使用 FingerprintJS 初始化并获取 UID
				const fp = await FingerprintJS.load()
				const result = await fp.get()
				formData.value.uid = result.visitorId

				try {
					// 获取页面进入时间
					dataStore.setTrackData({
						action: "action_filling",
						actionTimestamp: entryTime.value,
					})
					// 发送 POST 请求
					await postTrackInfo(dataStore.trackData)
					// console.log(trackResponse)
				} catch (error) {
					console.error("Mounted hook 中发生错误:", error)
				}
			})

			return {
				formData,
				handleSubmit,
				selectButton,
				selectedValue,
				selectGender,
				entryTime,
				dataStore,
			}
		},
	}
</script>

<style scoped></style>
