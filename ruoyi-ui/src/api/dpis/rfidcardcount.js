import request from '@/utils/request'

// 查询采集数据列表
export function listData(query) {
  return request({
    url: '/dpis/rfidcard/countShow',
    method: 'get',
    params: query
  })
}


