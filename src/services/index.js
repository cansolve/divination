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
