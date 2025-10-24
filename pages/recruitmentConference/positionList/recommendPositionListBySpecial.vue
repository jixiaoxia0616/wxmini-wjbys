<template>
	<uni-list :loading="loading">
    <view class="" v-for="(item,index) in tableList" :key="index">
      <job :itemData="item"></job>
    </view>
	</uni-list>
</template>

<script>
import job from '@/components/job.vue'
import {
	getRecommendPositionListByspecial
} from '@/apis/api.js'
import { getUrlParams } from "../../../utils/util";
export default {
	components: {
		job
	},
	data() {
		return {
			loading: false,
			schoolName: '',
			routeId: '',
			type: 'major',
			searchValue: '',
			tableList: []
		}
	},
	onLoad(openValue) {
		console.log('推荐岗位列表 onLoad start with openValue', openValue)
		this.getQueryParams(openValue)
		uni.setNavigationBarTitle({
			title: '岗位推荐-' + this.schoolName + '-' + this.searchValue
		});
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
			if (openValue.schoolName && openValue.routeId) {
				//如果此次页面打开是从页面跳转进来的，直接解析schoolName, specialName 和 routeId
				this.routeId = openValue.routeId;
				this.schoolName = openValue.schoolName;
				this.type = openValue.type;
				this.searchValue = openValue.searchValue;
			} else {
				const qrcodeUrl = decodeURIComponent(openValue.q) // 获取到二维码原始链接内容
				//如果此次页面打开是从第三方扫码扫进来的，qrcode不为undefined
				const urlParams = getUrlParams(qrcodeUrl);
				this.routeId = urlParams.routeId;
				this.schoolName = urlParams.schoolName;
				this.type = urlParams.type;
				this.searchValue = urlParams.searchValue;
			}
		},

		async getList() {
			let wxUser = getApp().globalData.wxUser
			if (wxUser && wxUser.openid && wxUser.id) {
				let res = await getRecommendPositionListByspecial({
					routeId: this.routeId,
					studentId: wxUser.id,
					schoolName: this.schoolName,
					type: this.type,
					searchValue: this.searchValue,
					pageNum: 1,
					pageSize: 10000
				})
				if (res && res.data && res.data.code == 200) {
					this.tableList = res.data.data || []
					//console.log("table list", this.tableList)
				}
			} else {
				console.error('无法正常初始化小程序登录，故无法渲染页面/RecommendPositionListByspecial')
			}
		}
	}
}
</script>

<style></style>
