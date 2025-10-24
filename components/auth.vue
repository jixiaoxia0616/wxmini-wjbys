<template>
	<view class="login-app">
		<view class="login-app-title">
      <div>
        <text>“毕业申”首次登录请注册</text>
      </div>
		</view>
		<view class="login-app-person">
			<image style="width: 200rpx; height: 200rpx;border-radius: 50%;" :src="formData.avatarUrl" />
      <view class="nickname">
        <text>昵称：</text>
        <input type="nickname" class="weui-input" :value="formData.nickName" @blur="bindBlur"
               placeholder="请输入昵称" @input="bindInput"/>
      </view>
		</view>
<!--		<view class="login-app-tip">-->
<!--			获取您的公开信息(昵称，头像)-->
<!--		</view>-->
		<!-- <view style="margin-top: 30rpx;">
			<uni-data-checkbox v-model="formData.type" mode="tag" :localdata="loginTypes" />
		</view> -->
		<view class="login-app-btn">
			<button type="primary" style="width: 100%;" @click="getUserInfo">微信授权</button>
		</view>

    <view style="display: flex;align-items: center;font-size: 23rpx;justify-content: center;">
      <checkbox-group @change="checkboxChange">
        <checkbox :value="checkAgreement" :class="checkboxStyle"/>
      </checkbox-group>
      登录注册请先同意
      <text style="color: #2F85FC;margin-left: 5rpx;" @click="openPrivacyClause">用户协议·隐私条款</text>
    </view>
	</view>
</template>

<script>
	import {
		saveBaseInfo
	} from '@/apis/api.js'
	const loginTypes = [{
		value: '0',
		text: '普通学生'
	}, {
		value: '1',
		text: '校园大使'
	}]
	export default {
		props: {
			userInfo: Object,
		},
		watch: {
			userInfo: {
				deep: true,
				immediate:true,
				handler(val) {
					if(val){
						for(let name in val){
							if(this.formData.hasOwnProperty(name)){
								this.formData[name] = val[name]
							}
						}
					}
				}
			}
		},
    onShow() {
      this.formData.openid = getApp().globalData.openid
      // if (getApp().globalData && getApp().globalData.openid && getApp().globalData.wxUser) {
      //   this.formData.avatarUrl = getApp().globalData.wxUser.avatarUrl
      //   this.formData.nickName = getApp().globalData.wxUser.nickName
      // }
    },
		data() {
			return {
				loginTypes,
        checkAgreement: false,
        checkboxStyle: 'checkbox-normal',
				formData: {
					avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
					nickName: '微信用户',
					type: '0',
					openid: null
				}
			};
		},
		methods: {
      bindBlur(e) {
        this.formData.nickName = e.detail.value; // 获取微信昵称
      },
      bindInput(e){
        this.formData.nickName = e.detail.value; //这里要注意如果只用blur方法的话用户在输入玩昵称后直接点击保存按钮，会出现修改不成功的情况。
      },

      openPrivacyClause() {
        uni.navigateTo({
          url: '/pages/privacyClause/privacyClause'
        })
      },

      checkboxChange(e) {
        let values = e.detail.value;
        if (values && values.length) {
          this.checkAgreement = !!values[0]
        } else {
          this.checkAgreement = false
        }
      },

			async getUserInfo() {
        if (!this.checkAgreement) {
          console.log("agree", this.checkAgreement)
          this.checkboxStyle = 'checkbox-highlight'
          return
        }
        if (getApp().globalData && getApp().globalData.openid ) {
          this.formData.openid = getApp().globalData.openid
        }
        if (getApp().globalData && getApp().globalData.wxUser) {
          this.formData.avatarUrl = getApp().globalData.wxUser.avatarUrl
          this.formData.nickName = getApp().globalData.wxUser.nickName
        }
				if (getApp().globalData && getApp().globalData.openid && getApp().globalData.wxUser) {
          console.log('auth page: no need register')
					this.$emit('authSave', getApp().globalData.wxUser)
					return
				} else {
          console.log('auth page: need register')
          if (this.formData.openid) {
            let userInfo = await saveBaseInfo(this.formData)
            if (userInfo) {
              this.$emit('authSave', userInfo)
            }
          }
        }

			}
		}
	}
</script>

<style lang="scss">
	.login-app {
		width: 100%;
		height: calc(100vh - 300rpx);
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.login-app-title {
			margin: 0rpx 0 80rpx 0;
			padding: 0 40rpx;
			height: 80rpx;
			line-height: 80rpx;
			font-size: 42rpx;
			font-weight: 550;
			text-align: center;
			color: #000;
			position: absolute;
			top: 40rpx;
			width: 100%;
		}

		.login-app-person {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			.login-app-person-name {
				margin-top: 20rpx;
			}
		}

		.login-app-tip {
			margin-top: 40rpx;
			padding-left: 30rpx;
			width: 600rpx;
			text-align: left;
			color: #7A7E83;
			font-size: 26rpx;

		}

		.login-radio-group {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			margin-top: 60rpx;

			.login-radio-label {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;

				.login-radio-item {
					margin-left: 40rpx;
				}
			}
		}

    .nickname{
      background: #fff;
      padding: 20rpx 30rpx 80rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      .weui-input{
        padding-left: 60rpx;
      }
    }

		.login-app-btn {
			width: 600rpx;
			margin-top: 40rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			position: relative;
			bottom: 40rpx;
		}

    .checkbox-normal {
      transform:scale(0.8);
    }

    .checkbox-highlight {
      transform:scale(0.8);
      animation: shake 0.8s ease;
      box-shadow: 0rpx 0rpx 5rpx 5rpx #f00;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      50% { transform: translateX(5px); }
      75% { transform: translateX(-5px); }
    }
	}
</style>
