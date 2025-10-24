<template>
	<view class="section-header">
		<view class="section__head">
			<view class="line"></view>
		</view>
		<view class="section__content"><slot></slot></view>
		<view><slot name="right"></slot></view>
	</view>
</template>

<script>
	export default {
		name:"sectionHeader",
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
	.section-header {
		position: relative;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 12px 10px;
		font-weight: 400;

		.section__head {
			flex-direction: row;
			justify-content: center;
			align-items: center;
			margin-right: 10px;

			.line {
				height: 12px;
				background-color: $uni-color-primary;
				border-radius: 10px;
				width: 4px;
			}
		}

		.section__content {
			display: flex;
			flex-direction: column;
			flex: 1;
			color: #333;
		}
	}
</style>
