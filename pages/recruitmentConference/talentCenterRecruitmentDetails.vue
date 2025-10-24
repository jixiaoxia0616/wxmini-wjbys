<template>
  <view class="details">
    <swiper class="swiper-box" @change="changeSwiper">
      <swiper-item v-for="(item, index) in bannerImages" :key="index">
        <image :src="baseUrl + item.bannerUrl" style="width:750rpx;height:500rpx;"></image>
      </swiper-item>
    </swiper>

    <view v-if="drawerOpen" class="mask" @click="toggleDrawer"></view>

    <view class="stats-container">
      <view class="stat-box">
        <count-up class="number" :end-value="totalEnterprisesCount || recruitmentEnterprises.length"></count-up>
        <view class="description">参与公司</view>
      </view>
      <view class="stat-box">
        <count-up class="number" :end-value="totalPositionsCount || recruitmentPositions.length"></count-up>
        <view class="description">招聘职位</view>
      </view>
      <view class="stat-box">
        <count-up class="number" :end-value="totalNumberOfRecruitmentPositionJobs"></count-up>
        <view class="description">需求人数</view>
      </view>
    </view>
    <uni-forms :modelValue="detailData">
      <view class="section-header-container">
        <sectionHeader>
          <span>{{ detailData.recruitmentName }}</span>
          <view slot="right" class="drawer-btn" @click="toggleDrawer">
            <uni-icons type="bars" size="24" color="#34acc3"></uni-icons>
          </view>
        </sectionHeader>

        <!-- 同路线招聘会抽屉 -->
        <view class="drawer-container" :class="{ 'drawer-open': drawerOpen }">
          <view class="drawer-header">
            <view class="drawer-title">同路线招聘会</view>
            <view class="drawer-close" @click="toggleDrawer">
              <uni-icons type="close" size="20" color="#666"></uni-icons>
            </view>
          </view>
          <scroll-view class="drawer-content" scroll-y>
            <view v-if="routeConferences.length === 0" class="empty-tip">暂无数据</view>
            <view v-else>
              <view
                v-for="(item, index) in routeConferences"
                :key="index"
                class="conference-item"
                :class="{'current-conference': item.id === detailData.recruitmentId}"
                @click="navigateToConference(item)"
              >
                <view class="conference-name">{{ item.recruitmentNames }}</view>
                <view class="conference-time">{{ formatEventTime(item.startTime, item.endTime, item.timeTbd) }}</view>
                <view class="conference-address">{{ item.schoolName }} · {{ item.location }}</view>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>

      <view class="detail-form">
        <!-- <uni-forms-item label="举办时间" labelWidth="100">
          <view class="uni-list-cell-left">{{ formatEventTime(detailData.startTime, detailData.endTime, detailData.timeTbd) }}</view>
        </uni-forms-item>
        <uni-forms-item label="举办地点" labelWidth="100" name="address">
          <view class="uni-list-cell-left">{{ detailData.address }}</view>
        </uni-forms-item> -->
		<view class="detail-row">
			<view class="detail-row-title">举办时间</view>
			<view>{{ formatEventTime(detailData.startTime, detailData.endTime, detailData.timeTbd) }}</view>
		</view>
		<view class="detail-row" v-if="detailData.address!='网络招聘'">
			<view class="detail-row-title">举办地点</view>
			<view>{{ detailData.address }}</view>
		</view>
      </view>
      <view>
        <view class="container">
          <uni-segmented-control :current="currentList" :values="items" activeColor="#34acc3"
                                 @clickItem="onClickItem" styleType="text">
          </uni-segmented-control>
          <view style="height: 10px;width: 100%;"></view>
          <uni-easyinput v-model="positions" maxlength="400" inputBorder
                         :placeholder="currentList == 0 ? '搜索岗位或专业' :'搜索企业'" trim @input="positionsInput">
          </uni-easyinput>
        </view>
        <view v-if="currentList == 0">
          <uni-list :loading="recruitmentPositionsLoading">
            <view class="job-item-container" v-for="(item,index) in filterRecruitmentPositions" :key="index">
              <job :itemData="item"></job>
            </view>
          </uni-list>
          <view v-if="!positions && positionsLoading && positionsPageNum > 1" class="loading-tip">
            <text>加载中...</text>
          </view>
          <view v-if="!positions && !positionsHasMore && filterRecruitmentPositions.length > 0" class="no-more-tip">
            <text>没有更多了</text>
          </view>
        </view>
        <view v-if="currentList == 1">
          <uni-list :loading="recruitmentPositionsLoading">
            <uni-list-chat v-for="(item,index) in filterRecruitmentEnterprises" :key="index"
                           :avatar="item.enterpriseUrl ? (baseUrl + item.enterpriseUrl) :logo"
                           :title="item.enterpriseName" :rightText="'注册资本'+(item.registerCapital || 0)+'万元'"
                           :note="item.enterpriseAddress" clickable @click="openData(item)">
            </uni-list-chat>
          </uni-list>
          <view v-if="!positions && enterprisesLoading && enterprisesPageNum > 1" class="loading-tip">
            <text>加载中...</text>
          </view>
          <view v-if="!positions && !enterprisesHasMore && filterRecruitmentEnterprises.length > 0" class="no-more-tip">
            <text>没有更多了</text>
          </view>
        </view>
      </view>

    </uni-forms>
  </view>
