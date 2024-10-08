<template>
	<div class="home__page">
		<div class="banner">
			<img src="../assets/img/banner.jpg" alt="" />
		</div>
		<InfoModule />
		<section class="content1">
			<div class="content__wrap">
				<div class="common__tit">你是不是在經歷這樣的情況</div>
				<div class="con__wrap">
					<img src="../assets/img/item-img0.png" alt="" />
				</div>
			</div>
		</section>
		<section class="content2">
			<div class="content__wrap">
				<div class="common__tit">在這裡你能找到的答案</div>
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
				<div class="common__tit">用戶真實反饋</div>
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
		<!-- <div class="foot__btn">
			<div class="submit__btn" @click="handleNavigation">拆解我的姻緣問題</div>
		</div> -->
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
	import { useRoute, useRouter } from "vue-router"
	import { useDataStore } from "@/stores/dataStore"

	import InfoModule from "./Info.vue"

	export default {
		name: "HomePage",
		components: {
			Swiper,
			SwiperSlide,
			InfoModule,
		},
		setup() {
			const route = useRoute() // 获取当前路由信息
			const router = useRouter() // 获取 router 实例
			const { entryTime } = usePageEntryTime() //调用页面进入时间
			const reviews = computed(() => reviewsData.reviews)

			const trackStore = useDataStore()
			const hasPostedTrackInfo = ref(false) // 跟踪是否已经发送

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
				return "Web"
			}

			onMounted(async () => {
				if (!trackStore.hasPostedTrackInfo) {
					try {
						// 使用 FingerprintJS 初始化并获取 UID
						const fp = await FingerprintJS.load()
						const result = await fp.get()

						trackStore.setTrackData({
							uid: result.visitorId,
							actionTimestamp: entryTime.value,
							action: "action_landing",
							landingType: "landing_marriage",
							channel: route.query.channel || "",
							material: route.query.material || "",
							deviceType: getMobileOperatingSystem(),
						})

						await postTrackInfo(trackStore.trackData) // 发送 POST 请求
						// 标记为已发送
						trackStore.markTrackInfoAsPosted()
					} catch (error) {
						console.error(
							"Failed to load FingerprintJS or send track info",
							error,
						)
					}
				}
			})
			// 解析 JSON 文件中的图片路径
			const getAvatarUrl = (avatar) => {
				return new URL(`../assets/${avatar}`, import.meta.url).href
			}
			const handleNavigation = () => {
				router.push({
					name: "info", // 目标页面的名称
					query: route.query,
					params: "",
				})
			}
			return {
				entryTime,
				reviews,
				modules: [Autoplay],
				getAvatarUrl,
				trackStore,
				handleNavigation,
			}
		},
	}
</script>
<style>
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
