<template>
	<view class="subscribe-view">
		<uni-segmented-control :current="current" :values="items" :activeColor="uniColorPrimary"
			@clickItem="onClickItem" styleType="button">
		</uni-segmented-control>
		<view class="content">
			<view v-if="listData && listData.length">
				<uni-list v-show="current === 0">
					<uni-list-item v-for="(item,index) in listData" :key="index" :title="item.positionName"
						:rightText="(item.salary || '无薪资信息')" :note="item.enterpriseName" clickable
						@click="openDetail(item)">
					</uni-list-item>
				</uni-list>
				<uni-list v-show="current === 1">
					<uni-list-chat v-for="(item,index) in listData" :key="index" :title="item.enterpriseName"
						:avatar="item.enterpriseUrl ? (baseUrl + item.enterpriseUrl) :logo"
						:rightText="'注册资本'+(item.registerCapital || 0)+'万元'" :note="item.enterpriseAddress" clickable
						@click="openDetail(item)">
					</uni-list-chat>
				</uni-list>
			</view>
			<view v-else style="width:100%;height:100%;display: flex;  flex-direction: column;  align-items: center;">
				<image :src="empty" class="empty-warning-image"></image>
				<text class="empty-warning-message">您还未订阅，赶快行动起来吧！</text>
			</view>
		</view>
	</view>
</template>
<script>
	import logo from '@/static/logo.png'
	import {
		getSubscribeList,
		getSubscribeEnterpriseList
	} from '@/apis/api.js'
	import {
		baseUrl
	} from '@/apis/request.js';

	import empty from '@/static/empty.png'
	export default {
		data() {
			return {
				empty,
				logo,
				baseUrl,
				items: ['职位', '企业'],
				current: 0,
				listData: [],
				uniColorPrimary: "#34acc3"
			}
		},
		onShow() {
			this.getList()
		},
		methods: {
			onClickItem(e) {
				if (this.current != e.currentIndex) {
					this.current = e.currentIndex;
					this.getList()
				}
			},
		openDetail(item) {
			if (this.current === 1) {
				// 企业标签页 - 跳转到企业详情页面
				console.log('企业订阅数据item:', item)
				// 尝试多种可能的企业ID字段名
				const enterpriseId = item.enterpriseId || item.id || item.enterprise_id
				console.log('使用的企业ID:', enterpriseId)

				if (!enterpriseId) {
					uni.showToast({
						title: '企业信息不完整',
						icon: 'none'
					})
					return
				}

				uni.navigateTo({
					url: `/pages/enterpriseDataDetail/enterpriseDataDetail?enterpriseId=${enterpriseId}`,
					fail: (err) => {
						console.log('跳转失败:', err)
					}
				})
			} else {
				// 职位标签页 - 跳转到职位详情页面
				let data = {
          enterpriseId: item.enterpriseId,
          enterpriseName: item.enterpriseName,
          positionName: item.positionName,
          workPlace: item.workPlace,
          postId: item.id,
          salary: item.salary,
          recruitmentNum: item.recruitmentNum,
          posterAddress: item.posterAddress,
          academic: item.academic,
          welfare: item.welfare,
          principal: item.principal,
          workDuty: item.workDuty,
          professionalList: item.professionalList,
          internshipExperience: item.internshipExperience,
          qualification: item.qualification,
          subscribePostId: item.subscribePostId || null //岗位订阅
				}
				console.log("subscribe data: ", data)
				let encodedJsonData = encodeURIComponent(JSON.stringify(data))
				uni.navigateTo({
					url: '/pages/detail/detail?detail=' + encodedJsonData + '&current=' + this.current,
					fail: (err) => {
						console.log(err)
					}
				})
			}
		},
			async getList() {
				let res = null
				let wxUser = getApp().globalData.wxUser
				let params = {
					studentId: wxUser.id
				}
				uni.showLoading({
					title: '正在加载...',
					mask: true
				})
				if (this.current === 0) {
					res = await getSubscribeList(params)
				}
				if (this.current === 1) {
					res = await getSubscribeEnterpriseList(params)
				}
				if (res && res.code == 200) {
					this.listData = res.rows
				}
				uni.hideLoading()
			}
		}
	}
</script>

<style scoped lang="scss">
	.subscribe-view {
		padding: 20rpx 10rpx;
	}

	.empty-warning-image {
		width: 200rpx;
		height: 200rpx;
		margin-top: 100rpx;
		color: $uni-color-primary;
	}

	.empty-warning-message {
		margin-top: 50rpx;
		font-size: 26rpx;
		color: $uni-color-primary;
		font-weight: 500;
	}
</style>
