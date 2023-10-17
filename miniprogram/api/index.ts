import { request } from '../utils/request'
/**
 * 校验是否登陆了
*/
export const checkIfLoginApi = function (data: any) {
  return request({
    url: 'account/user_online_wxcode',
    data,
    method: 'POST'
  })
}