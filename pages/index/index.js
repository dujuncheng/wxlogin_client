//index.js
//获取应用实例
const app = getApp()

Page({
	data: {
		motto: 'Hello World',
		userInfo: {},
		// 用户的授权情况
		authInfo: {},
		// 是否已经授权用户信息
		canUserInfo: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo')
	},
	//事件处理函数
	bindViewTap: function () {
		wx.navigateTo({
			url: '../logs/logs'
		})
	},
	onLoad () {
		this.getAuthInfo()
	},
	/**
	 * 获取用户授权的状态
	 */
	getAuthInfo () {
		wx.getSetting({
			success: (res) => {
				if (!res || !res.authSetting) {
					wx.showToast({
						title: '查询授权失败',
					})
					return;
				}
				this.setData({
					authInfo: res.authSetting
				})
				
				let canUserInfo = this.checkAuth('userInfo')
				this.setData({
					canUserInfo,
				})
			}
		})
	},
	/**
	 * 检查用户授权的状态
	 */
	checkAuth (name) {
		let key = `scope.${name}`;
		if (this.data.authInfo[key]) {
			return true
		} else {
			return false;
		}
	},
	/**
	 * 获取用户信息
	 * @param e
	 */
	getUserInfo: function (e) {
		console.log(e)
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
		}
	},
	getLogin() {
		// 登录
		wx.login({
			success: res => {
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
				if (!res || !res.code1) {
					wx.showToast({
						title: '调用登录方法失败',
					})
					return
				}
				let params = {
					code: res.code
				}
				wx.request({
					url: '',
					data: {
						x: '',
						y: ''
					},
					header: {
						'content-type': 'application/json' // 默认值
					},
					success(res) {
						console.log(res.data)
					}
				})
			}
		})
	},
})
