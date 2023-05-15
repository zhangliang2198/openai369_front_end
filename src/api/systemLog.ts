import request from '@/utils/request'

export function getList(params: any) {
  return request({
    url: '/systemLog/getList',
    method: 'get',
    params,
  })
}
