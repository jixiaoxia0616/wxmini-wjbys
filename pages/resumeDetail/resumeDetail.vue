<template>
  <view class="resume-detail">
    <uni-forms :modelValue="formData" ref="baseForm" :rules="baseRules">
      <sectionHeader>基本信息</sectionHeader>
      <view class="resume-detail-form">
        <uni-forms-item required label="姓名" labelWidth="100" name="studentName">
          <view class="uni-list-cell-left">{{ formData.studentName || '' }}</view>
        </uni-forms-item>
        <uni-forms-item required
                        name="phoneNumber"
                        label="联系方式"
                        labelWidth="100">
          <view
              style="display: flex;width: calc(100% - 2px);height:35px;align-items: center;justify-content: space-between; border: 1px solid #DCDFE6;border-radius: 4px;">
            <view style="width: calc(100% - 125px);padding-left:10px"> {{ formData.phoneNumber || '' }}</view>
            <button type="primary"
                    size="mini"
                    class="add-button"
                    style="margin-right: 5rpx;width:100px;"
                    open-type="getPhoneNumber"
                    @getphonenumber="getPhoneNumber">获取手机号
            </button>
          </view>
        </uni-forms-item>
        <uni-forms-item required name="email" label="电子邮箱" labelWidth="100">
          <uni-easyinput type="text" v-model="formData.email" placeholder="请输入电子邮箱" :clearable="false"/>
        </uni-forms-item>
        <uni-forms-item required label="学校名称" name="schoolName" labelWidth="100">
          <uni-easyinput type="text" v-model="formData.schoolName" readonly placeholder="请输入学校"
                         :clearable="false"/>
          <!--					<view class="uni-list-cell-left">{{formData.schoolName}}</view>-->
        </uni-forms-item>
        <uni-forms-item required name="major" label="所学专业" labelWidth="100">
          <uni-easyinput type="text" v-model="formData.major" placeholder="请输入专业" :clearable="false"/>
          <!--					<view class="uni-list-cell-left">{{formData.major}}</view>-->
        </uni-forms-item>
        <uni-forms-item required label="应聘企业" name="enterpriseName" labelWidth="100">
          <view class="uni-list-cell-left">{{ formData.enterpriseName }}</view>
        </uni-forms-item>
        <uni-forms-item required label="应聘岗位" name="positionName" labelWidth="100">
          <view class="uni-list-cell-left">{{ formData.positionName }}</view>
        </uni-forms-item>
      </view>
      <sectionHeader>简历附件</sectionHeader>
      <view class="resume-detail-form">
        <uni-forms-item required name="resume" label="简历附件" labelWidth="200">
          <uni-file-picker v-model="filesvalue" return-type="object" file-mediatype="all" mode="grid"
                           file-extname="docx,doc,pdf,jpeg,png,jpg,gif" :limit="1" @select="select" @delete="delFile">
            <button class="resume-btn" size="mini">选择文件</button>
          </uni-file-picker>
        </uni-forms-item>

        <uni-forms-item required name="publicStatus" label="是否向其他企业公开你的简历" labelWidth="300">
          <picker @change="bindPickerChange" :value="publicStatusIndex" :range="publicStatus" range-key="dictLabel">
            <view class="uni-list-cell-left">{{ formData.publicStatusName }}</view>
          </picker>
        </uni-forms-item>
      </view>
      <view class="resume-detail-form">
        <button class="resume-btn" type="primary" @click="saveData">投递简历</button>
      </view>
    </uni-forms>
  </view>
</template>

<script>
import {
  getEducationList,
  uploadFile,
  saveDelivery,
  saveStudent
} from '@/apis/api.js'
import {
  getPhone
} from '@/utils/util.js'
import sectionHeader from '@/components/sectionHeader.vue'
import UniFilePicker from "../../uni_modules/uni-file-picker/components/uni-file-picker/uni-file-picker";
import {
  openSubscribeAuth
} from "../../common/util";

