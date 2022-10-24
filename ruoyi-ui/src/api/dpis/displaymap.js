import request from '@/utils/request'

// 查询RFID卡列表，地图上的店
export function listRfidcard(query) {
  return request({
    url: '/dpis/rfidcard/list',
    method: 'get',
    params: query
  })
}

// 查询采集数据列表，每天巡检更新状态
export function listData(query) {
  return request({
    url: '/dpis/data/list',
    method: 'get',
    params: query
  })
}

// 统计采集数据
// export function queryCount(data) {
//   return request({
//     url: '/dpis/data/machine/queryCount',
//     method: 'post',
//     data: data
//   })
// }

export function queryCount(query) {
  return request({
    url: '/dpis/rfidcard/counting',
    method: 'get',
    params: query
  })
}

// 根据在不在线查询卡
export function showOnOfline(query) {
    return request({
      url: '/dpis/rfidcard/showOnOfline',
      method: 'get',
      params: query
    })
  }
