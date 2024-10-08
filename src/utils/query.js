/**
 * @ Author: Ryan Tong
 * @ Create Time: 2024-08-25 11:22:08
 * @ Modified by: Ryan Tong
 * @ Modified time: 2024-09-04 17:33:30
 * @ Email: tongxiang608@gmail.com
 */

import queryString from "query-string"

let data

if (process.env.NODE_ENV === "development") {
	// 下面是开发时用来测试的数据
	data = queryString.parse(window.location.search)
} else {
}

export default data
