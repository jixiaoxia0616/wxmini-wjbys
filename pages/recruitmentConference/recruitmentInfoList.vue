<template>
  <view class="subscribe-view">
    <uni-segmented-control :current="currentCategory" :values="categoryList" :activeColor="uniColorPrimary"
                           @clickItem="onChangeCategory" styleType="button">
    </uni-segmented-control>
    <view class="content">
      <view>
        <uni-list v-if="listData && listData.length">
          <uni-list-item v-for="(item,index) in listData" :key="index" clickable @click="openData(item)">
            <recruitmentItem slot="body" style="width: 100%;height: 100%;" :recruitmentItem="item"
                             :type="currentCategory"></recruitmentItem>
          </uni-list-item>
        </uni-list>
        <view v-else
              style="width:100%;height:100%;display: flex;  flex-direction: column;  align-items: center;">
          <image :src="empty" class="empty-warning-image"></image>
          <text class="empty-warning-message">找不到更多的招聘信息啦！</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import messageItem from '@/components/messageItem.vue'
import empty from '@/static/empty.png'
import RecruitmentItem from "../../components/recruitmentItem";
import {
  getAllRecruitmentConferenceList
} from "../../apis/api";
import {
  isOverdue
} from "../../utils/util";

export default {
  components: {
    RecruitmentItem,
    messageItem
  },
  data() {
    return {
      empty,
      categoryList: ['全部', '线下招聘会', '线上招聘会', '宣讲会'],
      currentCategory: 0,
      listData: [],
      uniColorPrimary: "#34acc3"
    }
  },
  onLoad() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    })
  },

  onShow() {
    // 允许未登录用户也能查看招聘会列表
    this.updateList()
  },

  methods: {
    onChangeCategory(e) {
      if (this.currentCategory != e.currentIndex) {
        this.currentCategory = e.currentIndex;
        this.updateList()
      }
    },
    openData(item) {
      let data = {
        ...item
      }

      let str = JSON.stringify(data)
      uni.navigateTo({
        url: '/pages/recruitmentConference/talentCenterRecruitmentDetails?detail=' + str +
            '&current=' + this.currentCategory,
        fail: (err) => {
          console.log(err)
        }
      })
    },

    isOverDueItem(item) {
      //如果startTime为空，说明举办时间待定，不算过期
      if (item && !item.startTime) {
        return false
      }
      return item && item.endTime && isOverdue(item.endTime)
    },

    sortListData(listData) {
      if (!listData) {
        return [];
      } else {
        let overdueItems = [];
        let nonOverdueItems = [];
        for (const item of listData) {
          if (this.isOverDueItem(item)) {
            overdueItems.push(item)
          } else {
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
        //把过期的放后面，没过期的放前面,没过期的正序排列
        return [...nonOverdueItems, ...overdueItems]
      }
    },

    async updateList() {
      let res = null
      let wxUser = getApp().globalData.wxUser
      let params = {
        studentId: wxUser ? wxUser.id : null
      }
      uni.showLoading({
        title: '正在加载...',
        mask: true
      })
      res = await getAllRecruitmentConferenceList({
        ...params,
        //route type 1 是人才中心发布的招聘会
        //route type 0 是企业自行发布的宣讲会
        routeType: 1,
        pageSize: 100
      })
      console.log("人才中心宣讲会列表", res);

      if (res && res.statusCode == 200) {
        let displaylist = [];
        if (this.currentCategory === 0) {
          displaylist = res.data.rows;
          //全部招聘会
        } else if (this.currentCategory === 1) {
          //线下招聘会
          displaylist = res.data.rows.filter(item => this.isOfflineRecruitment(item))
        } else if (this.currentCategory === 2) {
          //线上招聘会
          displaylist = res.data.rows.filter(item => this.isOnlineConference(item))
        } else if (this.currentCategory === 3) {
          //宣讲会
          displaylist = res.data.rows.filter(item => this.isSeminar(item))
        }
        this.listData = this.sortListData(displaylist)
      } else {
        this.listData = [];
        uni.showToast({
          title: '获取数据失败',
          duration: 2000
        });
      }
      uni.hideLoading()
    },
    //检测是不是线下招聘会
    isOfflineRecruitment(recruitmentItem) {
      return !this.isOnlineConference(recruitmentItem) && !this.isSeminar(recruitmentItem)
    },
    //检测是不是网络招聘会
    isOnlineConference(recruitmentItem) {
      return recruitmentItem.location && recruitmentItem.location.includes('网络');
    },
    //检测是不是宣讲会
    isSeminar(recruitmentItem) {
      return recruitmentItem.recruitmentNames.includes('宣讲');
    }
  },

}
</script>

<style scoped lang="scss">
.subscribe-view {
  padding: 20 rpx 10 rpx;

  .content {
    height: calc(100vh - 96rpx);
    overflow: auto;
  }
}
</style>

<style lang="scss">
.subscribe-view {
  .uni-list-item__container {
    padding-left: 15 rpx;
  }
}

.empty-warning-image {
  width: 200 rpx;
  height: 200 rpx;
  margin-top: 100 rpx;
  color: $uni-color-primary;
}

.empty-warning-message {
  margin-top: 50 rpx;
  font-size: 26 rpx;
  color: $uni-color-primary;
  font-weight: 500;
}
</style>
