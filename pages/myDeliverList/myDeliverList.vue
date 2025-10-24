<template>
	<view class="main">
		<view class="main-context">
      <view class="" v-for="(item,index) in tableList" :key="index">
        <job :itemData="item" @refresh-list="refreshList"></job>
      </view>
			<uni-load-more  :status="more" :contentText="contextText" @clickLoadMore="clickLoadMore"></uni-load-more>
		</view>
	</view>
</template>

<script>
	import {
		getMySelfDeliverList
	} from '@/apis/api.js'
  import job from '@/components/job.vue'
	export default {
		components:{job},
		data() {
			return {
				more:'more',
				pageNum:1,
				contextText:{contentdown: "点击显示更多",contentrefresh: "正在加载...",contentnomore: "没有更多数据了"},
				tableList: []
			}
		},
		onLoad: function() {

		},
		onShow: function() { //option为object类型，会序列化上个页面传递的参数
			this.getWxUser()
		},
		onReachBottom(e){
			console.log('页面到底',e)
		},
		onPageScroll(e){
			console.log('页面滚动',e)
		},
		methods: {
			getWxUser() {
				this.tableList = []
				this.pageNum = 1
				this.searchClick(this.pageNum)
			},
			refreshList() {
				// 刷新列表数据
				this.tableList = []
				this.pageNum = 1
				this.searchClick(this.pageNum)
			},
			clickLoadMore(e){
				if(e.detail.status == 'no-more'){
					return
				}
				this.pageNum +=1
				this.searchClick(this.pageNum)
				console.log('clickLoadMore',e,this.pageNum)
			},
			async searchClick(pageNum) {
				this.more = 'loading'
				if(!this.tableList){
					this.tableList = []
				}
				let total = this.tableList.length || 0
				let wxUser = getApp().globalData.wxUser
				if (wxUser && wxUser.openid && wxUser.id) {
					let res = await getMySelfDeliverList({
						openid:wxUser.openid,
						studentId:wxUser.id,
						pageNum:pageNum,
						pageSize:10

					})

					if (res && res.data && res.data.code == 200) {
            console.log('myself delivery list', res.data.rows)
						this.tableList = this.tableList.concat(res.data.rows || [])
						total = res.data.total || []
					}
				}
				if(this.tableList && this.tableList.length >= total){
					this.more = 'no-more'
				}else{
					this.more = 'more'
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.main {
		height: 100vh;
		width: 100%;
		overflow: hidden;
		background-color: #fff;
		.main-context {
			width: 100%;
			height: calc(100vh - 20rpx);
			overflow-y: auto;
		}
	}
</style>
