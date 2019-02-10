//index.js
//获取应用实例
const app = getApp()

const checkEmail = (email) => {
	let myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	let result = false
	if (!email || typeof email !== 'string') {
		return result
	}
	if (!myreg.test(email)) {
		return result
	} else {
		result = true
		return result
	}
}

const grobal = {
	loading: false,
}

Page({
	data: {
		email: '',
		password: '',
	},
	onLoad () {
		console.log('onLoad')
	},
	bindEmailInput (e) {
		this.setData({
			email: e.detail.value
		})
	},
	bindPasswordInput (e) {
		this.setData({
			password: String(e.detail.value)
		})
	},
	/**
	 * 获取用户信息
	 * @param e
	 */
	getUserInfo: function (e) {
		// 用户拒绝授权
		if (e.detail && !e.detail.userInfo ) {
			wx.showToast({
				title: '你拒绝了授权',
			})
			return
		}
		if (e.detail && e.detail.userInfo) {
			let userInfo = e.detail.userInfo;
			console.log(userInfo)
			this.submit({
				type:2,
				avater: userInfo.avatarUrl,
				nickname: userInfo.nickName,
				address: userInfo.province,
			})
		}
	},
	handleSubmit () {
		this.submit({type: 1})
	},
	/**
	 * 点击输入的按钮
	 */
	submit ({type, address = '', nickname = '', avater = ''}) {
		if (this.grobal.loading) {
			return;
		}
		this.grobal.loading = true
		// 如果是授权登录，则必须有 address, nickname avater 参数
		if ((type === 2) && (!address || !nickname || !avater)) {
			return
		}
		// 校验邮箱
		if (!this.data.email || !(checkEmail(this.data.email))) {
			wx.showToast({
				title: '请输入正确的email'
			})
			return;
		}
		// 校验密码
		if (!this.data.password || this.data.password.length < 6) {
			wx.showToast({
				title: '请输入正确的密码'
			})
			return
		}
		wx.login({
			success: res => {
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
				if (!res || !res.code) {
					wx.showToast({
						title: '调用登录方法失败',
					})
					return
					this.grobal.loading = false;
				}
				let params = {
					code: res.code,
					avater: avater || '',
					nickname: nickname || '',
					address: address || '',
					email: this.data.email,
					password: this.data.password,
					method: 'wx_register',
					type,
				}
				wx.request({
					url: 'http://127.0.0.1:85/notebook',
					data: params,
					header: {
						'content-type': 'application/json' // 默认值
					},
					success(res) {
						this.grobal.loading = false
						let result = res.data
						if (!result.success || !result.data) {
							wx.showModal({
								title: result.message || '注册失败',
								content: '您的账号已经被注册，请直接登录',
								showCancel: false,
							})
							return
						}

						
						let session = result.data.session
						
						// 存入缓存中 官方文档 https://developers.weixin.qq.com/miniprogram/dev/api/wx.removeStorageSync.html
						wx.setStorageSync('cache_session', session)
						
						wx.showModal({
							title: '注册成功',
							content: '登录态已经存入storage中, 点击确认跳到个人信息页面',
							showCancel: false,
							success: () => {
								wx.redirectTo({
									url: '/pages/person/person'
								})
							}
						})

					}
				})
			}
		})
	}
})
