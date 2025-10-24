<template>
	<view>
		<view v-if="enterpriseData">
			<view class="enterprise-main">
				<view>
					<view class="enterprise-main-header">
						<view class="left">
							<text class="left-name">{{enterpriseData.enterpriseName}}</text>
							<text style="font-size: 24rpx;">{{(enterpriseData.scope || '-') + '·'
							+(enterpriseData.property || '-') + '·'
							+ (enterpriseData.registerCapital|| '-')}}</text>
						</view>
						<view class="right">
							<image :src="baseUrl+enterpriseData.enterpriseUrl"
								style="width:120rpx;height:120rpx;border-radius: 12rpx;"></image>
						</view>
					</view>
				</view>
				<view class="enterprise-main-card" v-if="enterpriseData.enterpriseTag && enterpriseData.enterpriseTag.length>0">
					<view class="card-tag" v-for="(item,index) in enterpriseData.enterpriseTag" :key="index">
						{{item}}
					</view>
				</view>
				<view class="enterprise-main-data" v-if="enterpriseData.website">
					<text class="title">企业网址</text>
					<view>{{enterpriseData.website || '-'}}</view>
				</view>
				<view class="enterprise-main-data" v-if="enterpriseData.phone">
					<text class="title">联系电话</text>
					<view>{{enterpriseData.phone || '-'}}</view>
				</view>
				<view class="enterprise-main-data" v-if="enterpriseData.enterpriseAddress">
					<text class="title">企业地址</text>
          <view class="uni-list-cell-left">{{enterpriseData.enterpriseAddress}}</view>
				</view>
				<view class="enterprise-main-data" v-if="info && info.length">
					<text class="title">企业风采</text>
					<uni-swiper-dot :info="info" :current="current" field="content" mode="round">
						<swiper class="swiper-box" @change="change">
							<swiper-item v-for="(item ,index) in info" :key="index">
								<view class="swiper-item">
									<image :src="item.content" style="width:700rpx;height:480rpx;border-radius: 12rpx;">
									</image>
								</view>
							</swiper-item>
						</swiper>
					</uni-swiper-dot>
				</view>
				<view class="enterprise-main-data" v-if="enterpriseData.introduce">
					<text class="title">企业介绍</text>
					<rich-text :nodes="enterpriseData.introduce"></rich-text>
				</view>
				<view class="enterprise-main-data"  v-if="enterpriseData.enterprisePromo && enterpriseData.enterprisePromo.length>0">
					<text class="title">企业宣传</text>
					<view v-for="(item,index) in enterpriseData.enterprisePromo" v-key="index">
						<video id="myVideo" style="width:700rpx;margin-bottom: 30rpx;" :src="item.promoUrl"
							:controls="true"></video>
					</view>
				</view>
			</view>
		</view>
		<view v-if="!(enterpriseData && enterpriseData.id ) && !loading"
			style="width:100%;height:100%;display: flex;  flex-direction: column;  align-items: center;">
			<image :src="empty" style="width: 200rpx;height:200rpx;margin-top: 100rpx;"></image>
			<text class="no-enterprise-data">企业信息找不到了！</text>
		</view>
	</view>

</template>

<script>
	import {
		getEnterpriseInfoByid
	} from '@/apis/api.js'
	import {
		baseUrl
	} from '@/apis/request.js'
	import empty from '@/static/empty.png'
	export default {
    components: {},
    data() {
			return {
				baseUrl,
				empty,
				loading: false,
				enterpriseId: null,
				enterpriseData: null,
				info: [],
				current: 0,
			}
		},
		onLoad(options) {
			this.loading = false
			if (options && options.enterpriseId) {
				this.enterpriseId = options.enterpriseId
				this.getExpress()
			}
		},
		methods: {
			change(e) {
				this.current = e.detail.current;
			},
			async getExpress() {
				uni.showLoading({
					title: '正在加载...',
					mask: true
				})
				this.loading = true
				let data = await getEnterpriseInfoByid(this.enterpriseId)
				uni.hideLoading()
				this.loading = false
				this.enterpriseData = data
				if (this.enterpriseData) {
					if (this.enterpriseData.enterpriseStyle) {
						this.info = this.enterpriseData.enterpriseStyle.map(x => {
							let content = ''
							if (x.url.indexOf('http')) {
								content = x.url
							} else {
								content = baseUrl + x.url
							}
							return {
								content: x.url
							}

						})
					}
					//通过手动修改img元素使得企业介绍的图片在手机端自适应
          //添加style="max-width:100%;height:auto;display:block;margin:10px 0;"
					this.enterpriseData.introduce = this.enterpriseData.introduce ? this.enterpriseData.introduce
						.replace(/<img/g, '<img style="max-width:100%;height:auto;display:block;margin:10px 0;"') : ''
				}

			}
		}
	}
</script>

<style scoped lang="scss">
	.enterprise-main {
		width: 750rpx;
		height: 100vh;
		overflow: auto;
		overflow-x: hidden;
		opacity: 0.95;

		.enterprise-main-header {
			padding: 20rpx;
			display: flex;

			.left {
				color: #000;
				width: 600rpx;

				.left-name {
					font-size: 45rpx;
					font-weight: 500;
					display: block;
					overflow: hidden;
					width: 100%;
					text-overflow: ellipsis;
					margin-bottom: 20rpx;
				}
			}

			.right {
				width: 120rpx;
				height: 120rpx;
			}
		}

		.enterprise-main-card {
			width: 720rpx;
			// height: 90rpx;
			margin: 0rpx 15rpx;
			white-space: nowrap;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			flex-wrap: wrap;

			.card-tag {
				// display:block;
				height: 50rpx;
				line-height: 50rpx;
				// width: 137rpx;
				max-width: 317rpx;
				overflow: hidden;
				padding: 10rpx;
				border: 1px solid #808080;
				border-radius: 10rpx;
				color: $uni-color-primary;
				text-align: center;
				margin-right: 20rpx;
				margin-bottom: 20rpx;
				text-overflow: ellipsis;
			}
		}

		.enterprise-main-data {
      display: block;
			margin: 50rpx 30rpx 15rpx 30rpx;
			color: #000;

			.title {
				font-size: 30rpx;
				font-weight: bold;
        color: $uni-color-primary;
				display: block;
				overflow: hidden;
				width: 100%;
				margin-bottom: 20rpx;
			}

			.name {
				font-size: 24rpx;
			}

			.swiper-box {
				height: 500rpx;
			}
		}
	}

  .no-enterprise-data {
    margin-top: 50rpx;
    font-size: 26rpx;
    color: $uni-color-primary;
    font-weight: 500;
  }
  </style>