</template>

<script>
import sectionHeader from '@/components/sectionHeader.vue'
import enterpriseName from '@/components/enterpriseName.vue'
import job from '@/components/job.vue'
import CountUp from '@/components/count-up.vue'
import logo from '@/static/logo.png'
import {
  getAllPositionsByRoute,
  getAllEnterprisesByRoute,
  getBannerList,
  getRecruitmentConferenceListByRouteId,
  getTotalRecruitmentPositionJobs
} from "@/apis/api";
import {
  baseUrl
} from '@/apis/request.js';

export default {
  components: {
    sectionHeader,
    enterpriseName,
    job,
    CountUp
  },
  data() {
    return {
      baseUrl,
      logo,
      current: 0,
      routeId: '',
      positions: '',
      currentList: 0,
	  positionsPageSize: 20,
	  positionsPageNum: 1,
	  enterprisesPageSize: 20,
	  enterprisesPageNum: 1,
	  positionsHasMore: true,
	  enterprisesHasMore: true,
	  positionsLoading: false,
	  enterprisesLoading: false,
      items: ['岗位列表', '公司列表'],
      drawerOpen: false, // Control drawer state
      routeConferences: [], // 同路线招聘会列表
	  detailStr: '',
      detailData: {
        recruitmentId: '',
        recruitmentName: '',
        startTime: '',
        endTime: '',
        address: '',
        campus: '',
        timeTbd: false,
        photoUrl: null
      },
      filterRecruitmentPositions: [],
      recruitmentPositions: [],
      totalNumberOfRecruitmentPositionJobs: 0,
      totalPositionsCount: 0,
      filterRecruitmentEnterprises: [],
      recruitmentEnterprises: [],
      totalEnterprisesCount: 0,
      recruitmentPositionsLoading: true,
      bannerInfo: [{
        bannerUrl: ''
      }],
      bannerImages: [{
        bannerUrl: ''
      }],
      bannerVideos: [{
        bannerUrl: ''
      }],
      dotsStyles: {
        backgroundColor: 'rgba(83, 200, 249,0.3)',
        border: '1px rgba(83, 200, 249,0.3) solid',
        color: '#fff',
        selectedBackgroundColor: 'rgba(83, 200, 249,0.9)',
        selectedBorder: '1px rgba(83, 200, 249,0.9) solid'
      }
    }
  },

  onLoad(openValue) {
    let str = openValue.detail
	console.log("招聘会明细，传过来的参数：", str);
	this.detailStr = str;
    if (str) {
      let data = JSON.parse(str)
      // console.log("data", data);
      this.detailData.recruitmentId = data.id
      this.detailData.recruitmentName = data.recruitmentNames
      this.detailData.startTime = data.startTime
      this.detailData.endTime = data.endTime
      this.detailData.address = data.location
      this.detailData.campus = data.schoolName
      this.detailData.timeTbd = data.timeTbd
      this.detailData.photoUrl = data.photoUrl
      this.routeId = data.routeId
      this.getPositions(this.routeId);
      this.getEnterprises(this.routeId);
      this.getRouteConferences(this.routeId);
      this.getTotalJobs(this.routeId);
    }
    this.getBanners()
  },

  onShow() {
    if (this.routeId) {
      console.log("routeId", this.routeId);
      this.recruitmentPositionsLoading = true;
      this.positions = ''
    }
  },
  onReachBottom() {
    // 页面触底时自动加载更多
    if (this.currentList == 0) {
      this.loadMorePositions();
    } else if (this.currentList == 1) {
      this.loadMoreEnterprises();
    }
  },
  methods: {
    // 获取招聘岗位总需求人数
    async getTotalJobs(routeId) {
      try {
        let res = await getTotalRecruitmentPositionJobs(routeId);
        console.log("总需求", res)
        if (res && res.data !== undefined) {
          this.totalNumberOfRecruitmentPositionJobs = res.data || 0;
        }
      } catch (err) {
        console.log('获取招聘岗位总需求人数出错', err);
      }
    },
    formatEventTime(startTime, endTime, timeTbd) {
      if (timeTbd) {
        return '待定';
      }

      if (!startTime || !endTime) {
        return '时间未设置';
      }

      // iOS兼容：将 "yyyy-MM-dd HH:mm:ss" 转换为 "yyyy/MM/dd HH:mm:ss"
      const formatDateForIOS = (dateStr) => {
        if (typeof dateStr === 'string') {
          return dateStr.replace(/-/g, '/');
        }
        return dateStr;
      };

      const start = new Date(formatDateForIOS(startTime));
      const end = new Date(formatDateForIOS(endTime));

      const startDate = start.toISOString().split('T')[0]; // YYYY-MM-DD
      const endDate = end.toISOString().split('T')[0]; // YYYY-MM-DD

      const startTimeStr = start.toTimeString().slice(0, 5); // HH:MM
      const endTimeStr = end.toTimeString().slice(0, 5); // HH:MM

      if (startDate === endDate) {
        // 同一天，显示格式：2025-09-17 14:00-16:00
        return `${startDate} ${startTimeStr}-${endTimeStr}`;
      } else {
        // 不同天，显示完整时间范围
        return `${startDate} ${startTimeStr} ~ ${endDate} ${endTimeStr}`;
      }
    },
    onClickItem(e) {
      if (this.currentList != e.currentIndex) {
        this.currentList = e.currentIndex;
        this.positions = '';
        if (this.currentList === 0) {
          this.positionsPageNum = 1;
          this.positionsHasMore = true;
          this.getPositions(this.routeId);
        } else if (this.currentList === 1) {
          this.enterprisesPageNum = 1;
          this.enterprisesHasMore = true;
          this.getEnterprises(this.routeId);
        }
      }
    },
    openData(item) {
      console.log('enterprise id:' + item.id + 'routeId:' + this.routeId)
      uni.navigateTo({
        url: '/pages/recruitmentConference/positionList/positionList?detail=' + item.id + '&routeId=' +
            this.routeId
      })
    },

	// 加载企业列表
    async getEnterprises(routeId, loadMore = false) {
      if (this.enterprisesLoading) return;

      this.enterprisesLoading = true;
      if (!loadMore) {
        this.recruitmentPositionsLoading = true;
        this.enterprisesPageNum = 1;
        this.recruitmentEnterprises = [];
        this.filterRecruitmentEnterprises = [];
      }

      let res = await getAllEnterprisesByRoute({
        routeId: routeId,
        zpRouteRecruitmentId: this.detailData.recruitmentId,
        routeType: 1,
        pageNum: this.enterprisesPageNum,
        pageSize: this.enterprisesPageSize
      })

      if (res && res.statusCode === 200) {
        this.recruitmentPositionsLoading = false;
        this.enterprisesLoading = false;

        const newRows = res.data.rows || [];
        if (loadMore) {
          this.recruitmentEnterprises = [...this.recruitmentEnterprises, ...newRows];
        } else {
          this.recruitmentEnterprises = newRows;
        }

        this.totalEnterprisesCount = res.data.total || 0;
        this.enterprisesHasMore = this.recruitmentEnterprises.length < this.totalEnterprisesCount;

        // 如果没有搜索条件，更新显示列表
        if (!this.positions) {
          this.filterRecruitmentEnterprises = JSON.parse(JSON.stringify(this.recruitmentEnterprises))
        }
      } else {
        this.enterprisesLoading = false;
        this.recruitmentPositionsLoading = false;
      }
    },
	// 加载职位列表
    async getPositions(routeId, loadMore = false) {
      if (this.positionsLoading) return;

      this.positionsLoading = true;
      if (!loadMore) {
        this.recruitmentPositionsLoading = true;
        this.positionsPageNum = 1;
        this.recruitmentPositions = [];
        this.filterRecruitmentPositions = [];
      }

      let wxUser = getApp().globalData.wxUser
      let res = await getAllPositionsByRoute({
        routeId: routeId,
        zpRouteRecruitmentId: this.detailData.recruitmentId,
        studentId: wxUser ? wxUser.id : null,
		    pageNum: this.positionsPageNum,
        pageSize: this.positionsPageSize
      })

      if (res && res.statusCode === 200) {

        this.recruitmentPositionsLoading = false;
        this.positionsLoading = false;

        const newRows = res.data.rows || [];
        if (loadMore) {
          this.recruitmentPositions = [...this.recruitmentPositions, ...newRows];
        } else {
          this.recruitmentPositions = newRows;
        }

        this.totalPositionsCount = res.data.total || 0;
        this.positionsHasMore = this.recruitmentPositions.length < this.totalPositionsCount;

        // 如果没有搜索条件，更新显示列表
        if (!this.positions) {
          this.filterRecruitmentPositions = JSON.parse(JSON.stringify(this.recruitmentPositions))
        }
      } else {
        this.positionsLoading = false;
        this.recruitmentPositionsLoading = false;
      }
    },
    async getRouteConferences(routeId) {
      try {
        uni.showLoading({
          title: '加载中'
        });
        let res = await getRecruitmentConferenceListByRouteId(routeId);
        if (res && res.data && res.data.rows) {
          this.routeConferences = res.data.rows;
        }
      } catch (err) {
        console.log('获取同路线招聘会列表出错', err);
        uni.showToast({
          title: '获取招聘会列表失败',
          icon: 'none'
        });
      } finally {
        uni.hideLoading();
      }
    },
    positionsInput(val) {
      if (this.currentList == 0) {
        if (!val) {
          this.filterRecruitmentPositions = [...this.recruitmentPositions]
        } else {
          let list = this.recruitmentPositions.filter(x =>
              x.positionName.indexOf(val) > -1 ||
              x.enterpriseName.indexOf(val) > -1 ||
              (x.professionalList && x.professionalList.some(prof => prof.indexOf(val) > -1))
          )
          this.filterRecruitmentPositions = list
        }


      } else {
        if (!val) {
          this.filterRecruitmentEnterprises = [...this.recruitmentEnterprises]
        } else {
          let list = this.recruitmentEnterprises.filter(x => x.enterpriseName.indexOf(val) > -1 ||
              x.enterpriseName.indexOf(val) > -1)
          this.filterRecruitmentEnterprises = list
        }
      }

    },
    async getBanners() {
      if (this.detailData.photoUrl && this.detailData.photoUrl !== '') {
        //2025-03-19 需求更改为显示用户自定义的图片
        this.bannerImages = Array.of({
          bannerUrl: this.detailData.photoUrl
        })
      } else {
        let data = await getBannerList()
        this.bannerInfo = data || []
        //分类图片和视频
        //视频
        this.bannerVideos = data.filter(item => item.remark == 'first' || item.remark == 'second')
        //图片
        // this.bannerImages = data.filter(item => item.remark == null || item.remark == '' )
        //2024-12-30 需求更改为只显示第一张图片
        this.bannerImages = data.filter(item => item.sorted === 1)
      }
      console.log('bannerImages', this.bannerImages)
    },
    changeSwiper(e) {
      this.current = e.detail.current;
    },
    toggleDrawer() {
      this.drawerOpen = !this.drawerOpen;
    },
    navigateToConference(item) {
      uni.navigateTo({
        url: '/pages/recruitmentConference/talentCenterRecruitmentDetails/talentCenterRecruitmentDetails?detail=' + JSON.stringify(item)
      })
    },
    // 加载更多岗位
    loadMorePositions() {
      if (!this.positionsHasMore || this.positionsLoading || this.positions) return;
      this.positionsPageNum++;
      this.getPositions(this.routeId, true);
    },
    // 加载更多企业
    loadMoreEnterprises() {
      if (!this.enterprisesHasMore || this.enterprisesLoading || this.positions) return;
      this.enterprisesPageNum++;
      this.getEnterprises(this.routeId, true);
    },
	onShareAppMessage() {
		return {
			title: this.detailData.recruitmentName,
			path: '/pages/recruitmentConference/talentCenterRecruitmentDetails?detail='+this.detailStr,
			imageUrl: this.bannerImages.length > 0 ? this.baseUrl + this.bannerImages[0].bannerUrl : ''
		}
	},
	onShareTimeline() {
		return {
			title: this.detailData.recruitmentName,
			path: '/pages/recruitmentConference/talentCenterRecruitmentDetails?detail='+this.detailStr,
			imageUrl: this.bannerImages.length > 0 ? this.baseUrl + this.bannerImages[0].bannerUrl : ''
		}
	}
  }
}
</script>

