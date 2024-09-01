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
		data,
	})
}
