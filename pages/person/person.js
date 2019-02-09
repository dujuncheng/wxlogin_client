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
				self.setData({
					info: result.data,
				})
			}
		})
	}
})
