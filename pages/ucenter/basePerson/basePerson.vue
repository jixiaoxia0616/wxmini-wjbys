<template>
  <view>

    <personForm ref="personForm"
                v-if="active==0"
                :userInfo="userInfo"
                :propData="propData"
                :job="job"
                @saveSuccess="saveSuccessPerson">
    </personForm>

    <experience ref="experience"
                v-if="active==1"
                :userInfo="userInfo"
                :openid="propData.openid"
                @saveSuccess="saveSuccessExperience">
    </experience>
    <view class="base-person-btns">
      <button type="primary"
              @click="submitForm">保存</button>
    </view>
  </view>
</template>

<script>
import {
  login
} from '@/utils/util.js'
import common from '@/utils/common.js'
import sectionHeader from '@/components/sectionHeader.vue'
import personForm from '@/components/personForm.vue'
import experience from '@/components/experience.vue'

export default {
  components: {
    sectionHeader,
    personForm,
    experience
  },
  data () {
    return {
      active: 0,
      job: false,
      userInfo: {},
      propData: {}
    };
  },
  onLoad (openValue) {
    this.active = openValue.type || 0
    this.job = openValue.job || false
    let wxUser = getApp().globalData.wxUser
    this.userInfo.openid = wxUser.openid
    this.userInfo.avatarUrl = wxUser.avatarUrl
    this.userInfo.nickName = wxUser.nickName
    this.userInfo.type = wxUser.type

    if (openValue.type == 1) {
      uni.setNavigationBarTitle({ title: '教育经历' })
      this.propData.openid = wxUser.openid
    } else {
      uni.setNavigationBarTitle({ title: '个人信息' })
      if (this.job) {
        uni.setNavigationBarTitle({ title: '期望职位' })
      }
      if (wxUser) {
        this.propData.openid = wxUser.openid
        this.propData.studentName = wxUser.studentName
        this.propData.sex = wxUser.sex || '0'
        this.propData.phoneNumber = wxUser.phoneNumber
        this.propData.identificationNumber = wxUser.identificationNumber
        this.propData.graduationTime = wxUser.graduationTime || common.formateDate(new Date())
        this.propData.email = wxUser.email
        this.propData.expectedJobs = wxUser.expectedJobs
      }
    }
  },
  methods: {
    submitForm () {
      if (this.active == 0) {
        this.$refs['personForm'] && this.$refs['personForm'].submitForm()
      } else {
        this.$refs['experience'] && this.$refs['experience'].submitUpdateForm()
      }
    },
    saveSuccessPerson () {
      uni.showToast({
        title: '个人信息修改成功!',
        icon: 'success'
      })
      login()
      this.$nextTick(() => {
        uni.navigateBack()
      })
    },
    saveSuccessExperience () {
      uni.showToast({
        title: '教育经历修改成功!',
        icon: 'success'
      })
      this.$nextTick(() => {
        uni.navigateBack()
      })
    }
  }
}
</script>

<style lang="scss">
.base-person-btns {
  display: flex;
  align-items: center;
  justify-content: center;

  button {
    width: 90%;
    background-color: $uni-color-primary;
  }
}
</style>
