import request from '@/utils/request'

// 查询采集数据列表
export function listData(query) {
  return request({
    url: '/dpis/data/list',
    method: 'get',
    params: query
  })
}

// 查询采集数据详细
export function getData(dataId) {
  return request({
    url: '/dpis/data/' + dataId,
    method: 'get'
  })
}

// 新增采集数据
export function addData(data) {
  return request({
    url: '/dpis/data',
    method: 'post',
    data: data
  })
}

// 修改采集数据
export function updateData(data) {
  return request({
    url: '/dpis/data',
    method: 'put',
    data: data
  })
}

// 删除采集数据
export function delData(dataId) {
  return request({
    url: '/dpis/data/' + dataId,
    method: 'delete'
  })
}
