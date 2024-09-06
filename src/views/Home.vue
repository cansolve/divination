<template>
	<div class="home__page">
		<div class="banner">
			<img src="../assets/img/banner.jpg" alt="" />
		</div>
		<section class="content1">
			<div class="content__wrap">
				<div class="common__tit">你是不是在經历這樣的情況</div>
				<div class="con__tit">無法找到姻緣</div>
				<div class="content__item-wrap">
					<div class="content__item">
						<div class="item__img">
							<img src="../assets/img/item-img01.png" alt="" />
						</div>
						<div class="item__name">
							錯過好姻緣
							<div class="item__dsc">單身許久， 錯過很多機會</div>
						</div>
					</div>
					<div class="content__item">
						<div class="item__img">
							<img src="../assets/img/item-img02.png" alt="" />
						</div>
						<div class="item__name">
							對婚姻迷茫
							<div class="item__dsc">適婚年齡， 自己無可奈何</div>
						</div>
					</div>
				</div>
				<div class="con__tit">關系的破滅</div>
				<div class="content__item-wrap">
					<div class="content__item">
						<div class="item__img">
							<img src="../assets/img/item-img03.png" alt="" />
						</div>
						<div class="item__name">
							愛錯了人
							<div class="item__dsc">分手收場, 最後人財兩空</div>
						</div>
					</div>
					<div class="content__item">
						<div class="item__img">
							<img src="../assets/img/item-img04.png" alt="" />
						</div>
						<div class="item__name">
							離婚後
							<br />
							心灰意冷
							<div class="item__dsc">無奈離婚， 以後還有機會嗎</div>
						</div>
					</div>
				</div>
			</div>
		</section>
		<section class="content2">
			<div class="content__wrap">
				<div class="common__tit">在這裏你能找到的答案</div>
				<div class="tit__s">你關心的3大問題</div>
				<div class="problem__wrap">
					<div class="problem__img">
						<img src="../assets/img/problem.png" alt="" />
					</div>
				</div>
			</div>
		</section>
		<section class="content3">
			<div class="content__wrap">
				<div class="common__tit">用户真實反饋</div>
				<div class="content3-banner">
					<img src="../assets/img/content3-banner.png" alt="" />
				</div>
				<div class="user__reviews">
					<swiper
						:direction="'vertical'"
						:slidesPerView="2"
						:space-between="10"
						:loop="true"
						:modules="modules"
						:autoplay="{ delay: 2000, disableOnInteraction: false }"
						class="swiper__warp"
					>
						<swiper-slide v-for="(item, index) in reviews" :key="index">
							<div class="swiper__item">
								<div class="swiper__hd">
									<div class="swiper__hd-img">
										<img :src="getAvatarUrl(item.avatar)" alt="Avatar" />
									</div>
									<div class="swiper__hd-info">
										<div class="user__name">{{ item.name }}</div>
										<div class="user_rate">
											評分：
											<i v-for="n in item.rating" :key="n" class="star"></i>
										</div>
									</div>
								</div>
								<div class="swiper__bd">{{ item.review }}</div>
							</div>
						</swiper-slide>
					</swiper>
				</div>
			</div>
		</section>
		<div class="foot__btn">
			<router-link to="/info">
				<div class="submit__btn">拆解我的姻緣問題</div>
			</router-link>
		</div>
	</div>
</template>

<script>
	import { ref, onMounted, computed } from "vue"
	import { usePageEntryTime } from "@/utils/pageEntryTime" // 引入页面时间钩子函数
	import { Swiper, SwiperSlide } from "swiper/vue"
	import "swiper/css"
	import { Autoplay } from "swiper/modules"
	import reviewsData from "@/data/userlist.json"
	import FingerprintJS from "@fingerprintjs/fingerprintjs"

	import { postTrackInfo } from "@/services/index"

	export default {
		name: "HomePage",
		components: {
			Swiper,
			SwiperSlide,
		},
		setup() {
			const { entryTime } = usePageEntryTime() //调用页面进入时间
			const reviews = computed(() => reviewsData.reviews)

			const trackData = ref({
				uid: "",
				landingPageEntryTime: "",
				landingPageType: "marriage",
				deviveType: "",
			})

			const getMobileOperatingSystem = () => {
				const userAgent =
					navigator.userAgent || navigator.vendor || window.opera
				// 判断 iOS 设备
				if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
					return "iOS"
				}
				// 判断 Android 设备
				if (/android/i.test(userAgent)) {
					return "Android"
				}
				// 如果都不是，返回未知
				return "unknown"
			}

			onMounted(async () => {
				try {
					// 获取页面进入时间
					trackData.value.landingPageEntryTime = entryTime.value
					// 获取设备
					const os = getMobileOperatingSystem()
					trackData.value.deviveType = os

					// 使用 FingerprintJS 初始化并获取 UID
					const fp = await FingerprintJS.load()
					const result = await fp.get()
					trackData.value.uid = result.visitorId

					// console.log("用户设备ID：" + trackData.value.uid)

					// 确保 UID 已获取后再发送 POST 请求
					if (trackData.value.uid) {
						const trackResponse = await postTrackInfo(trackData.value) // 发送 POST 请求
						console.log(trackResponse)
					} else {
						console.error("UID 未获取到")
					}
				} catch (error) {
					console.error(
						"Failed to load FingerprintJS or send track info",
						error,
					)
				}
			})
			// 解析 JSON 文件中的图片路径
			const getAvatarUrl = (avatar) => {
				return new URL(`../assets/${avatar}`, import.meta.url).href
			}
			return {
				entryTime,
				reviews,
				modules: [Autoplay],
				getAvatarUrl,
				trackData,
			}
		},
	}
</script>
<style lang="scss" scoped>
	.btn {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 1002px;
		height: 150px;
		background: url("../assets/img/btn.png") no-repeat center;
		background-size: 100% 100%;
		cursor: pointer;
		animation: resize-animation 2s infinite;
	}

	@keyframes resize-animation {
		0%,
		20%,
		40%,
		100% {
			transform: scale(0.95);
			/* 初始和结束时大小为正常 */
		}

		10%,
		30% {
			transform: scale(1);
			/* 在动画中间时，按钮放大到 1.2 倍 */
		}
	}
</style>
