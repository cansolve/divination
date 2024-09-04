/**
 * @ Author: Ryan Tong
 * @ Create Time: 2024-08-25 11:22:08
 * @ Modified by: Ryan Tong
 * @ Modified time: 2024-09-04 17:33:36
 * @ Email: tongxiang608@gmail.com
 */

import axios from "axios"

const service = axios.create({
	baseURL: "/",
	withCredentials: true,
	timeout: 0,
})

service.interceptors.request.use(
	(config) => {
		return config
	},
	(error) => {
		console.log(error)
		return Promise.reject(error)
	},
)

service.interceptors.response.use(
	(response) => {
		return response.data
	},
	(error) => {
		return Promise.reject(error)
	},
)

export default service
