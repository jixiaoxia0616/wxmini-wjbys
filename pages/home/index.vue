<template>
	<div class="homes">
		<uni-swiper-dot class="uni-swiper-dot-box" :info="bannerInfo" mode="round" :current="current"
			:dots-styles="dotsStyles" field="content">
			<swiper class="swiper-box" @change="changeswiper">
				<swiper-item v-for="(item, index) in bannerImages" :key="index">
					<image :src="baseUrl + item.bannerUrl" style="width:100%;height:400rpx;"></image>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>
		<view class="circleArr">
			<view v-for="(item,index) in circleArr" :key="index" class="blockItem" @click="goList(item.key)"
				:style="{ background:`linear-gradient(to bottom, ${ item.backgroundColor }, ${ item.backgroundColor1 })` }">
				<image :src="item.svg" mode=""></image>
				<view class="blocklabel">
					{{ item.label }}
				</view>
			</view>
		</view>
		<view class="blockArr">
			<view class="blockMiniItem" v-for="(item,index) in blockArr" :key="index" @click="goToMiniProgram(item)"
				:style="{ background:`linear-gradient(to right, ${ item.backgroundColor }, ${ item.backgroundColor1 })` }">

				<image :src="item.svg" mode=""></image>
				<view class="miniblocklabel">
					{{ item.label }}
				</view>
			</view>
		</view>
		<view class="video-section">
			<h1 class="video-title">风华南苏州</h1>
			<!-- <video style="width: 100%; height: 34vw;"
             :src="baseUrl + bannerVideos[0].bannerUrl"  controls objectFit="cover"
             :poster="baseUrl + bannerImages[0].bannerUrl"
			>
            </video> -->

			<view @click="toPlayVideo('风华南苏州', baseUrl + bannerVideos[0].bannerUrl)" class="videoCoverBox">
			       <image class="videoCoverImg" :src="videoCover" mode="aspectFill"></image>
			       <view class="imgCoverView">
			            <image class="icon-video" :src="videoCoverIcon" mode="aspectFill"></image>
						<text class="video-text">风华南苏州</text>
			       </view>
			</view>
		</view>
		<view class="titleWrap">
			<view class="titleText">
				招聘会活动日程
			</view>
			<view class="more" @click="goList(0)">
				更多<uni-icons type="right" size="16"></uni-icons>
			</view>
		</view>
		<view class="jobFair">
			<view class="jobFairItem" v-for="(item,index) in jobFair" :key="index" @click="openData(item)">
				<view class="jobFairItemTop">
					<image :src="item.photoUrl?  baseUrl+item.photoUrl : baseUrl+bannerImages[0].bannerUrl"></image>
					<view class="">
						<view class="recruitmentNames">
							{{ item.recruitmentNames }}
						</view>
						<text class="textTag"
							:class="isOnlineConference(item) ? 'online' : 'outline'">{{ isOnlineConference(item) ? '线上招聘会' : '线下招聘会' }}</text>
					</view>
				</view>
				<view class="jobFairItemBottom">
					<view class="time-location-info">
						<view class="info-row">
							<uni-icons type="calendar-filled" size="16"></uni-icons>{{ item.timeTbd? '时间待定' : (item.startTime || '').substring(0, 16) }}
						</view>
						<view class="info-row">
							<uni-icons type="location-filled" size="16"></uni-icons>{{ item.location? item.location : '地址待定' }}
						</view>
					</view>
					<view class="">
						<view class="banner-overdue" v-if="isOverdue(item)">已过期</view>
						<view class="banner-today" v-else-if="isToday(item)">今天举行</view>
						<view class="banner-today" v-else-if="isHolding(item)">正在举行</view>
						<view class="banner" v-else>未举行</view>
					</view>
				</view>

			</view>
		</view>
		<view class="titleWrap">
			<view class="titleText">
				职位推荐
			</view>
			<view class="more" @click="goList(1)">
				更多<uni-icons type="right" size="16"></uni-icons>
			</view>
		</view>
		<view class="jobs">
			<view class="jobsItem" v-for="(item,index) in tableList" :key="index">
				<job :itemData="item"></job>
			</view>
		</view>
	</div>
</template>

