<template>
  <view class="details">
    <uni-forms :modelValue="dataDetail">
      <sectionHeader>
        <span>岗位招聘信息</span>
      </sectionHeader>
      <view class="detail-form">
        <view class="position-main-info">
          <view class="additional-info">
            <div v-if="dataDetail.recruitmentNum" class="position-others">招聘{{ dataDetail.recruitmentNum }}人</div>
            <div v-if="dataDetail.recruitmentNum && dataDetail.academic" class="position-others">&#8226</div>
            <div v-if="dataDetail.academic" class="position-others">{{ dataDetail.academic }}</div>
            <div v-if="dataDetail.salary" class="position-salary">{{ dataDetail.salary }}</div>
          </view>
          <view class="position-name">{{ dataDetail.positionName }}</view>
          <view v-if="dataDetail.professionalList && dataDetail.professionalList.size !=0">
            <text class="position-major-tag" v-for="(cell,index) in dataDetail.professionalList" size="small" :key="index">{{cell}}</text>
          </view>
        </view>

        <view label="任职资格" v-if='dataDetail.qualification' class="position-description-box" name="qualification">
          <div class="position-label">任职资格</div>
          <rich-text class="position-description" :nodes="dataDetail.qualification"></rich-text>
        </view>


        <view label="工作职责" v-if='dataDetail.workDuty' class="position-description-box" name="qualification">
          <div class="position-label">工作职责</div>
          <rich-text class="position-description" :nodes="dataDetail.workDuty"></rich-text>
        </view>


        <uni-collapse>
          <uni-collapse-item>
            <template v-slot:title>
              <view style="height: 40px; line-height: 40px;">
                <uni-icons type="bars" size="16"></uni-icons>
                <text style="margin-left: 10px;">其他信息</text>
              </view>
            </template>
            <uni-forms-item label="福利待遇" v-if='dataDetail.welfare' labelWidth="100" name="welfare"></uni-forms-item>
            <rich-text :nodes="dataDetail.welfare"></rich-text>

            <uni-forms-item label="招聘地址" v-if='dataDetail.workPlace' labelWidth="100" name="workPlace">
              <view class="uni-list-cell-left">{{ dataDetail.workPlace }}</view>
            </uni-forms-item>

            <uni-forms-item label="实践经验" v-if='dataDetail.internshipExperience' labelWidth="100"
                            name="internshipExperience">
              <rich-text :nodes="dataDetail.internshipExperience"></rich-text>
            </uni-forms-item>

            <uni-forms-item label="招聘人员" v-if='dataDetail.principal' labelWidth="100" name="principal">
              <view class="uni-list-cell-left">{{ dataDetail.principal ? dataDetail.principal : '' }}</view>
            </uni-forms-item>

          </uni-collapse-item>
        </uni-collapse>
      </view>

      <sectionHeader>
        <span>企业信息</span>
      </sectionHeader>
      <view class="detail-form" v-if="showEnterprise">
        <uni-forms-item label="企业全称" labelWidth="100" name="enterpriseName">
          <enterpriseName :enterpriseName="dataDetail.enterpriseName" :enterpriseId="enterpriseId"></enterpriseName>
        </uni-forms-item>
        <uni-forms-item label="企业性质" labelWidth="100" name="enterpriseKindName">
          <view class="uni-list-cell-left">{{ dataDetail.enterpriseKindName }}</view>
        </uni-forms-item>
        <uni-forms-item label="公司规模" labelWidth="100" name="enterpriseScaleName">
          <view class="uni-list-cell-left">{{ dataDetail.enterpriseScaleName }}</view>
        </uni-forms-item>
        <uni-forms-item label="所属行业" labelWidth="100" name="enterpriseTradeName">
          <view class="uni-list-cell-left">{{ dataDetail.enterpriseTradeName }}</view>
        </uni-forms-item>
        <uni-forms-item label="企业地址" labelWidth="100" name="enterpriseAddress">
          <view class="uni-list-cell-left">{{ dataDetail.enterpriseAddress }}</view>
        </uni-forms-item>
      </view>
    </uni-forms>

  </view>
</template>

