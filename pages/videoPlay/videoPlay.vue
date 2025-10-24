<template>
	<view class="video-section">
				<h1 class="video-title">{{title}}</h1>
				<video style="width: 100%; height: 384rpx;"
	             :src="videoUrl"  
				 controls objectFit="cover">
	             </video>
			</view>
</template>

<script>
	import {
		baseUrl
	} from '@/apis/request.js';
	export default {
		components: {},
		data() {
			return {
				title: 'xxxxxxx',
				videoUrl: 'https://xcx.wjhr.net/invertImg/xcx/wjhr/xiaoyuan/xuanchuan.mp4'
			};
		},
		methods: {},
		onLoad(options) {
			this.title = options.title;
			this.videoUrl = options.videoUrl;
		}
	}
</script>

<style lang="scss">
.video-section {
		position: relative;
		margin: 20rpx 0;
		padding-bottom: 30rpx;

		.video-title {
			text-align: left;
			font-size: 40rpx;
			font-weight: 600;
			margin: 20rpx 0;
			letter-spacing: 2rpx;
			background: linear-gradient(to right, #4a90e2, #2c5282);
			-webkit-background-clip: text;
			color: transparent;
			padding: 10rpx 0;
			margin-left: 8rpx;
		}
	}
</style>
