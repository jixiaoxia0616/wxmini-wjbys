<template>
	<view class="main">
		<view class="main-context" >
      <view class="" v-for="(item,index) in tableList" :key="index">
        <job :itemData="item"></job>
      </view>
		</view>
	</view>
</template>

<script>
	import {
		getAmbassaAllList
	} from '@/apis/api.js'
  import job from '@/components/job.vue'
	export default {
	components:{job},
		data() {
			return {
				tableList: []
			}
		},
		onLoad: function() {

		},
		onShow: function() { //option为object类型，会序列化上个页面传递的参数
			this.getWxUser()
		},
		onReachBottom(e){
			console.log('页面到底',e)
		},
		onPageScroll(e){
			console.log('页面滚动',e)
		},
		methods: {
			getWxUser() {
				this.tableList = []
				this.searchClick()
			},
			async searchClick() {
				uni.showLoading({
					title: '正在加载...',
					mask: true
				})
				let total = this.tableList.length || 0
				let wxUser = getApp().globalData.wxUser
				if (wxUser && wxUser.campusAmbassador && wxUser.campusAmbassador.enterpriseId) {
					let data = await getAmbassaAllList({
						enterpriseId:wxUser.campusAmbassador.enterpriseId,
					})
					if (data && data.length) {
						this.tableList = data || []
					}
				}
				uni.hideLoading()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.main {
		height: 100vh;
		width: 100%;
		overflow: hidden;
		background-color: $uni-color-primary;
		.main-context {
			width: 100%;
			height: calc(100vh - 20rpx);
			overflow-y: auto;
		}
	}
</style>