<script>
	import job from '../../components/job.vue';
	import {
		getEnterprisePostList
	} from '@/apis/api.js'
	import {
		baseUrl
	} from '@/apis/request.js';
	import {
		getBannerList
	} from "@/apis/api";
	import {
		getAllRecruitmentConferenceList
	} from "../../apis/api";
	import {duringTheHoldingTime, isOverdue, isToday} from "../../utils/util";
	export default {
		components: {
			job
		},
		data() {
			return {
				videoCover: 'https://xcx.wjhr.net/invertImg/xcx/wjhr/xiaoyuan/fenghua.gif',
				videoCoverIcon: 'https://xcx.wjhr.net/invertImg/xcx/wjhr/xiaoyuan/icon-videoplay.png',
				tableList: [],
				jobFair: [],
				dotsStyles: {
					backgroundColor: 'rgba(83, 200, 249,0.3)',
					border: '1px rgba(83, 200, 249,0.3) solid',
					color: '#808080',
					selectedBackgroundColor: 'rgba(83, 200, 249,0.9)',
					selectedBorder: '1px rgba(83, 200, 249,0.9) solid'
				},
				baseUrl: baseUrl,
				current: 0,
				bannerImages: [],
				bannerInfo: [{
					bannerUrl: ''
				}],
				bannerVideos: [{
					bannerUrl: ''
				}],

				circleArr: [{
						label: '招聘会',
						svg: require('../../static/1.svg'),
						backgroundColor: 'rgb(255,171,21)',
						backgroundColor1: 'rgb(254,126,13)',
						key:0,
						developing: false
					},
					{
						label: '找工作',
						svg: require('../../static/2.svg'),
						backgroundColor: 'rgb(24,235,194)',
						backgroundColor1: 'rgb(4,220,121)',
						key:1,
						developing: false
					}
					// {
					// 	label: '空中宣讲',
					// 	svg: require('../../static/3.svg'),
					// 	backgroundColor: 'rgb(80,214,249)',
					// 	backgroundColor1: 'rgb(68,185,237)',
					// 	key:2,
					// 	developing: false
					// }
				],
				blockArr: [{
						label: '新闻速递',
						svg: require('./../../static/block1.svg'),
						backgroundColor: '#01ae66',
						backgroundColor1: '#21e7c3',
						miniProgramPath: 'pages/campusRec/campusRecNews/campusRecNews'
					},
					{
						label: '知名企业',
						svg: require('./../../static/block2.svg'),
						backgroundColor: '#1470dd',
						backgroundColor1: '#60c2e5',
						pagePath: '/pages/home/famousEnterprise'
					},
					{
						label: '开发区介绍',
						svg: require('./../../static/block3.svg'),
						backgroundColor: '#4773e3',
						backgroundColor1: '#7095ed',
						miniProgramPath: 'pages/xiaoyuan/jieshao/jieshao'
					},
					{
						label: '人才政策',
						svg: require('./../../static/block4.svg'),
						backgroundColor: '#ef5841',
						backgroundColor1: '#fdb004',
						miniProgramPath: 'pages/xiaoyuan/xuanchuan/rencaizhengce/rencaizhengce'
					}
				]
			}
		},
		methods: {
			toPlayVideo(title,videoUrl){
				// uni.navigateTo({
				// 	url: '/pages/videoPlay/videoPlay?title='+title+'&videoUrl='+videoUrl
				// })
			},
			openData(item) {
				console.log(item)
				let data = {
					...item
				}

				let str = JSON.stringify(data)
				uni.navigateTo({
					url: '/pages/recruitmentConference/talentCenterRecruitmentDetails?detail=' + str + '&current=' +
						this.currentType,
					fail: (err) => {
						console.log(err)
					}
				})
			},
			isOverdue(recruitmentItem) {
        //如果startTime为空，说明举办时间待定，不算过期
        if (!recruitmentItem.startTime) {
          return false
        }
        return isOverdue(recruitmentItem.endTime)
			},
			isToday(recruitmentItem) {
        return isToday(recruitmentItem.startTime)
			},
			isHolding(recruitmentItem) {
        return duringTheHoldingTime(recruitmentItem.startTime, recruitmentItem.endTime)
			},
			isOnlineConference(recruitmentItem) {
				return recruitmentItem.location && recruitmentItem.location.includes('网络');
			},
			goList(type){
				if(type === 1) {
					uni.switchTab({
						url:'/pages/main/main'
					})
				}else if(type === 0) {
					uni.switchTab({
						url:'/pages/recruitmentConference/recruitmentInfoList'
					})
				} else if (type === 2){ {
          uni.switchTab({
            url:'/pages/recruitmentConference/recruitmentInfoList'
          })
        }
          uni.showToast({
            title: '功能开发中...',
            icon: 'none',
            duration: 2000
          });
        }
			},
			goToMiniProgram(item) {
				if (item.developing) {
					// 对于开发中的功能显示提示窗口
					uni.showToast({
						title: '功能开发中...',
						icon: 'none',
						duration: 2000
					});
					return;
				}

				if (item.pagePath) {
					// 跳转到应用内页面
					uni.navigateTo({
						url: item.pagePath,
						fail: (err) => {
							console.error('页面跳转失败', err);
							uni.showToast({
								title: '跳转失败，请稍后再试',
								icon: 'none'
							});
						}
					});
					return;
				}

				if (item.miniProgramPath) {
					// 跳转到其他小程序
					uni.navigateToMiniProgram({
                        appId: 'wxa3c8a9919ed70d0d',
						path: item.miniProgramPath,
						fail: (err) => {
							console.error('跳转小程序失败', err);
							uni.showToast({
								title: '跳转失败，请稍后再试',
								icon: 'none'
							});
						}
					});
				}
			},
			searchContent(pageNum, content) {
				setTimeout( async () => {
					this.more = 'loading'
					if (!this.tableList) {
						this.tableList = []
					}
					let total = this.tableList.length || 0
					let wxUser = getApp().globalData.wxUser
					console.log("search value", wxUser)
          var expectedJobsName = ''
          // 如果用户端有期望岗位，显示期望岗位到界面
          if (wxUser && wxUser.expectedJobs) {
            let expectedJobs = JSON.parse(wxUser.expectedJobs)
            if(expectedJobs.length > 0){
              expectedJobsName = expectedJobs[0]
            }
          }
					if (wxUser && wxUser.openid && wxUser.id) {
						let res = await getEnterprisePostList({
							searchName: expectedJobsName,
							openid: wxUser.openid,
							studentId: wxUser.id,
							pageNum: 1,
							pageSize: 5
						})
						if (res && res.data && res.data.code == 200) {
							this.tableList = this.tableList.concat(res.data.rows || [])
							total = res.data.total || []
						} else if (res && res.data && res.data.code == 500) {
							console.error("获取首页岗位出错", res.data.msg)
						}
					}
					if (this.tableList && this.tableList.length >= total) {
						this.more = 'no-more'
					} else {
						this.more = 'more'
					}
				}, 1000)

			},
			async getJobs() {
				let res = await getAllRecruitmentConferenceList({
					//route type 1 是人才中心发布的招聘会
					routeType: 1,
					pageSize: 20
				})
        if (res && (res.statusCode === 200) && res.data.rows) {
          let filteredList = this.filterAndSortConferenceList(res.data.rows)
          this.jobFair = filteredList.slice(0, 5)
        } else {
          this.jobFair = []
        }
			},
      filterAndSortConferenceList(listData) {
        //筛选出未过期的招聘会
        if (!listData) {
          return [];
        } else {
          let nonOverdueItems = [];
          for (const item of listData) {
            if (!this.isOverDueItem(item)) {
              nonOverdueItems.push(item)
            }
          }
          nonOverdueItems.sort((a, b) => {
            if (a.startTime == null || b.startTime == null) {
              return 0
            }
            let startDatetime = new Date(a.startTime.replace(/-/g, '/')).getTime()
            let endDatetime = new Date(b.startTime.replace(/-/g, '/')).getTime()
            if (startDatetime < endDatetime) {
              return -1;
            } else {
              return 1;
            }
          })
          //没过期的正序排列
          return [...nonOverdueItems]
        }
      },
      isOverDueItem(item) {
        if (item && item.endTime && isOverdue(item.endTime)) {
          return true
        } else {
          return false
        }
      },
			async getBanners() {
				let data = await getBannerList()
				this.bannerInfo = data || []
				//分类图片和视频
				this.bannerVideos = data.filter(item => item.remark == 'first' || item.remark == 'second')
				this.bannerImages = data.filter(item => item.remark == null || item.remark == '')
			},
			changeswiper(e) {
				this.current = e.detail.current;
			},
		},
		onLoad() {
			this.getBanners()
			this.getJobs()
			this.searchContent()
		},
		onShareAppMessage() {
			return {
				title: '吴江毕业申招聘平台',
				path: '/pages/home/index',
				imageUrl: this.bannerImages.length > 0 ? this.baseUrl + this.bannerImages[0].bannerUrl : ''
			}
		},
		onShareTimeline() {
			return {
				title: '风华南苏州-吴江毕业申 - 发现更多职业机会',
				path: '/pages/home/index',
				imageUrl: this.bannerImages.length > 0 ? this.baseUrl + this.bannerImages[0].bannerUrl : ''
			}
		}
	}
