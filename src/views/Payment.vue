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
						<div class="time__num">00:02:00</div>
					</div>
				</div>
				<div class="pay__bd">
					<div class="special__price">特惠价格：$39.9</div>
					<div class="old__price through">原价：$69.9</div>
				</div>
				<van-divider>支付方式</van-divider>
				<div class="pay-radio__box">
					<van-checkbox
						v-model="checked"
						label-position="left"
						checked-color="#d51e00"
						><i class="pay-radio-icon"></i
					></van-checkbox>
				</div>
			</div>
			<div class="email__wrap">
				<input
					type="email"
					name=""
					id=""
					placeholder="请输入邮箱地址接受完整报告"
				/>
			</div>
			<div class="pay__btn-wrap">
				<div class="pay__btn lock">立即支付</div>
			</div>
		</div>
	</div>
</template>
<script>
	import { ref } from "vue";

	export default {
		name: "PaymentPage",
		setup() {
			const checked = ref(false);
			return {
				checked,
			};
		},
	};
</script>
