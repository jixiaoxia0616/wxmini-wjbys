<template>
	<view class="message-item">
    <div>
      <view class="banner-overdue" v-if="isOverdue">已过期</view>
      <view class="banner-today" v-else-if="isToday">今天举行</view>
      <view class="banner-today" v-else-if="isHolding">正在举行</view>
      <view class="banner" v-else>未举行</view>
    </div>

		<view class="body">
			<view class="list-item-header">
				<view class="list-item-header-name">
					<text>{{ recruitmentItem.recruitmentNames }}</text>
				</view>
				<text class="list-item-header-money">{{ recruitmentItem.timeTbd ? '时间待定' : (recruitmentItem.startTime || '').substring(0, 16) }}</text>
			</view>
			<view class="list-item-body">
				<text style="margin-right: 20rpx;">{{ recruitmentItem.schoolName }}</text>
			</view>
			<view class="list-item-footer">
        <div v-if="isOnlineConference(recruitmentItem)" class="web-conference">
          <uni-icons
              type="videocam"
              size="24"
              color="#247888FF">
          </uni-icons>
          <text class="web-conference"> 网络招聘</text>
        </div>
				<text  v-else class="footer-address">{{ type == 0 ? (recruitmentItem.location || '') : (recruitmentItem.schoolName || '') }}</text>
			</view>
		</view>
	</view>

</template>

<script>
	import {
		parseTime
	} from '@/common/util.js'
  import {duringTheHoldingTime, isOverdue, isToday} from "../utils/util";

	export default {
		name: "recruitmentItem",
		props: {
			recruitmentItem: Object,
      //type 0:人才中心宣讲会 1:企业自创宣讲会
			type: Number
		},
		data() {
			return {
				parseTime
			};
		},
		computed: {
			isOverdue() {
        //如果startTime为空，说明举办时间待定，不算过期
        if (!this.recruitmentItem.startTime) {
          return false
        }
				return isOverdue(this.recruitmentItem.endTime)
			},
      isToday() {
        return isToday(this.recruitmentItem.startTime)
      },
      isHolding() {
        return duringTheHoldingTime(this.recruitmentItem.startTime, this.recruitmentItem.endTime)
      },
      isPreparing() {
        return this.recruitmentItem.timeTbd
      }
		},
		methods: {
      //检测是不是网络招聘会
      isOnlineConference(recruitmentItem) {
        return recruitmentItem.location && recruitmentItem.location.includes('网络');
      }
		}
	}
</script>

<style lang="scss" scoped>
	.message-item {
		display: flex;
		align-items: center;
		position: relative;

		.banner {
			position: absolute;
			bottom: 0rpx;
			right: -130rpx;
			width: 300rpx;
			height: 50rpx;
			line-height: 50rpx;
			text-align: center;
			color: #fff;
			font-size: 24rpx;
			-webkit-transform: rotate(-50deg);
			transform: rotate(-50deg);
			background-color: $uni-color-success;
		}

    .banner-today {
      position: absolute;
      bottom: 0rpx;
      right: -130rpx;
      width: 300rpx;
      height: 50rpx;
      line-height: 50rpx;
      text-align: center;
      color: #fff;
      font-size: 24rpx;
      -webkit-transform: rotate(-50deg);
      transform: rotate(-50deg);
      background-color: $uni-color-primary;
    }


    .banner-overdue {
      position: absolute;
      bottom: 0rpx;
      right: -130rpx;
      width: 300rpx;
      height: 50rpx;
      line-height: 50rpx;
      text-align: center;
      color: #fff;
      font-size: 24rpx;
      -webkit-transform: rotate(-50deg);
      transform: rotate(-50deg);
      background-color: #808080;
    }


		.body {
			.list-item-header {
				width: 680rpx;
				padding: 10rpx 20rpx 10rpx 0rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.list-item-header-name {
					font-size: 32rpx;
					color: #000;
          font-weight: bold;

					.list-item-header-name-tag {
						color: $uni-color-primary;
						background-color: #fff;
						border: 1px solid $uni-color-primary;
						padding: 2rpx 8rpx;
						height: 32rpx;
						line-height: 32rpx;
						border-radius: 8rpx;
						font-size: 22rpx;
					}
				}

				.list-item-header-money {
					font-size: 26rpx;
					color: $uni-color-primary;
				}
			}

			.list-item-body {
				font-size: 26rpx;
				width: 680rpx;
				padding: 10rpx 20rpx 10rpx 0rpx;
				display: flex;
				align-items: center;

				.list-item-body-tag {
					margin-right: 10rpx;
					background-color: #f4f4f5;
					padding: 2rpx 8rpx;
					height: 32rpx;
					line-height: 32rpx;
					border-radius: 8rpx;
					font-size: 22rpx;
				}
			}

			.list-item-footer {
				width: 660rpx;
				padding: 10rpx 20rpx 10rpx 0rpx;
				font-size: 24rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.footer-address {
					color: #969faf;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					display: inline;
					width: 500rpx;
					text-align: left;
				}

        .web-conference {
          float: left;
          color: #247888FF;
          font-weight: bold;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: inline;
          width: 500rpx;
          text-align: left;
        }
			}
		}
	}
</style>

<style lang="scss">
	.message-item {
		.uni-list-item__container {
			padding-left: 5rpx;
		}
	}
</style>
