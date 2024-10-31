<template>
	<div class="date__group">
		<van-field
			v-model="localSelectResult"
			is-link
			readonly
			name="picker"
			placeholder="選擇出生日期"
			@click="handleFocus"
		/>
		<van-popup v-model:show="showPicker" position="bottom" @close="handleBlur">
			<div class="calendar-switcher">
				<van-button
					:class="{ active: isGregorian }"
					@click="toggleCalendar('gregorian')"
				>
					公曆
				</van-button>
				<van-button
					:class="{ active: !isGregorian }"
					@click="toggleCalendar('lunar')"
				>
					農曆
				</van-button>
			</div>
			<van-picker
				:columns="columns"
				v-model="selectedValues2"
				confirm-button-text="確認"
				@confirm="onConfirm"
				@cancel="showPicker = false"
				@change="onChange"
			/>
		</van-popup>
	</div>
</template>

<script>
	import { ref, computed, watch } from "vue"
	import ChineseLunar from "chinese-lunar"
	import { postTrackInfo } from "@/services/index"
	import { useDataStore } from "@/stores/dataStore"
	export default {
		props: {
			lunarBirthday: {
				type: String,
				default: "",
			},
			gregorianBirthday: {
				type: String,
				default: "",
			},
		},
		emits: [
			"update:lunarBirthday",
			"update:gregorianBirthday",
			"update:selectResult",
		],
		setup(props, { emit }) {
			const showPicker = ref(false)
			const isGregorian = ref(true)
			const trackStore = useDataStore()

			const handleFocus = async () => {
				trackStore.setTrackData({
					action: "action_birthday_enter",
				})
				await postTrackInfo(trackStore.trackData)
				showPicker.value = true
			}

			const handleBlur = async () => {
				// console.log(localSelectResult.value)
				if (localSelectResult.value == "") {
					trackStore.setTrackData({
						action: "action_birthday_empty",
					})
				} else {
					trackStore.setTrackData({
						action: "action_birthday_content",
					})
				}
				await postTrackInfo(trackStore.trackData)
			}

			const localSelectResult = computed({
				get() {
					return isGregorian.value
						? props.gregorianBirthday
						: props.lunarBirthday
				},
				set(value) {
					if (isGregorian.value) {
						emit("update:gregorianBirthday", value)
						emit("update:lunarBirthday", "")
					} else {
						emit("update:lunarBirthday", value)
						emit("update:gregorianBirthday", "")
					}
					emit("update:selectResult", value)
				},
			})
			const createArray = (length, start = 0) =>
				Array.from({ length }, (_, i) => ({
					text: String(start + i).padStart(2, "0"),
					value: String(start + i).padStart(2, "0"),
				}))

			const createHourSegments = () =>
				Array.from({ length: 24 }, (_, i) => {
					const hour = (i - 1 + 24) % 24 // 往前推1小时，确保时间不会小于0
					const formattedHour = String(hour).padStart(2, "0") // 格式化小时
					const dizhiSymbol = getDizhi(formattedHour) // 获取对应的地支符号
					return {
						text: `${formattedHour}:00-${formattedHour}:59(${dizhiSymbol})`,
						value: `${formattedHour}:00-${formattedHour}:59`,
					}
				})

			const dizhi = [
				"丑",
				"寅",
				"卯",
				"辰",
				"巳",
				"午",
				"未",
				"申",
				"酉",
				"戌",
				"亥",
				"子",
			]

			const getDizhi = (hour) => {
				// 小时往前推1，确保24小时制正确
				const adjustedHour = (parseInt(hour) - 1 + 24) % 24
				return dizhi[Math.floor(adjustedHour / 2) % 12]
			}
			const years = ref(createArray(75, 1950))
			const months = ref(createArray(12, 1))
			const days = ref(createArray(31, 1))
			const hourSegments = ref(createHourSegments())
			const columns = ref([
				years.value,
				months.value,
				days.value,
				hourSegments.value,
			])
			// 设置默认年份为1990年
			const defaultYearIndex = years.value.findIndex(
				(year) => year.value === "1990",
			)
			// 默认选中1990年1月1日，00:00-00:59
			const selectedValues2 = ref([
				years.value[defaultYearIndex].value,
				months.value[0].value,
				days.value[0].value,
				hourSegments.value[0].value,
			])

			const updateDaysInMonth = (year, month) => {
				let daysInMonth = 31
				if ([4, 6, 9, 11].includes(month)) {
					daysInMonth = 30
				} else if (month === 2) {
					const isLeapYear =
						(year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
					daysInMonth = isLeapYear ? 29 : 28
				}
				days.value = createArray(daysInMonth, 1)
				columns.value = [
					years.value,
					months.value,
					days.value,
					hourSegments.value,
				]
				// console.log(years.value)
			}

			const updateLunarColumns = () => {
				const lunarYear = parseInt(selectedValues2.value[0]) // 当前选中的农历年份
				const currentSelectedMonth = selectedValues2.value[1] || 1

				const lunarMonths = Array.from({ length: 12 }, (_, i) => {
					const month = i + 1
					return {
						text: ChineseLunar.monthName(month, "traditional"),
						value: month,
					}
				})

				const lunarDays = (lunarYear, lunarMonth) => {
					const lunarFirstDay = { year: lunarYear, month: lunarMonth, day: 1 }
					const lunarEndDay = { year: lunarYear, month: lunarMonth, day: 30 }

					const solarStart = ChineseLunar.lunarToSolar(lunarFirstDay)
					const solarEnd = ChineseLunar.lunarToSolar(lunarEndDay)

					const daysInLunarMonth =
						(new Date(solarEnd) - new Date(solarStart)) /
							(1000 * 60 * 60 * 24) >=
						29
							? 30
							: 29

					return createArray(daysInLunarMonth, 1).map((day) => {
						let dayName = ChineseLunar.dayName(day.value)
						// 判断当日期为10时，显示为 "初十"
						if (day.value === "10") {
							dayName = "初十"
						}
						return {
							text: dayName,
							value: day.value,
						}
					})
				}
				// 获取当前选中的月份
				const selectedMonth = parseInt(selectedValues2.value[1])

				// 更新天数列表
				days.value = lunarDays(lunarYear, selectedMonth)
				// 更新列数据
				columns.value = [
					years.value,
					lunarMonths,
					days.value,
					hourSegments.value,
				]
			}

			const validateAndUpdateDate = (year, month) => {
				if (isGregorian.value) {
					updateDaysInMonth(year, month)
				} else {
					updateLunarColumns()
				}
			}

			const onChange = (event) => {
				const { selectedValues } = event
				const selectedYear = parseInt(selectedValues[0]) // 选择的年份
				const selectedMonth = parseInt(selectedValues[1]) // 选择的月份

				if (!isNaN(selectedYear) && !isNaN(selectedMonth)) {
					if (isGregorian.value) {
						// 阳历模式
						validateAndUpdateDate(selectedYear, selectedMonth)
					} else {
						// 农历模式
						updateLunarColumns()

						// 更新 selectedValues2，确保选中年份、月份和日期的变化
						selectedValues2.value[0] = selectedYear.toString() // 更新年份
						selectedValues2.value[1] = selectedMonth.toString() // 更新月份

						const maxDay = days.value.length
						const selectedDay = parseInt(selectedValues[2])
						if (selectedDay <= maxDay) {
							selectedValues2.value[2] = selectedDay.toString()
						} else {
							selectedValues2.value[2] = "1" // 超出天数范围时，回到1号
						}

						selectedValues2.value[3] = selectedValues[3] // 更新时间段
					}
				}
			}
			const formatLunarDate = (
				lunarYear,
				lunarMonthText,
				lunarDayText,
				hourSegment,
				dizhiSymbol,
			) =>
				`${lunarYear}年${lunarMonthText}${lunarDayText} ${hourSegment}(${dizhiSymbol})`

			const onConfirm = (values) => {
				if (Array.isArray(values?.selectedValues)) {
					const [year, month, day, hourSegment] = values.selectedValues
					const startHour = hourSegment.split(":")[0]
					const dizhiSymbol = getDizhi(startHour)

					let formattedDate
					if (isGregorian.value) {
						formattedDate = `${year}年${String(month).padStart(
							2,
							"0",
						)}月${String(day).padStart(
							2,
							"0",
						)}日 ${hourSegment}(${dizhiSymbol})`
					} else {
						const lunarMonthText = ChineseLunar.monthName(month, "traditional")
						// 处理初十的情况，避免返回 "十十"
						let lunarDayText = ChineseLunar.dayName(day)
						if (day === "10") {
							lunarDayText = "初十"
						}
						console.log(lunarDayText)
						formattedDate = formatLunarDate(
							year,
							lunarMonthText,
							lunarDayText,
							hourSegment,
							dizhiSymbol,
						)
					}

					localSelectResult.value = formattedDate
					showPicker.value = false
				} else {
					console.error("Expected selectedValues to be an array.")
				}
			}

			return {
				showPicker,
				columns,
				onConfirm,
				handleFocus,
				handleBlur,
				localSelectResult,
				isGregorian,
				toggleCalendar: (type) => {
					if (type === "gregorian") {
						isGregorian.value = true
						updateDaysInMonth(
							parseInt(years.value[0].value),
							parseInt(months.value[0].value),
						)
					} else if (type === "lunar") {
						isGregorian.value = false
						updateLunarColumns()
					}
				},
				onChange,
				selectedValues2,
			}
		},
	}
</script>
