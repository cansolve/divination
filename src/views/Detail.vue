<template>
	<div class="detail__page" id="pdf-content">
		<div class="banner">
			<img src="../assets/img/detail-banner.jpg" alt="" />
		</div>
		<div class="page__title">
			<span
				class="title__txt"
				v-show="rawFormData.destinyType === 'destiny_type_single'"
				>單身尋找姻緣</span
			>
			<span
				class="title__txt"
				v-show="rawFormData.destinyType === 'destiny_type_broken'"
				>破裂關係走向</span
			>
			<span
				v-show="
					!['destiny_type_single', 'destiny_type_broken'].includes(
						rawFormData.destinyType,
					)
				"
				>未知的命运类型</span
			>
		</div>
		<div class="detail__wrap" v-if="responseData">
			<div class="main-info">
				<div class="main-tit">基本信息</div>
				<p class="main-infotxt">
					<span>*</span>出生日期：<span>{{ datePart }}</span>
				</p>
				<p class="main-infotxt">
					<span>*</span>出生時間：<span>{{ timePart }}</span>
				</p>
				<div class="more__info-tit">你的紫微鬥數命盤如下:</div>
				<div class="more__info-txt">
					{{ responseData.baseInfo }}
				</div>
			</div>
			<div class="free__report">
				<div class="report-tit">
					<span class="report-tit-txt">破裂原因</span>
				</div>
				<div class="report__detail">
					<p>
						{{ responseData.broken }}
					</p>
				</div>
			</div>
			<div class="free__report">
				<div class="report-tit">
					<span class="report-tit-txt">性格分析與單身原因</span>
				</div>
				<div class="report__detail">
					<p>
						{{ responseData.characters }}
					</p>
				</div>
			</div>
			<div class="free__report">
				<div class="report-tit">
					<span class="report-tit-txt">你的桃花星</span>
				</div>
				<div class="report__detail">
					<p>
						{{ responseData.yourLove }}
					</p>
				</div>
			</div>
			<div class="pay__report unpaid">
				<div class="report-tit">
					<span class="report-tit-txt">結婚年齡預測</span>
				</div>
				<div class="report__detail">
					從你的命盤來看，命宮中有天機和巨門星，這顯示你在處事時有較強的智慧和敏感，你善於觀察周圍環境並迅速做出反應。這種才能常使你在與他人的競爭中脫穎而出，然而，有時也顯得過於謹慎和多疑，可能會錯失一些良機。在感情方面，你可能容易給人一種冷靜的感覺，欠缺一些熱情，可能因此在與異性的互動中較難一見鍾情或迅速進展。另外，桃花星的影響意味著你若有愛情機會，需要仔細甄別和把握，不急於做出決定已避免情感上的起伏。至於目前的單身狀況，對的對象能給予涵養耐心，但也需積極創造機遇接觸更多的人群。
				</div>
				<div class="unpaid-infos">
					<div class="unpaid-tips"><i></i><span>查看更多相关信息</span></div>
					<div class="payment__btn">
						<router-link to="/payment">
							<div class="submit__btn">解鎖報告內容</div>
						</router-link>
					</div>
				</div>
			</div>
			<div class="pay__report unpaid">
				<div class="report-tit">
					<span class="report-tit-txt">配偶外形，年齡，職業預測</span>
				</div>
				<div class="report__detail">
					從你的命盤來看，命宮中有天機和巨門星，這顯示你在處事時有較強的智慧和敏感，你善於觀察周圍環境並迅速做出反應。這種才能常使你在與他人的競爭中脫穎而出，然而，有時也顯得過於謹慎和多疑，可能會錯失一些良機。在感情方面，你可能容易給人一種冷靜的感覺，欠缺一些熱情，可能因此在與異性的互動中較難一見鍾情或迅速進展。另外，桃花星的影響意味著你若有愛情機會，需要仔細甄別和把握，不急於做出決定已避免情感上的起伏。至於目前的單身狀況，對的對象能給予涵養耐心，但也需積極創造機遇接觸更多的人群。
				</div>
				<div class="unpaid-infos">
					<div class="unpaid-tips"><i></i><span>查看更多相关信息</span></div>
					<div class="payment__btn">
						<router-link to="/payment">
							<div class="submit__btn">解鎖報告內容</div>
						</router-link>
					</div>
				</div>
			</div>
		</div>
		<div class="detail__wrap filter" v-else>
			<div class="main-info">
				<div class="main-tit">基本信息</div>
				<p class="main-infotxt">
					<span>*</span>出生日期：<span>1914年06月04日</span>
				</p>
				<p class="main-infotxt">
					<span>*</span>出生時間：<span>00:00-00:59(子)</span>
				</p>
				<div class="more__info-tit">你的紫微鬥數命盤如下:</div>
				<div class="more__info-txt">
					命宮：天機、巨門；身宮：在辰宮，遷移宮中；夫婦宮：太陽、天梁；福德宮：紫微、貪狼。
				</div>
			</div>
			<div class="free__report">
				<div class="report-tit">
					<span class="report-tit-txt">破裂原因</span>
				</div>
				<div class="report__detail">
					<p>
						從你的命盤來看，命宮中有天機和巨門星，這顯示你在處事時有較強的智慧和敏感，你善於觀察周圍環境並迅速做出反應。這種才能常使你在與他人的競爭中脫穎而出，然而，有時也顯得過於謹慎和多疑，可能會錯失一些良機。在感情方面，你可能容易給人一種冷靜的感覺，欠缺一些熱情，可能因此在與異性的互動中較難一見鍾情或迅速進展。另外，桃花星的影響意味著你若有愛情機會，需要仔細甄別和把握，不急於做出決定已避免情感上的起伏。至於目前的單身狀況，對的對象能給予涵養耐心，但也需積極創造機遇接觸更多的人群。
					</p>
				</div>
			</div>
		</div>
		<FootWidget />
	</div>
