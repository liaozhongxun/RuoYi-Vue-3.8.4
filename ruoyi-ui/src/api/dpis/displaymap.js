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
