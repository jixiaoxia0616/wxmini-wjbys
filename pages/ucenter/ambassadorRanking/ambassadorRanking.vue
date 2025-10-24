<template>
	<view class="mbassador-ranking-class">
		<uni-list>
			<uni-list-item v-for="(item,index) in list" :key="index" :rightText="'积分值:'+item.integralValue||0"
				:thumb="item.avatarUrl" thumb-size="lg">
				<template v-slot:body>
					<view style="flex: 1;">
						<view class="class-nick-rank">
							<text>{{'第'+item.rankName+'名'}}</text>
							<uni-icons v-if="openid == item.openid" type="star-filled" color="#e7c000" size="30"></uni-icons>
						</view>
						<text class="class-nick-name">{{item.nickName+'('+item.name+')'}}</text>
					</view>
				</template>
			</uni-list-item>
		</uni-list>

	</view>
</template>

<script>
	import {
		getAmbassadorRanking
	} from '@/apis/api.js'
	export default {
		data() {
			return {
				openid:null,
				list: []
			}
		},
		onLoad: function() {
			this.getData()
		},
		methods: {
			async getData() {
				uni.showLoading({
					title: '正在加载...',
					mask: true
				})
				let userInfo = getApp().globalData.wxUser
				if (userInfo.openid && userInfo.campusAmbassador && userInfo.campusAmbassador.id &&
					userInfo.campusAmbassador.enterpriseId) {
						this.openid = userInfo.openid
					let list = await getAmbassadorRanking({
						pageNum: 1,
						pageSize: 10,
						enterpriseId: userInfo.campusAmbassador.enterpriseId
					})
					this.list = list
				}

				uni.hideLoading()
			}
		}
	}
</script>

<style lang="scss">
	.mbassador-ranking-class {
		padding: 0 20rpx;
		.class-nick-rank{
			display: flex;
			align-items: center;
		}
		.class-nick-name {
			font-size: 24rpx;
		}
	}
</style>
