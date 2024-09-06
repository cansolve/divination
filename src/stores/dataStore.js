/**
 * @ Author: Ryan Tong
 * @ Create Time: 2024-09-03 11:00:59
 * @ Modified by: Ryan Tong
 * @ Modified time: 2024-09-05 11:11:54
 * @ Email: tongxiang608@gmail.com
 */

// stores/dataStore.js
import { defineStore } from "pinia"

export const useDataStore = defineStore("dataStore", {
	state: () => ({
		responseData: null,
		rawFormData: null,
		trackFormData: {}, // 用于存储多个页面的数据
	}),
	actions: {
		setResponseData(data) {
			this.responseData = data
		},
		setRawFormData(formdata) {
			this.rawFormData = formdata
		},

		updateTrackFormData(partialData) {
			this.trackFormData = { ...this.trackFormData, ...partialData }
			console.log(this.trackFormData)
		},
		getTrackFormData() {
			return this.trackFormData
		},
		// 清除数据（如提交后清空）
		clearTrackFormData() {
			this.trackFormData = {}
		},
	},
})
