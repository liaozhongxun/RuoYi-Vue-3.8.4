import request from '@/utils/request'

// 查询RFID卡列表
export function listRfidcard(query) {
  return request({
    url: '/dpis/rfidcard/list',
    method: 'get',
    params: query
  })
}

// 查询RFID卡详细
export function getRfidcard(cardId) {
  return request({
    url: '/dpis/rfidcard/' + cardId,
    method: 'get'
  })
}

// 新增RFID卡
export function addRfidcard(data) {
  return request({
    url: '/dpis/rfidcard',
    method: 'post',
    data: data
  })
}

// 修改RFID卡
export function updateRfidcard(data) {
  return request({
    url: '/dpis/rfidcard',
    method: 'put',
    data: data
  })
}

// 删除RFID卡
export function delRfidcard(cardId) {
  return request({
    url: '/dpis/rfidcard/' + cardId,
    method: 'delete'
  })
}
