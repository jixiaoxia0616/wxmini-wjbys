<script>
	import {
		login
	} from '@/utils/util.js'
	import {
		studentOut
	} from '@/apis/api.js'
	export default {
		globalData: {
			isLogin:false,
      //如果用户第一次登录，需要注册
      needRegistration: false,
			wxUser: null,
			openid: null,
			educationId:null,
			currentPate:'',
		},
		onLaunch: function(detail) {
			console.log('App Launch-----小程序入口',detail);
			// #ifdef APP-NVUE
			plus.screen.lockOrientation('portrait-primary');

			let appid = plus.runtime.appid;
			if (appid && appid.toLocaleLowerCase() != "hbuilder") {
				uni.request({
					url: 'https://uniapp.dcloud.io/update', //检查更新的服务器地址
					data: {
						appid: plus.runtime.appid,
						version: plus.runtime.version
					},
					success: (res) => {
						console.log('success', res);
						if (res.statusCode == 200 && res.data.isUpdate) {
							let openUrl = plus.os.name === 'iOS' ? res.data.iOS : res.data.Android;
							// 提醒用户更新
							uni.showModal({
								title: '更新提示',
								content: res.data.note ? res.data.note : '是否选择更新',
								success: (showResult) => {
									if (showResult.confirm) {
										plus.runtime.openURL(openUrl);
									}
								}
							})
						}
					}
				})
			}

			var domModule = weex.requireModule('dom');
			domModule.addRule('fontFace', {
				'fontFamily': "texticons",
				'src': "url('./static/text-icon.ttf')"
			});
			// #endif
		},
		onShow: function(e) {
			console.log('App Show------程序开始，程序是否登录',e)
			this.globalData.isLogin = false
			this.checkLogin(e)
		},
		onHide: function() {
			console.log('App Hide')
			//this.studentOutLogin()
		},
		methods: {
			watch: function(method, istr) {
				var obj = this.globalData
				console.log(obj)
				Object.defineProperty(obj, istr, {
					configurable: true,
					enumerable: true,
					set: function(value) {
						this._consumerGoodsStatus = value
						method(value)
					},
					get: function(value) {
						return this._consumerGoodsStatus
					}
				})
			},
			async studentOutLogin() {
				if (!this.isLogin()) {
					return
				}
				let wxUser = this.globalData.wxUser
				let res = await studentOut({
					openid: wxUser.openid
				})
				console.log('res', res)
			},

			async checkLogin(e) {
				let loadingShow = false // 改为不显示loading，避免打扰用户体验
        //如果已经登录(含有wxUser和openid), 已登录，直接跳出
				if(this.globalData.wxUser && this.globalData.openid){
					this.globalData.isLogin = true
					return
				}
				let user = await login(loadingShow)
        console.log('check login user',  user)
				// 静默获取用户openid，但不强制跳转到登录界面
				if (user && user.openid) {
					this.globalData.openid = user.openid
					if (user.wxUser) {
						this.globalData.wxUser = user.wxUser
						this.globalData.isLogin = true
					}
				}
				// 不再强制跳转到登录页面，让用户先体验功能
			},

			isLogin() {
				let openid = this.globalData.wxUser && this.globalData.wxUser.openid
				if (!openid) {
					// 给用户选择是否授权的机会，而不是强制跳转
					uni.showModal({
						title: '登录提示',
						content: '该功能需要登录后才能使用，是否前往登录？',
						success: (res) => {
							if (res.confirm) {
								uni.navigateTo({	url: '/pages/login/loginMain'	})
							}
						}
					})
					return false
				}
				return true
			},
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
