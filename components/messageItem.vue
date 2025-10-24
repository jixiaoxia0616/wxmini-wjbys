<template>
	<view class="message-item">
		<view class="left" v-if="isOverdue">待面试</view>
		<view class="right" v-if="current != 0" :style="{color:isRead?'#42b983':'red'}">.</view>
		<view class="body">
			<view class="list-item-header">
				<view class="list-item-header-name">
					<text>{{messageItem.enterpriseName}}</text>
				</view>
				<text
					class="list-item-header-money">{{current == 0 ? ('面试时间:'+(messageItem.interviewTime ||  '').substring(0,16)):('发送时间:'+(messageItem.createTime ||  '').substring(0,16))}}</text>
			</view>
			<view class="list-item-body">
				<text style="margin-right: 20rpx;">{{messageItem.postName}}</text>
				<uni-tag v-if="current != 1" :text="getTag(messageItem).value" :type="getTag(messageItem).type"
					size="mini" :inverted="true"></uni-tag>
			</view>
			<view class="list-item-footer">
				<text
					class="footer-principal">{{current == 0 ? (messageItem.interviewLocation ||  ''):(messageItem.content ||  '')}}</text>
			</view>
		</view>
	</view>

</template>

<script>
	import {
		parseTime
	} from '@/common/util.js'
	const interviewStatus = [{
			value: '0',
			label: '收到邀请',
			type: 'primary'
		},
		{
			value: '1',
			label: '同意',
			type: 'success'
		},
		{
			value: '2',
			label: '拒绝',
			type: 'warning'
		}
	]


	const interviewInvitationStatus = [{
			value: '1',
			label: '收到邀请',
			type: 'primary'
		},
		{
			value: '2',
			label: '接受',
			type: 'success'
		},
		{
			value: '3',
			label: '拒绝',
			type: 'warning'
		},
		{
			value: '4',
			label: '另选时间',
			type: 'warning'
		}
	]
	export default {
		name: "messageItem",
		props: {
			messageItem: Object,
			current: Number
		},
		data() {
			return {
				parseTime
			};
		},
		computed: {
			isOverdue() {
				return this.current == 0 && this.messageItem.interviewInvitation == '1' &&
					new Date(this.messageItem.interviewTime).getTime() > new Date().getTime()
			},
			isRead() {
				return this.messageItem.readed == 1?true:false
			},
		},
		methods: {
			getTag(item) {
				if (this.current == 0) {
					let data = {
						type: interviewInvitationStatus[0].type,
						value: interviewInvitationStatus[0].label
					};
					let inter = interviewInvitationStatus.find(x => x.value == item.interviewInvitation)
					if (inter) {
						data = {
							type: inter.type,
							value: inter.label
						};
					}
					return data
				} else if (this.current == 2) {
					let data = {
						type: interviewStatus[0].type,
						value: interviewStatus[0].label
					};
					let inter = interviewStatus.find(x => x.value == item.receiveOffer)
					if (inter) {
						data = {
							type: inter.type,
							value: inter.label
						};
					}
					return data
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.message-item {
		display: flex;
		align-items: center;
		position: relative;

		.left {
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

		.right {
			position: absolute;
			top: -160rpx;
			right: -10rpx;
			color: red;
			font-size: 160rpx;
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
					color: black;
          font-weight: bold;

					.list-item-header-name-tag {
						color: $uni-color-primary;
						background-color: white;
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

				.footer-principal {
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					display: inline;
					width: 200rpx;
					text-align: left;
				}

				.footer-address {
					margin-left: 30rpx;
					color: #969faf;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					display: inline;
					width: 500rpx;
					text-align: right;
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
