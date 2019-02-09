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
		// 存入缓存中 官方文档 https://developers.weixin.qq.com/miniprogram/dev/api/wx.removeStorageSync.html
		// wx.setStorageSync('cache_session', "odfasjfadkllkasdjfkladsjfladskfjladsjfaslkfjsalkfjsadlfjsalkfjdslafjlsajfdksajfl")
		// let result = wx.getStorageSync("cache_session")
		// console.log(result)
		
		wx.showModal({
			title: '注册成功',
			content: '登录态已经存入storage中',
			showCancel: false,
			success: () => {
				wx.redirectTo()
			}
		})
		
		// if (!this.data.email || !(checkEmail(this.data.email))) {
		// 	wx.showToast({
		// 		title: '请输入正确的email'
		// 	})
		// 	return;
		// }
		// if (!this.data.password || this.data.password.length < 6) {
		// 	wx.showToast({
		// 		title: '请输入正确的密码'
		// 	})
		// 	return
		// }
		// wx.login({
		// 	success: res => {
		// 		// 发送 res.code 到后台换取 openId, sessionKey, unionId
		// 		if (!res || !res.code) {
		// 			wx.showToast({
		// 				title: '调用登录方法失败',
		// 			})
		// 			return
		// 		}
		// 		let params = {
		// 			code: res.code,
		// 			email: this.data.email,
		// 			password: this.data.password,
		// 			method: 'wx_register',
		// 			type: '1'
		// 		}
		// 		wx.request({
		// 			url: 'http://127.0.0.1:85/notebook',
		// 			data: params,
		// 			header: {
		// 				'content-type': 'application/json' // 默认值
		// 			},
		// 			success(res) {
		// 				let result = res.data
		// 				if (!result.success || !result.data) {
		// 					wx.showToast({
		// 						title: result.message || '注册失败'
		// 					})
		// 				}
		//
		// 				let session = result.data.session
		//
		// 			}
		// 		})
		// 	}
		// })
	}
})