</template>
<script>
	import { onMounted, ref } from "vue"
	import { showLoadingToast, closeToast } from "vant"
	import { useRoute } from "vue-router"

	import { usePageEntryTime } from "@/utils/pageEntryTime" // 引入页面时间钩子函数
	import { useDataStore } from "@/stores/dataStore"
	import { postUserInfo, postTrackInfo } from "@/services/index"
	import FootWidget from "@/components/FootWidget.vue"

	export default {
		name: "DetailPage",
		components: {
			FootWidget,
		},
		setup(props) {
			const { entryTime } = usePageEntryTime() //调用页面进入时间

			const dataStore = useDataStore()
			const responseData = ref(null)
			const rawFormData = dataStore.rawFormData

			const birthday =
				rawFormData.lunarBirthday || rawFormData.gregorianBirthday
			const parts = birthday.split(" ")
			const datePart = parts[0] // "1910年01月01日"
			const timePart = parts.slice(1).join(" ") // "00:00-00:59(子)"

			// 上报信息
			const trackData = ref({
				freeReportEntryTime: "",
			})
			//

			const getResponseData = async () => {
				// 显示加载提示
				const toast = showLoadingToast({
					message: "大師正在預測中...",
					duration: 0, // 持续显示，直到手动关闭
				})
				//表单提交
				try {
					const response = await postUserInfo(rawFormData) // 发送 POST 请求
					responseData.value = response
					// 请求成功后，关闭加载提示并跳转
					closeToast(toast)

					const trackResponse = await postTrackInfo(trackData.value) // 发送 POST 请求
					console.log(trackResponse)
				} catch (error) {
					// 处理错误并关闭加载提示
					closeToast(toast)
					console.error("Failed to post data:", error)
				}
			}
			onMounted(async () => {
				trackData.value.freeReportEntryTime = entryTime.value
				getResponseData()
			})

			return {
				entryTime,
				responseData,
				rawFormData,
				datePart,
				timePart,
				getResponseData,
			}
		},
	}
</script>
<style lang="scss"></style>
