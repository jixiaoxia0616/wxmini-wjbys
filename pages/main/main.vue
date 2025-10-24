<template>
	<view class="main">
		<view class="main-title">
			<div v-if="!triggerSearch" class="title-favourite">
				<scroll-view class="title-favourite-jobs" scroll-x="true">
					<text v-for="(job,index) in expectedJobs" :key="index" class="job-item"
						:class="currentJob == job ? 'check-job':''" @click="setCurrentJob(job)">
						{{job}}
					</text>
				</scroll-view>
				<view>
					<uni-icons type="plusempty" size="30" color="white" @click="clickJobs" style="margin-right:10px"
						class="title-search-icon">
					</uni-icons>
					<uni-icons type="search" size="30" color="white" @click="clickSearchIcon" class="title-search-icon">
					</uni-icons>
				</view>
			</div>

			<uni-search-bar v-if="triggerSearch" style="flex:1;" v-model="searchValue" :radius="100"
				placeholder="搜索职位 公司" cancelButton="always" clearButton="always" @confirm="getJobs" @clear="clearSearch"
				@cancel="cancelSearch">
			</uni-search-bar>
		</view>

		<view class="main-context">
			<view class="job-item-wrapper" v-for="(item,index) in tableList" :key="index">
				<job :itemData="item"></job>
			</view>
			<uni-load-more :status="more" :contentText="contextText" @clickLoadMore="clickLoadMore"></uni-load-more>
		</view>
		<uni-popup ref="popup" type="top" background-color="#fff">
			<view style="height:40vh;padding:20px;" class="tag-popup">
				<view v-for="(job,index) in expectedJobs" :key="index" class="tag-item">
					<text>{{job}}</text>
					<uni-icons type="closeempty" size="14" @click="removeJob(index)" color="#fff"
						style="margin-left:10px"></uni-icons>
				</view>
				<view class="tag-item" @click="inputClick" v-if="!showInput">
					<uni-icons type="plusempty" size="14" color="#fff" style="margin-left:30px"></uni-icons>
				</view>
				<view class="tag-item-input" v-else>
					<uni-easyinput v-model="valueJob" focus :maxlength="4" confirmType="保存" placeholder="请输入"
						@confirm="addJob"></uni-easyinput>
				</view>

			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		getEnterprisePostList,
		saveStudent
	} from '@/apis/api.js'
	import {
		login
	} from '@/utils/util.js'
	import {
		overShare
	} from "../../common/util";
	import job from '@/components/job.vue';
	export default {
		components: {
			job
		},
		data() {
			return {
				searchValue: '',
				expectedJobs: [],
				currentJob: '',
				triggerSearch: false,
				more: 'more',
				pageNum: 1,
				valueJob: '',
				showInput: false,
				contextText: {
					contentdown: "点击显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				},
				tableList: []
			}
		},
		onLoad: function() {
			getApp().globalData.educationId = null
			// 允许未登录用户浏览职位信息
			this.getJobs()
			// 监听登录状态变化，用于更新个性化内容
			if (getApp().globalData && getApp().globalData.wxUser && getApp().globalData.wxUser.openid) {
				// 已登录用户可以获取个性化内容
			} else {
				getApp().watch(this.getJobs, 'wxUser')
			}
			overShare();
			// Listen for expected jobs updates
			uni.$on('expectedJobsUpdated', () => {
				this.pageNum = 1
				this.tableList = []
				this.getJobs()
			})
		},
		onUnload: function() {
			// Clean up event listener
			uni.$off('expectedJobsUpdated')
		},
		onShow: function() { //option为object类型，会序列化上个页面传递的参数
			let educationId = getApp().globalData.educationId
			if (educationId && this.tableList && this.tableList.length) {
				let index = this.tableList.findIndex(x => x.id == educationId)
				if (index > -1) {
					this.tableList[index].submitStatus = '1'
				}
			}
			getApp().globalData.enterpriseId = null
		},
		onReachBottom: function(e) {
			console.log('页面到底')
			this.clickLoadMore(e)
		},

		methods: {
			clickJobs() {
				// this.$refs.popup.open()
				uni.navigateTo({
					url: '/pages/expectJob/expectJob'
				})
			},

			close() {
				this.$refs.popup.close()
			},
			inputClick() {
				this.showInput = true
			},
			removeJob(index) {
				this.expectedJobs.splice(index)
				this.jobSave()
			},
			addJob() {
				this.$nextTick(() => {
					if (!this.valueJob) {
						return
					}
					this.expectedJobs.push(this.valueJob)
					this.jobSave()
				})

			},
			async jobSave() {
				let data = {}
				data = getApp().globalData.wxUser
				data.expectedJobs = JSON.stringify(this.expectedJobs || [])
				let res = await saveStudent(data)
				this.showInput = false
				this.valueJob = ''
				if (res && res.data && res.data.code == 200) {
					login()
				}
			},
			getJobs() {
				if (getApp().globalData.wxUser) {
					let expectedJobsStr = getApp().globalData.wxUser.expectedJobs
					if (expectedJobsStr) {
						let expectedJobs = JSON.parse(expectedJobsStr)
						this.expectedJobs = expectedJobs
					}
				}
				this.tableList = []
				this.pageNum = 1
				this.searchContent(this.pageNum, this.searchValue)
			},
			setCurrentJob(job) {
				this.currentJob = job || ''
				this.searchValue = this.currentJob
				this.getJobs()
			},
			clickSearchIcon() {
				this.triggerSearch = true;
				this.currentJob = ''
			},

			clickLoadMore(e) {
				if (e && e.detail && e.detail.status == 'no-more') {
					return
				}
				this.pageNum += 1
				this.searchContent(this.pageNum, this.searchValue)
				console.log('clickLoadMore', e, this.pageNum)
			},

			clearSearch() {
				this.searchValue = '';
				this.getJobs()
			},

			cancelSearch() {
				this.triggerSearch = false;
				this.searchValue = '';
				this.getJobs()
			},

			async searchContent(pageNum, content) {
				this.more = 'loading'
				if (!this.tableList) {
					this.tableList = []
				}
				let total = this.tableList.length || 0
				let wxUser = getApp().globalData.wxUser
				console.log("search value", content)

				// 构建请求参数，允许未登录用户浏览
				let params = {
					searchName: content,
					pageNum: pageNum,
					pageSize: 10
				}
				
				// 如果用户已登录，添加个人信息以获取个性化内容
				if (wxUser && wxUser.openid && wxUser.id) {
					params.openid = wxUser.openid
					params.studentId = wxUser.id
				}

				let res = await getEnterprisePostList(params)
				if (res && res.data && res.data.code == 200) {
					this.tableList = this.tableList.concat(res.data.rows || [])
					total = res.data.total || []
				} else if (res && res.data && res.data.code == 500) {
					console.error("获取首页岗位出错", res.data.msg)
				}
				
				if (this.tableList && this.tableList.length >= total) {
					this.more = 'no-more'
				} else {
					this.more = 'more'
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.main {
		width: 100%;
		overflow: scroll;
		display: inline-block;
		background-color: $uni-bg-color;
		.tag-popup {
			display: grid;
			grid-template-rows: repeat(auto-fill, 44px);
			grid-template-columns: repeat(3, 220rpx);

			.tag-item {
				line-height: 14px;
				font-size: 12px;
				font-weight: 200;
				padding: 4px 30rpx;
				color: #fff;
				border-radius: 14px;
				background-color: $uni-color-primary;
				border-color: $uni-color-primary;
				margin: 10px 4px;
				width: 140rpx;
				display: flex;
				text-align: center;
				justify-content: space-between;
			}

			.tag-item-input {
				line-height: 14px;
				font-size: 12px;
				font-weight: 200;
				color: #fff;
				border-radius: 14px;
				margin: 10px 4px;
				display: flex;
				text-align: center;
				justify-content: space-between;
			}

			:deep(.uni-easyinput__content-input) {
				height: 25px;
				line-height: 25px;
				width: 80rpx;
			}
		}

		.main-title {
			width: 690rpx;
			padding: 10rpx 30rpx;
			top: 0;
			position: fixed;
			z-index: 100;
			background-color: $uni-color-primary;
			height: 110rpx;
			line-height: 110rpx;
			display: flex;
			align-items: center;

			.title-favourite {
				display: flex;
				flex-direction: row;
				align-items: center;
				width: 100%;

				.title-favourite-jobs {
					display: flex;
					/* flex-wrap: wrap; */
					width: calc(100% - 40px);
					height: 60px;
					white-space: nowrap;
					overflow-x: auto;
					overflow-y: hidden;
					margin-right: 20px;

					text {
						margin-right: 20px;
						color: white;
						font-weight: 500;
						//align-content: space-around;
						font-size: 15px;
					}

					.check-job {
						font-weight: 600;
						font-size: 20px;
					}
				}
			}

			.title-search-icon {
				width: 10%;
			}

			.main-title-right {
				color: $uni-text-color-grey;
			}
		}

		.main-context {
			width: 96%;
			position: relative;
			top: 145rpx;
			margin: auto;
            min-height: calc(100vh - 130rpx);
			overflow-y: auto;
		}
		
		.job-item-wrapper {
			background: white;
			border-radius: 10rpx;
			margin-bottom: 20rpx;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
			overflow: hidden;
		}
	}
</style>
<style>
	.uni-searchbar__cancel {
		color: #fff !important;
		font-size: 14px;
		font-weight: 600;
	}
</style>