</script>

<style lang="scss">
	.homes {
		padding: 10rpx;
		background: #ffffff;
	}

	.uni-swiper-dot-box .swiper-box {
		width: 100%;
		border-radius: 10px;
		overflow: hidden;
		margin: auto;
		height: 400rpx;
	}

	.circleArr {
		display: flex;
		justify-content: space-between;
		margin-top: 20rpx;
	}

	.circleItem {
		width: 150rpx;
		height: 150rpx;
		text-align: center;
		background: red;
		border-radius: 50%;
		font-size: 28rpx;
		color: white;
		font-weight: bolder;
	}

	.circleItem image {
		width: 50rpx;
		margin-top: 30rpx;
	}

	.blockArr {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		margin-top: 10rpx;
	}

	.blockItem {
		width: 48.5%;
		background: red;
		position: relative;
		height: 100rpx;
		padding: 20rpx 0;
		margin-bottom: 30rpx;
		border-radius: 10rpx;
	}
	.blockMiniItem {
		width: 22%;
		background: red;
		position: relative;
		padding: 20rpx 0;
		margin-bottom: 30rpx;
		border-radius: 10rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.blockItem image {
		width: 90rpx;
		height: 90rpx;
		position: absolute;
		right: 47rpx;
		top: 20rpx;
	}
	.blockMiniItem image {
		width: 70rpx;
		height: 70rpx;
		margin-bottom: 10rpx;
	}
	.blocklabel {
		line-height: 100rpx;
		font-weight: bolder;
		padding-left: 50rpx;
		color: white;
	}
	.miniblocklabel {
		font-size: 26rpx;
		color: white;
	}
	.titleWrap {
		display: flex;
		justify-content: space-between;
		font-weight: bolder;
		margin-top: 20rpx;
	}

	.titleText::before {
		width: 8rpx;
		height: 30rpx;
		vertical-align: middle;
		margin-right: 10rpx;
		background: #34acc3;
		border-radius: 5rpx;
		display: inline-block;
		content: ''
	}

	.jobFair {
		margin-top: 20rpx;
	}

	.jobFairItem {
		background: white;
		padding: 20rpx;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
	}

	.jobFairItemTop {
		display: flex;
		position: relative;
	}

	.jobFairItemTop image {
		width: 300rpx;
		height: 150rpx;
		border-radius: 10rpx;
		flex-shrink: 0;
		margin-right: 10rpx;
	}

	.jobFairItemBottom {
		margin-top: 20rpx;
		padding-top: 20rpx;
		border-top: 1px solid #f5f5f5;
		font-size: 24rpx;
		display: flex;
		justify-content: space-between;
		background: rgba(248, 249, 250, 0.5);
		border-radius: 0 0 10rpx 10rpx;
		margin: 20rpx -20rpx -20rpx;
		padding: 20rpx;
	}

	.time-location-info {
		display: flex;
		flex-direction: column;
		gap: 8rpx;
	}

	.info-row {
		display: flex;
		align-items: center;
		gap: 8rpx;
	}

	.textTag {
		color: white;
		padding: 5rpx 10rpx;
		border-radius: 5rpx;
		font-size: 22rpx;
		font-weight: bolder;
		margin-top: 10rpx;
		display: inline-block;
		position: absolute;
		bottom: 10rpx;
		border-bottom-right-radius: 20rpx;
	}

	.online {
		background: linear-gradient(to right, #8ee6d0, #7ecdba);
	}

	.outline {
		background: linear-gradient(to right, #219fff, #2168ff);
	}

	.recruitmentNames {
		font-size: 28rpx;
		font-weight: bolder;
		color: #333;
	}
	.banner {
		background-color: #2d823c;
		color: white;
		border-radius: 5rpx;
		padding: 2rpx 5rpx;
	}

	.banner-today {
		background-color: #34acc3;
		color: white;
		border-radius: 5rpx;
		padding: 2rpx 5rpx;
	}


	.banner-overdue {
		background-color: #f0ad4e;
		color: white;
		border-radius: 5rpx;
		padding: 2rpx 5rpx;
	}

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
		}
	}

	.jobs {
		margin-top: 20rpx;
	}

	.jobsItem {
		background: white;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}

	.videoCoverBox{
	    position: relative;
		width: 100%;
		height: 250rpx;
	}
	.videoCoverImg{
		 display: block;
		    width: 99%;
		    height: 236rpx;
		    margin: 20rpx auto;
		    border: 0rpx solid  #ddd;
		    border-radius: 20rpx;
	}
	.icon-video{width: 100rpx; height: 100rpx;}
	.imgCoverView{
		width: 100%;
		height: 200rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1;
		top: 7rpx;
		position: absolute;
	}
	.video-text{ font-size: 34rpx; color: #fff; font-weight: bold; margin-left: 10rpx;}
</style>
