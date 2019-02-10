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
	onLoad () {
	},
	gohome () {
		wx.redirectTo({
			url: '/pages/person/person'
		})
	}
})
