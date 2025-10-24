<template>
  <view class="interview">
    <view class="interview-form"
          v-if="current == '0'">
      <view>
        <sectionHeader>基本信息</sectionHeader>
        <calendarDetail :detail="detail"></calendarDetail>
      </view>
      <view>
        <sectionHeader>接受邀请</sectionHeader>
        <uni-forms :modelValue="formData">
          <view class="resume-detail-form">
            <uni-forms-item required
                            label="接受邀请"
                            name="interviewInvitation"
                            labelWidth="100">
              <uni-data-checkbox v-model="formData.interviewInvitation"
                                 mode="tag"
                                 :selectedColor="uniColorPrimary"
                                 :disabled="formData.disabled"
                                 :localdata="interviewInvitationStatus" />
            </uni-forms-item>
            <uni-forms-item :label="intervieweeRemarkLabel"
                            name="remark"
                            labelWidth="100">
              <uni-easyinput type="text"
                             v-model="formData.remark"
                             :disabled="formData.disabled"
                             :placeholder="intervieweeRemarkPlaceHolder" />
            </uni-forms-item>
          </view>
        </uni-forms>
      </view>
    </view>
    <view class="interview-form"
          v-else>
      <sectionHeader>{{detail.enterpriseName || '企业'}}的消息</sectionHeader>
      <view style="margin: 10rpx; border-radius: 20rpx; min-height: 50rpx; padding: 10rpx;">
        <text style="margin-right:20px">联系人员:</text>{{detail.principal || ''}}
      </view>
      <view style="margin: 10rpx; border-radius: 20rpx; min-height: 50rpx; padding: 10rpx;">
       <text style="margin-right:20px">联系方式:</text>{{detail.phone || ''}}
      </view>
      <view style="margin: 20rpx;border: 1px solid #A5A4A4; border-radius: 20rpx; min-height: 100rpx; padding: 10rpx;">
        {{detail.content || '无'}}
      </view>
      <view style="margin: 20rpx;"
            v-if="baseUrl && detail && detail.url">
        <image style="width: 670rpx; height: 600rpx;background-color: #eeeeee;"
               mode="aspectFit"
               :src="baseUrl + detail.url"></image>
      </view>
      <view v-if=" current != 1">
        <sectionHeader>接受邀请</sectionHeader>
        <uni-forms :modelValue="formOfferData">
          <view class="resume-detail-form">
            <uni-forms-item label="接受邀请"
                            name="receiveOffer"
                            labelWidth="100">
              <uni-data-checkbox v-model="formOfferData.receiveOffer"
                                 mode="tag"
                                 :disabled="formOfferData.disabled"
                                 :localdata="offerStatus" />
            </uni-forms-item>
            <uni-forms-item label="拒绝理由"
                            name="refuseOfferReason"
                            v-if="formOfferData.receiveOffer == offerStatus[1].value">
              <uni-easyinput type="text"
                             v-model="formOfferData.refuseOfferReason"
                             :disabled="formOfferData.disabled"
                             placeholder="请输入拒绝理由" />
            </uni-forms-item>
          </view>
        </uni-forms>
      </view>
    </view>
    <view class="interview-btns"
          v-if="(!formData.disabled && current == 0) || (!formOfferData.disabled && current == 2)">
      <button type="primary"
              @click="submitForm">提交</button>
    </view>
  </view>
</template>

<script>
import {
  saveInterview, saveOffer, saveInfo
} from '@/apis/api.js'
import {
  baseUrl
} from '@/apis/request.js'
import sectionHeader from '@/components/sectionHeader.vue'
import calendarDetail from '@/components/calendarDetail.vue'
import { formatDate } from "../../../uni_modules/uni-dateformat/components/uni-dateformat/date-format";

const interviewInvitationStatus = [{
  value: '2',
  text: '接受'
},
{
  value: '3',
  text: '拒绝'
},
{
  value: '4',
  text: '另选时间'
}
]

