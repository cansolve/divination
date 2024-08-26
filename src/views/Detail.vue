<template>
	<div class="detail__page">
		<div class="banner"></div>
		<div class="page__title">
			<span class="title__txt">单身寻找姻缘</span>
		</div>
		<div class="detail__wrap">
			<div class="main-info">
				<div class="main-tit">基本信息</div>
				<p class="main-infotxt">
					<span>*</span>出生日期：<span>1990年9月28日</span>
				</p>
				<p class="main-infotxt">
					<span>*</span>出生時間：<span>子時(23:00-1:00)</span>
				</p>
				<div class="more__info-tit">你的紫微鬥數命盤如下:</div>
				<div class="more__info-txt">
					命宮：紫微、貪狼 身宮：在寅宮，遷移宮中 夫妻宮：天機、太陰
					福德宮：太陽、天梁:
				</div>
			</div>
			<div class="free__report">
				<div class="report-tit">
					<span class="report-tit-txt">性格分析與單身原因</span>
				</div>
				<div class="report__detail">
					<p>
						從你的命盤來看，命宮中有紫微和貪狼星，這表明你在事業和自我追求上有很強的動力和能力，可能更多地把時間和精力放在工作和個人發展上
					</p>
				</div>
			</div>
			<div class="pay__report unpaid">
				<div class="report-tit">
					<span class="report-tit-txt">結婚年齡預測</span>
				</div>
				<div class="report__detail">
					<p>
						從你的命盤來看，命宮中有紫微和貪狼星，這表明你在事業和自我追求上有很強的動力和能力，可能更多地把時間和精力放在工作和個人發展上
					</p>
					<p>
						從你的命盤來看，命宮中有紫微和貪狼星，這表明你在事業和自我追求上有很強的動力和能力，可能更多地把時間和精力放在工作和個人發展上
					</p>
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
	</div>
</template>
<script>
	import { onMounted } from "vue";
	import { usePageEntryTime } from "../utils/pageEntryTime"; // 引入页面时间钩子函数

	export default {
		name: "DetailPage",
		setup() {
			const { entryTime } = usePageEntryTime(); //调用页面进入时间

			onMounted(() => {
				console.log("免费报告页面进入时间：" + entryTime.value); //页面进入时间
			});

			return {
				entryTime,
			};
		},
	};
</script>
<style lang="scss"></style>
