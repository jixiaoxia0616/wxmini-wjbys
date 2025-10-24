<template>
	<view class="subscribe-view">
		<view class="content">
			<uni-list v-if="listData && listData.length">
				<uni-list-item v-for="(item,index) in listData" :key="index" clickable @click="openData(item)">
					<messageItem slot="body" style="width: 100%;height: 100%;" :messageItem="item" :current="0"></messageItem>
				</uni-list-item>
			</uni-list>
			<view v-else style="width:100%;height:100%;display: flex;  flex-direction: column;  align-items: center;">
				<image  :src="empty" style="width: 200rpx;height:200rpx;margin-top: 100rpx;"></image>
				<text style="margin-top: 50rpx; font-size: 26rpx;color: #2F85FC;font-weight: 500;">很遗憾，还没有面试信息哦！</text>
			</view>
			<uni-popup ref="popup" type="bottom" background-color="#fff" style="width: 700rpx;">
				<text class="dialog-title">您的{{getTypeName(detail.type)}}邀请</text>
				<calendarDetail :detail="detail"></calendarDetail>
				<uni-icons class="dialog-close" type="close" size="30" color="red" @click="close"></uni-icons>
			</uni-popup>
		</view>
	</view>
</template>
<script>
	import {
		getInterviewList
	} from '@/apis/api.js'
	import calendarDetail from '@/components/calendarDetail.vue'
	import messageItem from '@/components/messageItem.vue'
	import empty from '@/static/empty.png'
	export default {
		components: {
			calendarDetail,
			
			messageItem
		},
		data() {
			return {
				empty,
				detail: {},
				listData: [],
			}
		},
		onShow() {
			this.getLsit()
		},
		methods: {
			onClickItem(e) {
				if (this.current != e.currentIndex) {
					this.current = e.currentIndex;
					this.getLsit()
				}
			},
			openData(item) {
				let data = {
					...item
				}
				this.detail = data
				this.$refs.popup.open()
				// let str = JSON.stringify(data)
				// uni.navigateTo({
				// 	url: '/pages/calendar/calendarDetail/calendarDetail?detail=' + str,
				// 	fail: (err) => {
				// 		console.log(err)
				// 	}
				// })
			},
			getTypeName(type) {
				if (type == '2') {
					return '笔试'
				} else if (type == '3') {
					return '面试'
				} else if (type == '4') {
					return 'offer'
				}
			},
			close() {
				// TODO 做一些其他的事情，before-close 为true的情况下，手动执行 close 才会关闭对话框
				// ...
				this.$refs.popup.close()
			},
			async getLsit() {
				let wxUser = getApp().globalData.wxUser
				let params = {
					studentId: wxUser.id
				}
				uni.showLoading({
					title: '正在加载...',
					mask: true
				})
				let res = await getInterviewList(params)
				if (res && res.code == 200 && res.rows && res.rows.length) {
					let list = res.rows.filter(x => (x.interviewInvitation == '1' || x.interviewInvitation == '2') && new Date(x.interviewTime)
					.getTime() > new Date().getTime())
					this.listData = list || []
				}
				uni.hideLoading()
			}
		}
	}
</script>

<style scoped lang="scss">
	
	.subscribe-view {
		padding: 20rpx 10rpx;

		.dialog-title {
			font-size: 40rpx;
			font-weight: 550;
			width: 100%;
			display: inline-block;
			text-align: center;
			margin: 20rpx 0;
			color: $uni-color-primary;
		}

		.dialog-close {
			position: absolute;
			right: -0rpx;
			top: -80rpx;
		}
	}
</style>

<style lang="scss">
	.subscribe-view {
		.uni-popup-dialog {
			.uni-dialog-button-group {
				diaplay: none !important;

			}
		}
	}
</style>
