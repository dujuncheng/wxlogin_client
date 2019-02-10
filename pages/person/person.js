Page({
	data: {
		name: 'dudu',
		info: '',
	},
	onLoad () {
		// 从缓存中拿到cache_session
		let cache_session = wx.getStorageSync('cache_session');
		if (!cache_session || typeof cache_session !== 'string') {
			this.showWarn()
			return;
		}
		this.getInfo(cache_session)
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
					url: 'http://127.0.0.1:85/notebook?method=wx_login',
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
							title: '个人信息更新成功',
							content: '登录态已经存入storage中, 点击确认刷新页面',
							showCancel: false,
							success: () => {
								self.getInfo(session)
							}
						})
					}
				})
			}
		})
	},
	showWarn() {
		wx.showModal({
			title: '您还没有登录呢',
			content: '无法在您的缓存中找到登录态, 点击确认去往【登录】',
			showCancel: false,
			success: () => {
				wx.redirectTo({
					url: '/pages/login/login'
				})
			}
		})
	},
	filterTime(info) {
		if (!info.gmt_created) {
			return info
		}
		let timeStamp = Number(info.gmt_created) * 1000;
		let date = new Date(timeStamp);
		info.gmt_created = String(date);
		return info;
	},
	getInfo (session) {
		let self = this;
		if (!session) {
			return
		}
		wx.request({
			url: 'http://127.0.0.1:85/notebook?method=wx_userinfo',
			header: {
				'content-type': 'application/json',
				'x-session': session
			},
			success(res) {
				let result = res.data
				if (!result || !result.success || !result.data) {
					wx.showModal({
						title: '出错了',
						content: `${result.message}, 点击确认去往【登录】`,
						showCancel: false,
						success: () => {
							wx.redirectTo({
								url: '/pages/login/login'
							})
						}
					})
					return
				}
				let info = self.filterTime(result.data);
				self.setData({
					info,
				})
			}
		})
	}
})
