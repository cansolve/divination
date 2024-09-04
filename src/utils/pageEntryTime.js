/**
 * @ Author: Ryan Tong
 * @ Create Time: 2024-08-25 11:22:08
 * @ Modified by: Ryan Tong
 * @ Modified time: 2024-09-04 17:33:23
 * @ Email: tongxiang608@gmail.com
 */

// usePageEntryTime.js
import { ref, onMounted, watch } from "vue"
import { useRoute } from "vue-router"

export function usePageEntryTime() {
	const entryTime = ref("")
	const route = useRoute()

	function updateEntryTime() {
		const entryTimestamp = performance.now()
		entryTime.value = new Date(
			performance.timeOrigin + entryTimestamp,
		).toLocaleString()
	}

	onMounted(() => {
		updateEntryTime() // 初次挂载时更新时间
	})

	// 监听路由路径的变化，更新页面进入时间
	watch(
		() => route.fullPath,
		() => {
			console.log(route.fullPath)
			updateEntryTime()
		},
	)

	return {
		entryTime,
	}
}
