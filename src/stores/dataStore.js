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
		trackData: {
			actionTimestamp: "",
			action: "",
			channel: "",
			material: "",
			deviveType: "",
			uid: "",
			gender: "",
			lunarBirthday: "",
			gregorianBirthday: "",
			landingType: "",
			destinyType: "",
		},
		emailAddr: "",
	}),
	actions: {
		setResponseData(data) {
			this.responseData = data
		},
		setRawFormData(formdata) {
			this.rawFormData = formdata
		},
		setTrackData(data) {
			this.trackData = { ...this.trackData, ...data }
		},
		setEmail(emaildata) {
			this.emailAddr = emaildata
		},
	},
})
