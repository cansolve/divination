<template>
	<div class="detail__page" id="pdf-content">
		<div class="banner">
			<img src="../assets/img/detail-banner.jpg" alt="" />
		</div>
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

	import html2canvas from "html2canvas";
	import jsPDF from "jspdf";

	export default {
		name: "DetailPage",
		setup() {
			const { entryTime } = usePageEntryTime(); //调用页面进入时间

			const generatePDF = () => {
				const element = document.getElementById("pdf-content");

				html2canvas(element, { scale: 2, dpi: 300 }).then((canvas) => {
					const imgData = canvas.toDataURL("image/png");
					const pdf = new jsPDF({
						orientation: "portrait",
						unit: "pt",
						format: "a4",
					});
					const imgWidth = 595.28; // A4 width in pt
					const pageHeight = 841.89; // A4 height in pt
					const imgHeight = (canvas.height * imgWidth) / canvas.width;
					let heightLeft = imgHeight;
					let position = 0;

					pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
					heightLeft -= pageHeight;

					while (heightLeft >= 0) {
						position = heightLeft - imgHeight;
						pdf.addPage();
						pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
						heightLeft -= pageHeight;
					}

					// pdf.save("document.pdf");
				});
			};

			onMounted(() => {
				console.log("免费报告页面进入时间：" + entryTime.value); //页面进入时间
				generatePDF();
			});

			return {
				entryTime,
				generatePDF,
			};
		},
	};
</script>
<style lang="scss"></style>
