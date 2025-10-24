<template>
	<view class="subscribe-view">
		<uni-segmented-control :current="current" :values="items" :activeColor="uniColorPrimary"  @clickItem="onClickItem" styleType="button">
		</uni-segmented-control>
		<view class="content">
			<view >
				<uni-list v-if="listData && listData.length">
					<uni-list-item v-for="(item,index) in listData" :key="index"  clickable
						@click="openData(item)">
						<messageItem slot="body" style="width: 100%;height: 100%;" :messageItem="item" :current="current"></messageItem>
					</uni-list-item>
				</uni-list>
				<view v-else style="width:100%;height:100%;display: flex;  flex-direction: column;  align-items: center;">
					<image  :src="empty" class="empty-warning-image"></image>
					<text class="empty-warning-message">您的消息正在路上加急赶来！</text>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		getInterviewList,
		getInfoList,
		getOfferList
	} from '@/apis/api.js'
	import messageItem from '@/components/messageItem.vue'
	import empty from '@/static/empty.png'
	export default {
		components:{messageItem},
		data() {
			return {
				empty,
				items: ['面试消息', '企业消息','offer邀请'],
				current: 0,
				listData: [],
				uniColorPrimary: "#34acc3"
			}
		},
		onLoad(option){
			if(option && option.type){
				// interview/comment/offer
				if(option.type == 'interview'){
					this.current = 0
					
				} else if(option.type == 'comment'){
					this.current = 1
				} else if (option.type == 'offer'){
					this.current = 2
				}
			}
			wx.showShareMenu({
				withShareTicket: true,
				menus: ["shareAppMessage", "shareTimeline"]
			})
		},
		onShow() {
			if (getApp().globalData && getApp().globalData.wxUser && getApp().globalData.wxUser.openid) {
				this.getLsit()
			} else {
				getApp().watch(this.getLsit, 'wxUser')
			}
			
			
		},
		methods: {
			onClickItem(e) {
				if (this.current != e.currentIndex) {
					this.current = e.currentIndex;
					this.getLsit()
				}
			},
			openData(item){
				let data = {}
				if(this.current === 0){
					data = {...item}
				}else if(this.current === 1) {
					data = {...item}
				} else {
					data = {...item}
				}
				let str = JSON.stringify(data)
				uni.navigateTo({url: '/pages/ucenter/message/interview?detail=' + str +'&current='+this.current,
				fail: (err) => {
					console.log(err)
				}})
			},
			async getLsit() {
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
					res = await getInterviewList(params)
				}else if (this.current === 1) {
					res = await getInfoList(params)
				}else if (this.current === 2) {
					res = await getOfferList(params)
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
</style>

<style  lang="scss">
	.subscribe-view {
		.uni-list-item__container{
			padding-left: 15rpx;
		}
	}
	.empty-warning-image {
		width: 200rpx;
		height:200rpx;
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
