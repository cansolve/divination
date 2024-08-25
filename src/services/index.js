import request from '@/utils/request'
import queryString from 'query-string'
import query from '../utils/query'

export function examplePost(data) {
  return request({
    url: `xxx?${queryString.stringify(query)}`,
    method: 'POST',
    data,
  })
}

// 首页获得信息
export function getInitInfo(params) {
  return request({
    url: `list?${queryString.stringify(query)}`,
    method: 'GET',
    params,
  })
}

// 提交信息
export function postUserInfo(data) {
  return request({
    url: `info?${queryString.stringify(query)}`,
    method: 'POST',
    data,
  })
}
