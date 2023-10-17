// pages/login/index.ts
import {
	captchaRegister,
	getWxOpenId,
	captchaValidate,
	sendSmsCode,
	userLoginByVerifyCode
} from '../../api/login'
const app = getApp()
import { miniPromisify } from '../../utils/async-utils'
import { imageBaseUrl } from '../../utils/config'
import { share } from '../../utils/util'
import Toast from 'tdesign-miniprogram/toast';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		radioStatus: false, // 协议是否选中
		phone: '', // 手机input
		code: '', // 验证码input
		canGetVeriCode: false, // 是否可以获取验证码
		loginDisabled: true, // 是否可点击登陆按钮
		countDown: 0, // 验证码的倒计时
		verify: false,
		needCaptcha: false, // 是否需要展示验证码滑块
		gt: '',
		challenge: '',
		offline: false,
		registerUrl: 'https://ydyk.sikuyunshu.com/pubstatic/agreements/agreement_user_register.html',
		imageUrl: imageBaseUrl + 'images/home/',
		logoImage: imageBaseUrl + 'images/login/banxuebao_logo.png',
		titleImage: imageBaseUrl + 'images/login/banxuebao_title.png',
	},
	wxLogin: miniPromisify(wx.login), // miniPromisify-转promise格式
	pureNumber: /[^\d]/g, // 纯数字
	mmvToken: '', // 滑块验证成功回调返回的token
	countDownTimer: null, // 短信倒计时
	wxCode: '',
	initCaptchaCount: 0, // 初始化滑块的次数
	sendSmsCount: 0, // 发送短信验证码的次数
	loginLoading: false, // 请求登陆中防止连续点击

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad() {
		wx.hideHomeButton()
		wx.removeStorage({
			key: 'home_books'
		})

		this.initCaptchaCount = 0 // 滑块初始化的次数
		this.sendSmsCount = 0 // 短信发送次数

		// 存openId
		this.getWxCode()

	},

	// 获取wxCode
	getWxCode: function () {
		this.wxLogin().then(res => {
			this.wxCode = res.code

			this.getOpenId(this.wxCode)
		}).catch(error => {
			console.error('wx.login:error:', error)
		})
	},

	// wxCode换openId
	getOpenId: function (wxCode) {
		getWxOpenId({
			wxCode: wxCode
		}).then(res => {
			app.globalData.requestHeader['device-id'] = res.data

			// 滑块必须初始化执行一次。
			this.captchaInit()
		})
	},

	// 初始化滑块
	captchaInit: function () {
		this.initCaptchaCount++
		this.mmvToken = ''

		return captchaRegister().then(resp => {
			const respData = resp.data || {}
			const {
				status,
				mmvToken,
				gt,
				challenge,
				success
			} = respData
			this.mmvToken = mmvToken
			this.setData({
				needCaptcha: status === 1,
				gt,
				challenge,
				offline: !success
			})
		}).catch(error => {
			console.error('初始化验证码失败', error)
			Toast({
				context: this,
				selector: '#t-toast',
				message: '初始化验证码失败，请重新进入小程序重试',
			});
			this.setData({
				needCaptcha: false
			})
		})
	},

	// 滑块通过
	captchaSuccess: function (result) {
		const captchaResult = result.detail || {}
		// eslint-disable-next-line camelcase
		const {
			geetest_challenge,
			geetest_validate,
			geetest_seccode
		} = captchaResult
		captchaValidate({
			geetest_challenge,
			geetest_validate,
			geetest_seccode
		}).then(resp => {
			const respData = resp.data || {}
			const {
				mmvToken
			} = respData
			if (mmvToken) {
				this.mmvToken = mmvToken
				this.getVeriCode()
			} else {
				wx.showToast()
				console.error('验证码二次校验失败', resp)
			}
		}).catch(error => {
			console.log('验证码二次校验失败', error)
		})
	},

	// 滑块不通过
	captchaError: function (err) {
		console.log(err)
	},

	// 获取验证码
	getVeriCode: function () {
		const {
			phone,
			canGetVeriCode
		} = this.data

		if (!canGetVeriCode) {
			Toast({
				context: this,
				selector: '#t-toast',
				message: '请输入正确的手机号',
			});
			return false
		}

		/**
		 * 如果滑块验证通过并且短信发送了。下一次需要重新初始化滑块。
		 */
		if (this.initCaptchaCount === this.sendSmsCount) {
			this.captchaInit().then(() => {
				this.setData({
					verify: true
				})
			})
			return false
		}

		if (!this.mmvToken) {
			this.setData({
				verify: true
			})
			return false
		}

		this.sendSmsCount++ // 发一次加一次

		const smsNeedData = {
			mobile: phone
		}
		const smsNeedHeader = {
			mmvToken: this.mmvToken
		}

		sendSmsCode(
			smsNeedData,
			smsNeedHeader
		).then(() => {
			this.setData({
				getCode: false,
				countDown: 60
			}, () => {
				this.startCountDownTimer()
			})
			setTimeout(() => {
				this.setData({
					codeFocus: true
				})
			}, 1500)
		})
	},

	// input输入
	changeInput: function (e) {
		const type = e.target.dataset.type
		// 判断条件不多时，使用if语句
		if (type === 'phone') {
			this.changePhone(e)
		} else if (type === 'code') {
			this.changeCode(e)
		}
	},

	// 手机号输入
	changePhone: function (e) {
		const phone = e.detail.value.replace(this.pureNumber, '')
		this.setData({
			phone,
			canGetVeriCode: this.checkPhone(phone)
		}, () => {
			this.IsCanLogin()
		})
	},

	// 校验验证码输入完成
	checkCode: function (num) {
		return num.length === 6
	},

	// 校验手机号输入完成
	checkPhone: function (phone) {
		return phone.length === 11 && /^1\d{10}$/.test(phone)
	},

	// 清空手机号
	clearPhone: function () {
		this.setData({
			phone: '',
			canGetVeriCode: false
		}, () => {
			this.IsCanLogin()
		})
	},

	// 验证码输入
	changeCode: function (e) {
		const code = e.detail.value.replace(this.pureNumber, '')
		this.setData({
			code,
			showDelBtn_code: code.length
		}, () => {
			this.IsCanLogin()
		})
	},

	// 是否可以登录
	IsCanLogin: function () {
		// 手机号验证码格式正确，允许了用户协议
		this.setData({
			loginDisabled: !(this.checkPhone(this.data.phone) && this.checkCode(this.data.code))
		})
	},


	// 开启倒计时定时器
	startCountDownTimer: function () {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this
		this.countDownTimer = setInterval(() => {
			if (self.data.countDown === 1) {
				self.endTime()
			}
			self.setData({
				countDown: --self.data.countDown
			})
		}, 1000)
	},

	// 清除定时器
	endTime: function () {
		clearInterval(this.countDownTimer)
	},

	// 修改同意用户协议
	changeRadio: function () {
		this.setData({
			radioStatus: !this.data.radioStatus
		}, () => {
			this.IsCanLogin()
		})
	},

	// 登录
	login: function () {
	  const {
		phone,
		code,
		radioStatus
	  } = this.data
  
	  if (!radioStatus) {
		Toast({
			context: this,
			selector: '#t-toast',
			message: '如果不同意本政策，将无法使用我们的产品和服务',
		});
		return false
	  }

	//   正在登陆请求中不能点击
	  if (this.loginLoading) {
		  return false
	  }
	  this.loginLoading = true
  
	  this.wxLogin().then(res => {
		this.wxCode = res.code
		const loginNeedData = {
		  verifyCode: code,
		  mobile: phone,
		  wxCode: this.wxCode
		}
  
		userLoginByVerifyCode(loginNeedData).then(resp => {
		  this.loginLoading = false
		  this.enterNextPage(resp.data)
		})
	  })
	},

	// 进入下一个页面
	enterNextPage: function (data) {
	  const {
		token,
		userInfo
	  } = data
  
	  // 将token存入全局变量
	  if (token) {
		app.globalData.requestHeader['ant-auth'] = token
	  }
  
	  app.globalData.userInfo = userInfo
	  wx.switchTab({
		url: '/pages/home/index',
		fail:function(e){
			console.log('跳转失败', e)
		  },
		  complete:function(){
			console.log('跳转成功')
		  }
	  })
	},

	// 跳转协议
	toProtocol: function (e) {
		let url = ''
    switch (e.target.dataset.type) {
      case 'userRegist':
        url = `/pages/webview/index?scene=${1}`
        break
      case 'userPrivacy':
        url = `/pages/webview/index?scene=${2}`
        break
    }
    console.log('跳转webview路径', url)
    wx.navigateTo({
      url
    })
	},

  onShareAppMessage() {
    return share()
  }
})