const offerStatus = [{
  value: '1',
  text: '同意'
},
{
  value: '2',
  text: '拒绝'
}
]
export default {
  components: {
    sectionHeader,
    calendarDetail
  },
  data () {
    return {
      uniColorPrimary: "#34acc3",
      interviewInvitationStatus,
      offerStatus,
      current: 0,
      baseUrl,
      detail: {},
      formData: {
        id: null,
        studentDeliveryId: null,
        processStepId: null,
        interviewInvitation: '',
        remark: ''
      },
      formOfferData: {
        id: null,
        studentDeliveryId: null,
        receiveOffer: '1',
        refuseOfferReason: ''
      },
      intervieweeRemarkLabel: "备注消息",
      intervieweeRemarkPlaceHolder: "向企业反馈备注信息"
    };
  },

  watch: {
    formData: {
      handler (vewValue, oldValue) {
        if (vewValue.interviewInvitation == 4) {
          this.intervieweeRemarkLabel = "另选时间"
          this.intervieweeRemarkPlaceHolder = "告诉企业您想另选的时间"
        } else {
          this.intervieweeRemarkLabel = "备注消息"
          this.intervieweeRemarkPlaceHolder = "向企业反馈备注信息"
        }
      },
      immediate: true,
      deep: true
    }
  },

  onLoad (openValue) {
    let str = openValue.detail || '{}'
    this.detail = JSON.parse(str)
    this.current = openValue.current || 0
    if (this.current == 0) {
      this.formData.id = this.detail.id
      this.formData.studentDeliveryId = this.detail.studentDeliveryId
      this.formData.processStepId = this.detail.processStepId
      let interviewInvitation = this.detail.interviewInvitation
      if (interviewInvitation == '2' || interviewInvitation == '3' || interviewInvitation == '4') {
        this.formData.interviewInvitation = interviewInvitation
        this.formData.disabled = true
      } else {
        this.formData.interviewInvitation = '2'
        this.formData.disabled = false
      }
    } else if (this.current == 2) {
      this.formOfferData.id = this.detail.id
      this.formOfferData.studentDeliveryId = this.detail.studentDeliveryId
      let receiveOffer = this.detail.receiveOffer
      if (receiveOffer == '1' || receiveOffer == '2') {
        this.formOfferData.receiveOffer = receiveOffer
        this.formOfferData.disabled = true
      } else {
        this.formOfferData.receiveOffer = '1'
        this.formOfferData.disabled = false
      }
    }
    setTimeout(() => {
      this.saveInfoData()
    }, 3000)
  },
  methods: {
    async submitForm () {
      try {
        if (this.current == 0) {
          let res = await saveInterview(this.formData)
          if (res && res.code == 200) {
            uni.navigateBack()
          } else {
            uni.showToast({
              title: res.msg || '操作失败!',
              icon: 'none'
            })
          }
        } else if (this.current == 2) {
          let res = await saveOffer(this.formOfferData)
          if (res && res.code == 200) {
            uni.navigateBack()
          } else {
            uni.showToast({
              title: res.msg || '操作失败!',
              icon: 'none'
            })
          }
        }
      } catch (err) {
        uni.showToast({
          title: '操作失败!',
          icon: 'none'
        })
      }

    },
    async saveInfoData () {
      let param = { id: this.detail.id, readed: 1 }
      if (this.current == 1) {
        let res = await saveInfo(param)
        if (res && res.code == 200) {
        }
      } else if (this.current == 2) {
        let res = await saveOffer(param)
        if (res && res.code == 200) {
        }
      }
    }
  }
}
</script>

<style lang="scss">
.interview {
  padding: 30rpx 20rpx;
  overflow: hidden;

  .resume-detail-form {
    padding: 10rpx 20rpx;
    width: 660rpx;
    overflow: hidden;
  }

  .interview-form {
    height: calc(100vh - 140rpx);
    overflow-y: auto;
    overflow-x: hidden;
  }

  .interview-btns {
    display: flex;
    align-items: center;
    justify-content: center;

    button {
      width: 90%;
      background-color: $uni-color-primary;
    }
  }
}
</style>
