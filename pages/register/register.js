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
	 * 点击输入的按钮
	 */
	submit () {
		debugger
		if (!this.data.email || !(checkEmail(this.data.email))) {
			wx.showToast({
				title: '请输入正确的email'
			})
			return;
		}
		if (!this.data.password || this.data.password.length < 6) {
			wx.showToast({
				title: '请输入正确的密码'
			})
			return
		}
		wx.login({
			success: res => {
				debugger
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
				if (!res || !res.code) {
					wx.showToast({
						title: '调用登录方法失败',
					})
					return
				}
				let params = {
					code: res.code,
					email: this.data.email,
					password: this.data.password,
				}
				wx.request({
					url: 'http://127.0.0.1:85/notebook?method=wx_register',
					data: params,
					header: {
						'content-type': 'application/json' // 默认值
					},
					success(res) {
						console.log(res.data)
					}
				})
			}
		})
	}
})
