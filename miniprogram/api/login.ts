import { request } from '../utils/request'
/**
 * 根据微信code获取openId
 * @param  data
 * @returns {Promise<minimist.Opts.unknown>}
 */
function getWxOpenId (data: any) {
	return request({
	  url: 'account/get_wechat_openid',
	  data,
	  method: 'POST',
	  isShowLoading: false
	})
  }
  /**
   * 滑块验证码初始化接口
   * @param data
   * @returns {Promise<minimist.Opts.unknown>}
   */
  function captchaRegister (data: any) {
	return request({
	  url: 'account/risk_slider_init',
	  data,
	  method: 'POST',
	  isShowLoading: true
	})
  }
  
  /**
   * 滑块验证码校验接口
   * @param data
   * @returns {Promise<minimist.Opts.unknown>}
   */
  function captchaValidate (data: any) {
	return request({
	  url: 'account/risk_slider_validate',
	  data,
	  method: 'POST',
	  isShowLoading: true
	})
  }
  
  function sendSmsCode (data, header) {
	return request({
	  url: 'account/send_verify_code',
	  data: data,
	  header: header,
	})
  }
  
  function userLoginByVerifyCode (data: any) {
	return request({
	  url: 'account/user_login_verify_code',
	  data,
	  method: 'POST',
	})
  }
  
  function userLogOut (data: any) {
	return request({
	  url: 'account/user_logout',
	  data,
	  method: 'POST',
	})
  }
  
  module.exports = {
    captchaRegister,
    captchaValidate,
    getWxOpenId,
    sendSmsCode,
    userLoginByVerifyCode,
    userLogOut
  }
  