<script>
import {
  getDeliveryPass,
  addCampusShare
} from '@/apis/api.js'
import common from '@/utils/common.js'
import {
  getOpenId
} from '@/utils/util.js'
import sectionHeader from '@/components/sectionHeader.vue'
import enterpriseName from '@/components/enterpriseName.vue'
export default {
  components: {
    sectionHeader,
    enterpriseName
  },
  data () {
    return {
      enterpriseId: null,
      postId: null,
      subscribePostId: null,
      subscribeEnterpriseId: null,
      isShowRecommend: false,
      userId: null,
      fromOpenid: null,
      fromUserId: null,
      campusAmbassadorId: null,
      dataDetail: {
        enterpriseName: '',
        enterpriseKindName: '',
        enterpriseScaleName: '',
        enterpriseTradeName: '',
        enterpriseAddress: '',
        positionName: '',
        workPlace: '',
        salary: '',
        recruitmentNum: '',
      },
    }
  },
  onLoad (openValue) {
    uni.showLoading({
      title: '正在加载...',
      mask: true
    })
    // 监听登录，登录结束关闭loading
    let inter = setInterval(() => {
      let isLogin = getApp().globalData.isLogin
      if (isLogin) {
        clearInterval(inter)
        uni.hideLoading()
      }
    }, 300)

    let str = openValue.detail

    if (str) {
      // 解码
      str = decodeURI(str)
      let data = JSON.parse(str)
      this.dataDetail.enterpriseName = data.enterpriseName
      this.enterpriseId = data.enterpriseId
      this.postId = data.postId
      this.fromOpenid = data.openid
      this.fromUserId = data.userId
      this.campusAmbassadorId = data.campusAmbassadorId
      this.subscribePostId = data.subscribePostId || null //岗位订阅
      this.dataDetail.positionName = data.positionName
      this.dataDetail.workPlace = data.workPlace
      this.dataDetail.salary = data.salary
      this.dataDetail.recruitmentNum = data.recruitmentNum
      this.dataDetail.enterpriseKindName = data.enterpriseKindName
      this.dataDetail.enterpriseScaleName = data.enterpriseScaleName
      this.dataDetail.enterpriseAddress = data.enterpriseAddress
      this.dataDetail.enterpriseTradeName = data.enterpriseTradeName
      this.initData()
    }

  },
  methods: {
    async initData () {
      this.isShowRecommend = false
      let openid = await getOpenId()
      console.log('openid', openid)
      if (openid) {
        getDeliveryPass({
          postId: this.postId,
          openid: openid,
        }).then(res => {
          console.log('getDeliveryPass', res)
          // 没有投递简历
          if (res && res.statusCode == 200 && res.data && !res.data.data) {
            this.isShowRecommend = true
          }
        })
        // 推荐进来的保持数据同步
        addCampusShare({
          fromOpenid: this.fromOpenid,
          postId: this.postId,
          toOpenid: openid,
          campusAmbassadorId: this.campusAmbassadorId,
          fromStudentId: this.fromUserId

        }).then(res => {
          console.log('推荐进来的保持数据同步', res)
        })
      }
    },

    dialogConfirm () {
      console.log('点击确认')
      this.$refs.alertDialog.close()
      uni.navigateTo({
        url: '/pages/login/loginMain?detail' + this.detailStr
      })
    },
    dialogClose () {
      this.$refs.alertDialog.close()
    },
    openMain () {
      uni.switchTab({ url: '/pages/main/main' })
    },
    async saveData () {
      let globalData = getApp().globalData;
      let isLogin = globalData.isLogin
      // 说明登录接口还没返回消息
      if (!isLogin) {
        return
      }
      // 如果返回为空，则说明登录成功
      if (!(globalData.wxUser && globalData.wxUser.openid)) {
        this.$refs.alertDialog.open()
        return
      }
      uni.navigateTo({
        url: '/pages/resumeDetail/resumeDetail?postId=' + this.postId +
          '&enterpriseId=' + this.enterpriseId +
          '&enterpriseName=' + this.dataDetail.enterpriseName +
          '&fromOpenid=' + this.fromOpenid +
          '&positionName=' + this.dataDetail.positionName
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.details {
  width: 750rpx;
  height: 100vh;
  overflow: auto;

  .detail-form {
    padding: 5rpx 5rpx;
    width: 680rpx;
    margin-left: 50rpx;

    .position-main-info {
      display: block;
      margin-left: 5rpx;
      margin-bottom: 10rpx;
    }

    .position-name {
      clear: both;
      font-size: 50rpx;
      font: bold;
    }

    .additional-info {
      display: block;
    }

    .position-salary {
      font-size: 35rpx;
      font: bold;
      float: right;
      color: $uni-color-primary;
    }

    .position-others {
      font-size: 30rpx;
      color: gray;
      float: left;
    }

    .position-description-box {
      margin-bottom: 10px;
    }

    .position-label {
      font-size: 35rpx;
      font: bold;
      margin-bottom: 2px;
    }

    .position-major-tag {
      background-color: #fff;
      margin-bottom: 20rpx;
      margin-inline: 8rpx;
      border: 1px solid $uni-color-primary;
      padding: 2rpx 8rpx;
      height: 32rpx;
      line-height: 32rpx;
      border-radius: 8rpx;
      font-size: 24rpx;
      color: $uni-color-primary;
    }

    .position-description {
      color: gray;
      font-size: 30rpx;
      margin-bottom: 25px;
    }

    .uni-list-cell-left {
      // border: 1px solid #DCDFE6;
      color: $uni-color-primary;
      border-radius: 4px;
      //height: 32px;
      line-height: 32px;
      padding: 0px 0px;

      .uni-forms-item__label {
        color: $uni-color-primary;
      }
    }
  }

  .bottom-btns {
    margin: 0rpx 20rpx;

    button {
      background-color: $uni-color-primary;
    }
  }
}
</style>
<style lang="scss">
.details {
  .uni-forms-item {
    margin-bottom: 4px;
  }
}
</style>

