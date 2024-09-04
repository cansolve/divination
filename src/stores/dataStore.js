/**
 * @ Author: Ryan Tong
 * @ Create Time: 2024-09-03 11:00:59
 * @ Modified by: Ryan Tong
 * @ Modified time: 2024-09-04 17:32:14
 * @ Email: tongxiang608@gmail.com
 */

// stores/dataStore.js
import { defineStore } from "pinia"

export const useDataStore = defineStore("dataStore", {
	state: () => ({
		responseData: null,
		rawFormData: null,
	}),
	actions: {
		setResponseData(data) {
			this.responseData = data
		},
		setRawFormData(formdata) {
			this.rawFormData = formdata
		},
	},
})
