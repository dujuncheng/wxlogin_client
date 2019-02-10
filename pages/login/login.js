//index.js
//获取应用实例
const app = getApp()
console.log(app)

Page({
	data: {
		userInfo: {},
		// 用户的授权情况
		authInfo: {},
		// 是否已经授权用户信息
		canUserInfo: false,
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
		// 用户拒绝授权
		if (e.detail && !e.detail.userInfo ) {
			wx.showToast({
				title: '你拒绝了授权',
			})
			return
		}
		if (e.detail && e.detail.userInfo) {
			let userInfo = e.detail.userInfo;
			let params = {
				info: {
					avater: userInfo.avatarUrl,
					nickname: userInfo.nickName,
					address: userInfo.province,
				},
				type: 2
			}
			this.getLogin(params);
		}
	},
	/**
	 * 响应点击事件
	 */
	handleLogin () {
		// type 1 是普通登录 type 2是带用户信息的登录
		let params = {
			type: 1
		}
		this.getLogin(params);
	},
	/**
	 * 登录
	 */
	getLogin(params) {
		let self = this;
		// 先拿到code 发送 res.code 到后台换取 openId, sessionKey,
		wx.login({
			success: res => {
				if (!res || !res.code) {
					wx.showToast({
						title: '调用登录方法失败',
					})
					return
				}
				params.code = res.code;
				wx.request({
					url: `${app.globalData.url}?method=wx_login`,
					data: params,
					header: {
						'content-type': 'application/json' // 默认值
					},
					success(res) {
						let result = res.data;
						if (!result || !result.success || !result.data) {
							wx.showToast({
								title: '网络请求失败'
							})
							// err_code为1说明没有注册
							if (result.err_code === 1) {
								wx.showModal({
									title:'你的账号没有注册呢',
									content: '点击【确认】去往注册页面',
									showCancel: false,
									success: () => {
										wx.redirectTo({
											url: '/pages/register/register'
										})
									}
								})
							}
							return
						}
						
						let session = result.data.session
						
						// 存入缓存中 官方文档 https://developers.weixin.qq.com/miniprogram/dev/api/wx.removeStorageSync.html
						wx.setStorageSync('cache_session', session)
						
						wx.showModal({
							title: '登录成功',
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
	},
})
