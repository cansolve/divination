<template>
	<div class="date__group">
		<van-field
			v-model="localSelectResult"
			is-link
			readonly
			name="picker"
			placeholder="選擇出生日期"
			@click="showPicker = true"
		/>
		<van-popup v-model:show="showPicker" position="bottom">
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
					const hour = String(i).padStart(2, "0")
					const dizhiSymbol = getDizhi(hour)
					return {
						text: `${hour}:00-${hour}:59(${dizhiSymbol})`,
						value: `${hour}:00-${hour}:59`,
					}
				})

			const dizhi = [
				"子",
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
			]

			const getDizhi = (hour) => dizhi[Math.floor(parseInt(hour) / 2) % 12]

			const years = ref(createArray(75, 1910))
			const months = ref(createArray(12, 1))
			const days = ref(createArray(31, 1))
			const hourSegments = ref(createHourSegments())

			const columns = ref([
				years.value,
				months.value,
				days.value,
				hourSegments.value,
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
			}

			const updateLunarColumns = () => {
				const lunarYear = parseInt(years.value[0].value)

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

					return createArray(daysInLunarMonth, 1).map((day) => ({
						text: ChineseLunar.dayName(day.value),
						value: day.value,
					}))
				}

				const selectedMonth = parseInt(months.value[0].value)
				days.value = lunarDays(lunarYear, selectedMonth)
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
				const selectedYear = parseInt(selectedValues[0])
				const selectedMonth = parseInt(selectedValues[1])

				if (!isNaN(selectedYear) && !isNaN(selectedMonth)) {
					validateAndUpdateDate(selectedYear, selectedMonth)
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
						const lunarDayText = ChineseLunar.dayName(day)
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
			}
		},
	}
</script>

<style lang="scss">
	.date__group {
		.van-picker__columns {
			justify-content: center;
		}

		.van-picker-column {
			flex: none;

			&:nth-child(-n + 3) {
				width: 15%;
			}
		}
	}

	.calendar-switcher {
		position: absolute;
		top: 10px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 1;
		display: flex;
		display: inline-flex;
		justify-content: center;
		margin-bottom: 20px;
		border: 1px solid #f46825;
		border-radius: 15px;

		button {
			border: none;
			width: 180px;
			height: 80px;
		}

		.active {
			color: white;
			background: #f46825;
		}
	}
</style>
