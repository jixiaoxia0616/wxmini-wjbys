<template>
	<view class="login-main">
		<uni-steps :options="options" :active="active" :activeColor="uniColorPrimary"></uni-steps>

		<view class="login-main-form">
			<auth v-if="active==0" :userInfo="userInfo" @authSave="authSave"></auth>
			<personForm ref="personForm" v-if="active==1" :userInfo="userInfo" @saveSuccess="saveSuccessPerson">
			</personForm>
			<experience ref="experience" v-if="active==2" :userInfo="userInfo" @saveSuccess="saveSuccessExperience">
			</experience>
		</view>
		<view class="login-main-btns" v-if="active!=0">
			<button @click="backHandler" >返回</button>
			<button type="primary" @click="submitForm">确定</button>
		</view>
	</view>
</template>

<script>
	import auth from '@/components/auth.vue'
	import personForm from '@/components/personForm.vue'
	import experience from '@/components/experience.vue'
	import {
		login
	} from '@/utils/util.js'

	const options = [{
		title: '用户授权'
	}, {
		title: '个人信息'
	}, {
		title: '教育经历'
	}]

	export default {
		components: {
			auth,
			personForm,
			experience
		},
		data() {
			return {
				options,
				active: 0,
				experiences: [],
				detailStr: '',
				userInfo: {
          avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
          nickName: '微信用户',
					type: '0',
					openid: null
				},
				uniColorPrimary: "#34acc3"
			};
		},
		onLoad: function(openValue) { //option为object类型，会序列化上个页面传递的参数
			let detail = JSON.parse(openValue.detail || null)
			if (detail && detail.sceneRecommend && detail.postId && detail.enterpriseId && detail.openid && detail
				.userId) {
				this.detailStr = openValue.detail
			}
		},
		methods: {
			saveSuccessPerson() {
				this.active = 2
			},
			async saveSuccessExperience() {
				// 登录个人信息
				await login()
				// 跳转主界面
				if (this.detailStr) {
					// 如果是从推荐进来则跳转推荐界面
					uni.navigateTo({
						url: '/pages/recommendDetail/recommendDetail?detail' + this.detailStr
					})
				} else {
					if(uni.getStorageSync("lastPage")){
						uni.reLaunch({
							url: uni.getStorageSync("lastPage")
						})
					}else{
						uni.switchTab({
							url: '/pages/home/index'
						})
					}
					
				}
			},
			submitForm() {
				if (this.active == 1) {
					if (this.$refs['personForm']) {
						this.$refs['personForm'].submitForm()
					}

				}
				if (this.active == 2) {
					if (this.$refs['experience']) {
						this.$refs['experience'].submitForm()
					}
				}
			},
			backHandler() {
				if (this.active > 0) {
					this.active = this.active - 1
				}
			},
			authSave(userInfo) {
				console.log('authSave processing', userInfo)
				this.userInfo = userInfo || null
				if (this.userInfo && this.userInfo.openid) {
					if (this.userInfo.identificationNumber
					&& this.userInfo.studentName) {
						this.saveSuccessExperience()
					} else {
						this.active = 1
					}

				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.login-main {
		padding: 30rpx 10rpx;
		overflow: hidden;

		.login-main-title {
			margin: 30rpx 40rpx;
			display: flex;
			align-items: center;
			justify-content: center;

			.login-main-title-right {
				margin-left: 80rpx;

				view {
					height: 50rpx;
					line-height: 50rpx;
				}
			}
		}

		.login-main-form {
			margin: 30rpx 10rpx;
			height: calc(100vh - 300rpx);
			overflow: auto;
		}

		.login-main-btns {
			display: flex;
			align-items: center;
			justify-content: center;

			button {
				width: 38%;
			}
		}
	}
</style>
