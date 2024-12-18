/**
 * @ Author: Ryan Tong
 * @ Create Time: 2024-08-25 11:22:08
 * @ Modified by: Ryan Tong
 * @ Modified time: 2024-09-02 11:04:41
 * @ Description:
 */

import request from "@/utils/request"
import queryString from "query-string"
import query from "../utils/query"

export function examplePost(data) {
	return request({
		url: `xxx?${queryString.stringify(query)}`,
		method: "POST",
		data,
	})
}

// 首页获得信息
export function getInitInfo(params) {
	return request({
		url: "/comments",
		method: "GET",
		params,
	})
}

// 提交信息
export function postUserInfo(data) {
	return request({
		url: "/destiny",
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		data,
	})
}
// 提交track信息
export function postTrackInfo(data) {
	return request({
		url: "/track",
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		data,
	})
}

// 提交email信息
export function postEmail(data) {
	return request({
		url: "/email",
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		data,
	})
}

// 提交订单信息
export function postOrderInfo(data) {
	return request({
		url: "/order",
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		data,
	})
}
// 提交orderId信息
export function postOrderApprove(data) {
	return request({
		url: "/orderApprove",
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		data,
	})
}
// 获取mycard信息
export function getMycardPayments() {
	return request({
		url: "/pay/mc/payments",
		method: "GET",
		params: {
			currency: "TWD",
		},
		headers: {
			accept: "application/json",
		},
	})
}
// 提交mycard信息
export function postMycardData(data) {
	return request({
		url: "/pay/mc/authcode",
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		data,
	})
}
