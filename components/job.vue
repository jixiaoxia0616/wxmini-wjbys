<template>
  <view class="job" @click="openDetail(itemData)">
    <view class="displayFlex jobTop">
      <view class="">
        <text class="jobName">{{ itemData.positionName }}</text>
        <text class="education">{{ itemData.academic }}</text>
      </view>
      <view class="salary">
        {{ itemData.salary }}
      </view>
    </view>
    <view class="displayFlex">
      <view class="skill" v-if="itemData.professionalList">
        <text v-for="(item,index) in itemData.professionalList" :key="index">{{ item }}
          <text
              style="margin: 0 3rpx;display: inline-block;"
              v-if="index < itemData.professionalList.length - 1"> |
          </text>
        </text>
      </view>
      <view @click.stop="clickSubmitResume(itemData)" :class=" itemData.submitStatus == 1 ? 'posted' : 'postBtn'">
        {{ itemData.submitStatus === '1' ? '撤销投递' : '投简历' }}
      </view>
    </view>
    <view class="displayFlex jobBottom">
      <view class="">
        <uni-icons type="location" size="16"></uni-icons>
        {{ itemData.enterpriseName }}
      </view>
      <view class="">
        <uni-icons type="personadd" size="16"></uni-icons>
        招{{ itemData.recruitmentNum }}人
      </view>
    </view>
  </view>
</template>

<script>
import {
  withdrawDelivery
} from '@/apis/api.js';

export default {
  props: ['itemData'],
  name: "job",
  data() {
    return {}
  },
  methods: {
    openDetail(item) {
      let data = {
        enterpriseId: item.enterpriseId,
        enterpriseName: item.enterpriseName,
        positionName: item.positionName,
        workPlace: item.workPlace,
        postId: item.id,
        salary: item.salary,
        recruitmentNum: item.recruitmentNum,
        posterAddress: item.posterAddress,
        academic: item.academic,
        welfare: item.welfare,
        principal: item.principal,
        workDuty: item.workDuty,
        professionalList: item.professionalList,
        internshipExperience: item.internshipExperience,
        qualification: item.qualification,
        subscribePostId: item.subscribePostId || null, //岗位订阅
        submitStatus: item.submitStatus
      }
      //console.log('encode data to detail page', data)
      let encodedJsonData = encodeURIComponent(JSON.stringify(data))
      //console.log('stringfy data', encodedJsonData)
      uni.navigateTo({
        url: '/pages/detail/detail?detail=' + encodedJsonData
      })
    },
    clickSubmitResume(item) {
      if (!getApp().isLogin()) {
        return
      }
      if (item.submitStatus === '1') {
        //如果已经投递了，可以选择撤销投递
        //岗位ID即当前item的ID
        let currentPostId = item.id
        let currentStudentId = getApp().globalData.wxUser.id;
        uni.showModal({
          title: '确认撤销',
          content: '确定要撤销该职位的简历投递吗？',
          confirmColor: '#34acc3',
          success: (res) => {
            if (res.confirm) {
              this.withdrawCurrentDelivery(currentStudentId, currentPostId);
            }
          }
        });
      } else {
        //跳转到投递界面
        this.goToDeliveryPage(item)
      }
    },
    goToDeliveryPage(item) {
      let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
      let curRoute = routes[routes.length - 1].route //获取当前页面路由
      getApp().globalData.currentPate = curRoute

      uni.navigateTo({
        url: '/pages/resumeDetail/resumeDetail?postId=' + item.id + '&enterpriseId=' + item
            .enterpriseId + '&enterpriseName=' + item
            .enterpriseName + '&positionName=' + item
            .positionName
      })
    },
    async withdrawCurrentDelivery(studentId, postId) {
      let res = await withdrawDelivery(studentId, postId)
      if (res && res.data && res.data.code === 200) {
        uni.showToast({
          title: '撤销投递成功',
          icon: 'success',
          duration: 1500, //提示的延迟时间，单位毫秒，默认：1500
        })

        // 更新当前投递状态
        this.itemData.submitStatus = '0'

        // 触发父组件刷新列表
        this.$emit('refresh-list')

        // 重新加载当前页面
        let pages = getCurrentPages()
        let currentPage = pages[pages.length - 1]
        if (currentPage && currentPage.onLoad) {
          setTimeout(() => {
            currentPage.onLoad(currentPage.options)
          }, 1500)
        }
      } else {
        uni.showToast({
          title: '撤销投递失败',
          icon: 'error',
          duration: 1500, //提示的延迟时间，单位毫秒，默认：1500
        })
      }
    }
  }
}
</script>

<style>
.displayFlex {
  display: flex;
  justify-content: space-between;
}

.job {
  padding: 20rpx;
}

.jobTop {
  margin-bottom: 20rpx;
}

.education {
  display: inline-block;
  font-size: 22rpx;
  padding: 2rpx 5rpx;
  background: #34acc3c2;
  color: white;
  border-radius: 5rpx;
  margin-left: 20rpx;
}

.jobName {
  font-weight: bolder;
  max-width: 300rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  vertical-align: top;
}

.salary {
  font-weight: bolder;
  color: #34acc3;
  font-size: 34rpx;
  white-space: nowrap;
}

.skill {
  color: gray;
  font-size: 24rpx;
  vertical-align: top;
  max-width: 500rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.postBtn {
  background: #e48d0b;
  color: white;
  vertical-align: top;
  font-size: 24rpx;
  font-weight: bolder;
  padding: 10rpx 10rpx;
  border-radius: 10rpx;
}

.posted {
  background: #e74c3c; /* 红色背景 */
  color: white;
  vertical-align: top;
  font-size: 24rpx;
  font-weight: bolder;
  padding: 10rpx 10rpx;
  border-radius: 10rpx;
}

.jobBottom {
  margin-top: 20rpx;
  font-size: 26rpx;
}
</style>
