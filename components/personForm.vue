<template>
  <view class="base-person">
    <sectionHeader v-if="!job">个人信息</sectionHeader>
    <view class="base-person-form"
          v-if="!job">
      <uni-forms :modelValue="formData"
                 ref="baseForm"
                 :rules="baseRules">
        <uni-forms-item required
                        label="用户姓名"
                        name="studentName"
                        labelWidth="100">
          <uni-easyinput type="text"
                         v-model="formData.studentName"
                         placeholder="请输入姓名" />
        </uni-forms-item>
        <uni-forms-item required
                        label="用户性别"
                        name="sex"
                        labelWidth="100">
          <uni-data-checkbox v-model="formData.sex"
                             :selectedColor="uniColorPrimary"
                             :localdata="sexs" />
        </uni-forms-item>
        <uni-forms-item required
                        name="identificationNumber"
                        label="身份证号"
                        labelWidth="100">
          <uni-easyinput type="idcard"
                         v-model="formData.identificationNumber"
                         placeholder="请输入身份证" />
        </uni-forms-item>
<!--        <uni-forms-item required-->
<!--                        name="phoneNumber"-->
<!--                        label="联系方式"-->
<!--                        labelWidth="100">-->
<!--          <view style="display: flex;width: calc(100% - 2px);height:35px;align-items: center;justify-content: space-between; border: 1px solid #DCDFE6;border-radius: 4px;">-->
<!--            <view style="width: calc(100% - 125px);padding-left:10px"> {{formData.phoneNumber || ''}} </view>-->
<!--            <button type="primary"-->
<!--                    size="mini"-->
<!--                    class="add-button"-->
<!--                    style="margin-right: 5rpx;width:100px;"-->
<!--                    open-type="getPhoneNumber"-->
<!--                    @getphonenumber="getPhoneNumber">获取手机号</button>-->
<!--          </view>-->
<!--        </uni-forms-item>-->
        <uni-forms-item required
                        name="graduationTime"
                        label="毕业日期"
                        labelWidth="100">
          <uni-datetime-picker type="date"
                               v-model="formData.graduationTime" />
        </uni-forms-item>
        <uni-forms-item required
                        name="email"
                        label="电子邮箱"
                        labelWidth="100">
          <uni-easyinput type="text"
                         v-model="formData.email"
                         placeholder="请输入电子邮箱" />
        </uni-forms-item>
      </uni-forms>
    </view>
    <sectionHeader>期望的职位</sectionHeader>
    <expectedJobs ref="expectedJobs"
                  :list="expectedJobList"
                  @saveSuccess="saveSuccess">
    </expectedJobs>
  </view>
</template>

<script>
import common from '@/utils/common.js';
import SectionHeader from '@/components/sectionHeader.vue';
import expectedJobs from "@/components/expectedJobs";
import {
  getPhone,
  isValidIDCardNumber
} from '@/utils/util.js'
import {
  saveStudent
} from '@/apis/api.js'

const sexs = [{
  "value": '0',
  "text": "男"
}, {
  "value": '1',
  "text": "女"
}]
export default {
  name: "personForm",
  props: {
    userInfo: Object,
    propData: Object,
    job: {
      type: Boolean,
      default: false
    },
  },
  components: {
    SectionHeader,
    expectedJobs
  },
  data () {
    return {
      sexs,
      uniColorPrimary: "#34acc3",
      expectedJobList: [],
      formData: {
        studentName: '',
        sex: '0',
        phoneNumber: '',
        identificationNumber: '',
        expectedJobs: '',
        graduationTime: common.formateDate(new Date()),
        email: ''
      },
      baseRules: {
        // 对name字段进行必填验证
        studentName: {
          rules: [{
            required: true,
            errorMessage: '请输入姓名',
          },
          {
            minLength: 2,
            maxLength: 15,
            errorMessage: '姓名长度在 {minLength} 到 {maxLength} 个字符',
          }
          ]
        },
        sex: {
          rules: [{
            required: true,
            errorMessage: '请选择性别',
          }]
        },
        // phoneNumber: {
        //   rules: [{
        //     required: false,
        //     errorMessage: '请输入手机号',
        //   }]
        // },
        identificationNumber: {
          rules: [{
            required: true,
            errorMessage: '请输入身份证号',
          },
          {
            validateFunction: function(rule, value, data, callback) {
              if (!isValidIDCardNumber(value)) {
                callback('请输入正确的身份证号码');
              }
              return true;
            }
          }]
        },
        graduationTime: {
          rules: [{
            required: true,
            errorMessage: '请选择毕业日期',
          }]
        },
        // 对email字段进行必填验证
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
        }
      }
    };
  },
  onReady() {
		// 需要在onReady中设置规则
		this.$refs.baseForm.setRules(this.baseRules)
	},
  mounted () {
    if (this.propData && this.propData.openid) {
      this.formData.studentName = this.propData.studentName
      this.formData.sex = this.propData.sex
      this.formData.phoneNumber = this.propData.phoneNumber
      this.formData.identificationNumber = this.propData.identificationNumber
      this.formData.graduationTime = this.propData.graduationTime
      this.formData.email = this.propData.email
      this.formData.expectedJobs = this.propData.expectedJobs
      console.log('his.propData', this.propData)
      if (this.formData.expectedJobs) {
        this.expectedJobList = JSON.parse(this.formData.expectedJobs)
        this.$nextTick(() => {
          this.$refs.expectedJobs.setExpectedJobs(this.expectedJobList)
        })
      }

    }
  },
  methods: {
    submitForm () {
      if (this.job) {
        this.saveData(this.formData)
      } else {
        this.$refs.baseForm.validate().then(async data => {
          this.saveData(data)
        }).catch(err => {
          console.log('表单错误信息：', err);
        })
      }

    },
    async saveData (data) {
      try {
        data.openid = this.userInfo.openid
        data.expectedJobs = this.formData.expectedJobs
        console.log("save data ->", data)
        let res = await saveStudent(data)
        if (res && res.data && res.data.code == 200) {
          this.$emit('saveSuccess')
        }
      } catch (err) {

      }
    },
    getCode () {
      uni.login({
        provider: 'weixin',
        success: loginRes => {
          this.decodePhoneParams.code = loginRes.code
        }
      });
    },
    // 获取手机号
    async getPhoneNumber (e) {
      let phone = await getPhone(e.detail.code)
      this.formData.phoneNumber = phone

    },
    saveSuccess (list) {
      this.expectedJobList = list || []
      this.formData.expectedJobs = JSON.stringify(this.expectedJobList)
      console.log('submitForm', this.expectedJobList, this.formData.expectedJobs)
    }
  }
}
</script>


<style lang="scss">
.base-person {
  padding: 30rpx 20rpx;
  overflow: hidden;

  .base-person-title {
    margin: 30rpx 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .base-person-title-right {
      margin-left: 80rpx;

      view {
        height: 50rpx;
        line-height: 50rpx;
      }
    }
  }
}

.base-person-form {
  margin: 30rpx 40rpx;
  //height: calc(100vh - 300rpx);
  overflow: auto;
  .add-button {
    width: 90%;
    color: #fff;
    background-color: $uni-color-primary;
  }
}
</style>