const publicStatus = [{
  dictLabel: '是',
  dictValue: '1'
},
  {
    dictLabel: '否',
    dictValue: '0'
  }
]
const filesvalue = {
  name: '',
  fileName: '',
  extname: '',
  url: ''
}
export default {
  components: {
    UniFilePicker,
    sectionHeader
  },
  data() {
    return {
      publicStatus: publicStatus,
      publicStatusIndex: 0,
      postId: null,
      enterpriseId: null,
      openid: null,
      studentId: null,
      fromOpenid: null,
      formData: {
        studentName: '',
        phoneNumber: '',
        email: '',
        schoolName: '',
        major: '',
        enterpriseName: '',
        positionName: '',
        publicStatus: publicStatus[0].dictValue,
        publicStatusName: publicStatus[0].dictLabel,
        resume: '',

      },
      filesvalue: {},
      baseRules: {
        studentName: {
          rules: [{
            required: true,
            errorMessage: '请输入姓名',
          }]
        },
        phoneNumber: {
          rules: [{
            required: true,
            errorMessage: '请输入手机号',
          }]
        },
        schoolName: {
          rules: [{
            required: true,
            errorMessage: '请输入毕业学校',
          }]
        },
        email: {
          rules: [{
            required: true,
            errorMessage: '请输入邮箱',
          },
            {
              format: 'email',
              errorMessage: '请输入正确的邮箱地址',
            }
          ]
        },
        major: {
          rules: [{
            required: true,
            errorMessage: '请输入专业',
          }]
        },
        resume: {
          rules: [{
            required: true,
            errorMessage: '请选择简历附件',
          }]
        },
      }
    }
  },
  onLoad(openValue) {
    console.log('openvalue', openValue)
    this.postId = openValue.postId
    this.fromOpenid = openValue.fromOpenid
    this.enterpriseId = openValue.enterpriseId
    let userInfo = getApp().globalData.wxUser
    this.formData.studentName = userInfo.studentName
    this.formData.phoneNumber = userInfo.phoneNumber
    this.formData.email = userInfo.email
    this.formData.enterpriseName = openValue.enterpriseName
    this.formData.positionName = openValue.positionName
    this.openid = userInfo.openid
    this.studentId = userInfo.id
    getApp().globalData.educationId = null
    this.getEducations()
  },
  methods: {
    bindPickerChange(e) {
      if (e.detail.value !== undefined) {
        let publicStatusIndex = Number(e.detail.value)
        this.publicStatusIndex = publicStatusIndex
        let data = this.publicStatus[publicStatusIndex]
        this.formData.publicStatus = data.dictValue
        this.formData.publicStatusName = data.dictLabel
      } else {
        this.formData.publicStatus = null
        this.formData.publicStatusName = ''
      }
    },
    async saveData() {
      if (!getApp().isLogin()) {
        return
      }
      this.$refs.baseForm.validate().then(async data => {
        let param = this.formData
        param.postId = this.postId
        param.enterpriseId = this.enterpriseId
        param.openid = this.openid
        param.resume = param.resume
        param.studentId = this.studentId
        // 则说明是推荐进来的
        if (this.fromOpenid) {
          param.fromOpenid = this.fromOpenid
        }
        console.log('delivery params', param)
        let res = await saveDelivery(param)
        if (res && res.data && res.data.code === 200) {
          getApp().globalData.educationId = this.postId
          uni.showToast({
            title: '简历投递成功!',
            icon: 'success'
          })
          //向用户发送推送消息请求
          openSubscribeAuth();
          let current = getApp().globalData.currentPate
          if (current == 'pages/main/main') {
            uni.switchTab({
              url: '/pages/main/main'
            })
          } else {
            let list = getCurrentPages()
            let index = 0
            for (let i = list.length - 1; i >= 0; i--) {
              if (list[i].route == 'pages/recruitmentConference/talentCenterRecruitmentDetails') {
                break
              }
              index += 1
            }
            uni.navigateBack({
              delta: index
            })
          }
        } else {
          console.log('投递失败，返回错误消息：', res.data.msg);
          uni.showModal({
            title: '简历投递失败',
            content: '投递简历过程中发生了错误，请联系管理员',
            showCancel: false,  // 只显示“确认”按钮
            confirmText: '确认'
          })
        }
      }).catch(err => {
        console.log('投递失败：', err);
        uni.showToast({
          title: '投递失败',
          message: "请联系管理员:" + res.data.msg,
          icon: 'error'
        })
      })
    },
    async getEducations() {
      if (!this.openid) {
        return
      }
      let res = await getEducationList({
        openid: this.openid
      })
      if (res && res.data && res.data.code == 200 && res.data.rows && res.data.rows.length) {
        let data = res.data.rows[res.data.rows.length - 1]
        console.log('school data', res.data)
        this.formData.schoolName = data.schoolName
        this.formData.major = data.studentMajor
      }
    },
    delFile() {
      this.formData.resume = ''
    },

    // 获取手机号
    async getPhoneNumber(e) {
      let phone = await getPhone(e.detail.code)
      this.formData.phoneNumber = phone
      getApp().globalData.wxUser.phoneNumber = phone
      await this.saveStudentPhone(phone)
    },

    async saveStudentPhone(phone) {
      const data = {
        openid: this.openid,
        phoneNumber: phone,
        id: this.studentId
      }
      console.log("保存用户手机号 ->", data)
      let res = await saveStudent(data)
      if (res && res.data && res.data.code === 200) {
        console.log('保存手机号成功:', phone);
      } else {
        console.error('保存手机号失败:', res?.data?.msg || '未知错误')
      }
    },

    async select(e) {
      console.log('select', e)
      let file = await uploadFile(e.tempFilePaths)
      if (file && e.tempFiles && e.tempFiles.length) {
        let tempFile = e.tempFiles[0]
        this.formData.resume = file.name
        this.$set(this, 'filesvalue', {
          name: tempFile.name,
          fileName: file.name,
          extname: tempFile.extname,
          url: file.url
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.resume-detail {
  width: 750rpx;
  height: 100vh;
  overflow: auto;

  .resume-detail-form {
    padding: 10rpx 20rpx;
    width: 700rpx;

    .uni-list-cell-left {
      border: 1px solid #DCDFE6;
      border-radius: 4px;
      height: 32px;
      line-height: 32px;
      padding: 0 12px;
    }
  }
}

.resume-btn {
  background-color: $uni-color-primary;
  border-color: $uni-color-primary;
  color: $uni-bg-color;
}

.add-button {
  width: 90%;
  color: #fff;
  background-color: $uni-color-primary;
}
</style>
