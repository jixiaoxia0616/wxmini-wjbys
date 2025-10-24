<template>
	<view class="list-container">
		<uni-list :loading="loading">
			<view class="jobBox" v-for="(item,index) in tableList" :key="index">
			  <job :itemData="item"></job>
			</view>
		</uni-list>
	</view>
</template>

<script>
import job from '@/components/job.vue'
import {
	getAllRouteEnterpriseRecruitment
} from '@/apis/api.js'
import { getUrlParams } from "../../../utils/util";
export default {
	components: {
    job
	},
	data() {
		return {
			loading: false,
			enterpriseId: '',
			routeId: '',
			tableList: []
		}
	},
	onLoad(openValue) {
		console.log('岗位列表 onLoad start with openValue', openValue)
		this.getQueryParams(openValue)
	},
	onShow() {
		uni.showLoading({ title: '正在加载...', mask: true })
		let that = this
		// 监听登录，登录结束关闭loading
		let inter = setInterval(() => {
			let wxUser = getApp().globalData.wxUser
			//console.log('inverval wxuser', wxUser)
			if (wxUser && wxUser.openid && wxUser.id) {
				clearInterval(inter)
				this.getList()
				uni.hideLoading()
			}
		}, 500)
	},

	methods: {
		getQueryParams(openValue) {
			//console.log('inside open value',openValue)
			if (openValue.detail && openValue.routeId) {
				//如果此次页面打开是从页面跳转进来的，直接解析enterpriseId 和 routeId
				this.enterpriseId = openValue.detail
				this.routeId = openValue.routeId
			} else {
				const qrcodeUrl = decodeURIComponent(openValue.q) // 获取到二维码原始链接内容
				//如果此次页面打开是从第三方扫码扫进来的，qrcode不为undefined
				const urlParams = getUrlParams(qrcodeUrl);
				this.enterpriseId = urlParams.detail;
				this.routeId = urlParams.routeId;
			}
			//console.log('get query enterpriseId,', this.enterpriseId)
			//console.log('get query routeId,', this.routeId)
		},

		async getList() {
			let wxUser = getApp().globalData.wxUser
			if (wxUser && wxUser.openid && wxUser.id) {
				//routeId、studentId、zpRouteRecruitmentId
				let res = await getAllRouteEnterpriseRecruitment({
					routeId: this.routeId,
					enterpriseId: this.enterpriseId,
					studentId: wxUser.id,
					pageNum: 1,
					pageSize: 100000

				})

				if (res && res.data && res.data.code == 200) {
					this.tableList = res.data.rows || []
				}
			} else {
				console.error('无法正常初始化小程序登录，故无法渲染页面/positionList')
			}
		}
	}
}
</script>

<style>
	.list-container{
		padding: 0;
	}
	.jobBox{
		border-bottom: 1rpx solid #efefef;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
		width: 95%;
		margin: 10rpx auto;
	}
</style>