<style lang="scss" scoped>
.stats-container {
  display: flex;
  justify-content: space-around;
  padding: 30rpx 20rpx;
  background-color: #ffffff;
  margin: 20rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);

  .stat-box {
    flex: 1;
    text-align: center;
    padding: 10rpx 20rpx;
    position: relative;

    &:not(:last-child):after {
      content: '';
      position: absolute;
      right: 0;
      top: 20%;
      height: 60%;
      width: 2rpx;
      background-color: #eee;
    }

    .number {
      font-size: 40rpx;
      font-weight: 600;
      color: $uni-color-primary;
      margin-bottom: 12rpx;
    }

    .description {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.section-header-container {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.section-header-container :deep(.uni-section) {
  width: 100%;
  display: flex;
}

.section-header-container :deep(.uni-section-header__content) {
  flex: 1;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 9999; /* Increased z-index */
}

.drawer-container {
  position: fixed;
  top: 0;
  right: -80%;
  width: 80%;
  height: 100vh;
  background-color: #fff;
  z-index: 10000; /* Increased z-index higher than mask */
  box-shadow: -4px 0 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.drawer-open {
  right: 0;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1px solid #eee;
  background-color: #fff;
}

.drawer-title {
  font-size: 30rpx;
  font-weight: bold;
  color: $uni-color-primary; /* 使用程序默认主题色 */
}

.drawer-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  height: calc(100vh - 100rpx);
}

.conference-item {
  padding: 30rpx;
  border-bottom: 1px solid #f5f5f5;
}

.current-conference {
  background-color: #f0f8ff;
  border-left: 4px solid #34acc3;
}

.conference-name {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.conference-time, .conference-address {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 6rpx;
}

.empty-tip {
  text-align: center;
  padding: 40rpx;
  color: #999;
}

.job-item-container {
  background: #fff;
  border-radius: 10rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 95%;
  margin: 10rpx auto;
}

.swiper-box {
  height: 500rpx;
}

.details {
  width: 750rpx;
  height: 100vh;
  // overflow: auto;

  .detail-form {
    padding: 20rpx 30rpx;
    width: 680rpx;
    margin: 20rpx auto;
    background: #fff;
    border-radius: 12rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

    .uni-list-cell-left {
      border-radius: 8rpx;
      line-height: 44rpx;
      padding: 8rpx 16rpx;
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
    }

    .campus-text {
      font-weight: bold;
    }
  }

  .container {
    position: sticky;
    top: 0px;
    z-index: 1000;
    background-color: #fff;
    padding: 0 10px 10px 10px;
    opacity: 1;
  }

  .bottom-btns {
    margin: 0 20rpx;
  }

}

.detail-row {
	display: flex;
	font-size: 26rpx;
	color: #666;
	margin-bottom: 20rpx;
}
.detail-row-title {
	margin-right: 16rpx;
}

.loading-tip, .no-more-tip {
  text-align: center;
  padding: 30rpx 0;

  text {
    color: #999;
    font-size: 26rpx;
  }
}
</style>
