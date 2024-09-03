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
