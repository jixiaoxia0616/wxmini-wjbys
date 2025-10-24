<template>
  <view class="base-person">
    <sectionHeader>教育经历</sectionHeader>
    <view class="base-person-form">
      <uni-forms :modelValue="educationData" ref="educationForm" :rules="educationRules">
        <uni-forms-item required label="本人学历" name="studentEducation" labelWidth="100">
          <picker @change="bindPickerChange('studentEducation',$event)" :value="index" :range="studentEducations"
                  range-key="dictLabel">
            <view class="uni-list-cell-left">{{ educationData.studentEducationName }}</view>
          </picker>
        </uni-forms-item>
        <uni-forms-item required label="学校名称" name="schoolId" labelWidth="100">
          <view @click="open('school')" class="uni-list-cell-left">{{ educationData.schoolName }}</view>
          <uni-popup ref="popupSchool" type="bottom" background-color="#fff" style="width: 700rpx;">
            <uni-easyinput v-model="schoolVal" inputBorder suffixIcon="search" @iconClick="querySchool"
                           placeholder="请输入学校名称" trim></uni-easyinput>
            <view style="height: 760rpx;overflow-y: auto;">
              <uni-list :border="true" style="overflow-y: auto;">
                <uni-list-chat v-for="(item,index) in schoolList" :key="index" :title="item.name"
                               :avatar="item.logo" clickable @click="submitschool(item)" :note="item.address"
                               :time="item.province"></uni-list-chat>
              </uni-list>
            </view>
          </uni-popup>
        </uni-forms-item>
        <uni-forms-item required label="所学专业" name="studentMajorId" labelWidth="100">
          <view @click="open('major')" class="uni-list-cell-left">{{ educationData.studentMajor }}</view>
          <uni-popup ref="popupMajor" type="bottom" background-color="#fff" style="width: 700rpx;">
            <uni-easyinput v-model="majorVal" inputBorder suffixIcon="search" @iconClick="queryMajors"
                           placeholder="请搜索或选择所学专业" trim>
            </uni-easyinput>
            <view style="height: 680rpx;overflow-y: auto;">
              <uni-list :border="true" style="overflow-y: auto;">
                <uni-list-item v-for="(item,index) in filteredMajors" :key="index" :title="item.specialName"
                               clickable @click="changestudentMajor(item)"></uni-list-item>
              </uni-list>
            </view>
            <view class="custom-major">
              <uni-easyinput v-if="showCustomMajor" v-model="customMajorVal" inputBorder
                             placeholder="请输入专业名称" trim>
              </uni-easyinput>
              <button v-if="showCustomMajor" class="confirm-btn" @click="submitCustomMajor">确认</button>
              <button v-else class="custom-btn" @click="showCustomMajorInput">未找到专业？点击手动输入</button>
            </view>
          </uni-popup>
        </uni-forms-item>
        <!--        <uni-forms-item name="studentExperience" label="实践经历" labelWidth="100">-->
        <!--          <uni-easyinput v-model="studentExperienceName" inputBorder type="textarea"-->
        <!--                         placeholder="请输入你的实践经历" trim>-->
        <!--          </uni-easyinput>-->
        <!--        </uni-forms-item>-->
      </uni-forms>
    </view>

  </view>
</template>

<script>
import {
  saveEducation,
  updateEducation,
  getEducationList,
  getDictList,
  getSpiderInfoList,
  getSpiderListBySchoolId
} from '@/apis/api.js'
import {
  debounce
} from '@/common/util.js'
import SectionHeader from '@/components/sectionHeader.vue';
export default {
  name: "experience",
  components: {
    SectionHeader
  },
  props: {
    userInfo: Object,
    openid: String,
  },
  data() {
    return {
      studentEducations: [],
      experiences: [],
      schoolVal: '',
      schoolList: [],
      majorVal: '',
      spiderSchoolSpecials: [],
      filteredMajors: [],
      educationData: {
        schoolId: null,
        schoolName: '',
        studentEducation: null,
        studentEducationName: '',
        studentExperience: null,
        studentExperienceName: '',
        studentMajorId: null,
        studentMajor: ''

      },
      educationRules: {
        schoolId: {
          rules: [{
            required: true,
            errorMessage: '请选择学校名称',
          }]
        },
        studentMajor: {
          rules: [{
            required: true,
            errorMessage: '请选择所学专业',
          }]
        },
        studentEducation: {
          rules: [{
            required: true,
            errorMessage: '请选择学历',
          }]
        },
        // studentExperience: {
        //   rules: [{
        //     required: false,
        //     errorMessage: '请输入实践经验（选填）',
        //   }]
        // },
      },
      showCustomMajor: false,
      customMajorVal: ''
    };
  },
  created: function () { //option为object类型，会序列化上个页面传递的参数
    this.initData()

  },
  mounted() {
    this.getEducations()
    this.$watch(
        'schoolVal',
        (newVal, oldVal) => {
          if (newVal !== oldVal) {
            this.querySchool()
          }
        }
    )
    this.$watch(
        'majorVal',
        (newVal, oldVal) => {
          if (newVal !== oldVal) {
            this.filterMajors()
          }
        }
    )
  },
  methods: {
    open(type) {
      if (type == 'school') {
        this.$refs.popupSchool.open()
        this.$nextTick(() => {
          this.schoolVal = ''
          this.schoolList = []
          if (!this.schoolVal) {
            this.querySchool()
          }
        })
      } else if (type == 'major') {
        if (this.educationData.schoolId) {
          this.$refs.popupMajor.open()
          this.$nextTick(() => {
            this.queryMajors()
          })
        }
      }
    },
    submitschool(school) {
      if (school && school.id) {
        this.educationData.schoolId = school.id
        this.educationData.schoolName = school.name.trim()
        this.$refs.popupSchool.close()
        this.queryMajors()
      }
    },
    changestudentMajor(data) {
      if (data && data.id) {
        this.educationData.studentMajorId = data.id
        this.educationData.studentMajor = data.specialName
        this.$refs.popupMajor.close()
      }
      this.$nextTick(function () {
        this.binddata('studentMajorId', this.educationData.studentMajorId)
      })
    },
    binddata(name, value) {
      this.$refs.educationForm.setValue(name, value)
    },
    async querySchool() {
      let list = await getSpiderInfoList({
        name: this.schoolVal || '',
        pageNum: 1,
        pageSize: 100
      })
      this.schoolList = list
    },
    async queryMajors() {
      this.spiderSchoolSpecials = []
      let data = await getSpiderListBySchoolId(this.educationData.schoolId)
      if (data && data.spiderSchoolSpecials) {
        this.spiderSchoolSpecials = data.spiderSchoolSpecials || []
        this.filteredMajors = this.spiderSchoolSpecials
      }
    },

    async filterMajors() {
      if (this.majorVal && this.majorVal.trim() != '') {
        this.filteredMajors = this.spiderSchoolSpecials.filter(item => item.specialName.includes(this.majorVal));
      } else {
        this.filteredMajors = this.spiderSchoolSpecials
      }
      console.error("filtered majors", this.filteredMajors)
    },

    async initData() {
      getDictList('studentEducation').then(res => {
        if (res && res.data && res.data.code == 200) {
          this.studentEducations = res.data.rows || []
          this.setPickerData()
        }
      })
    },
    setPickerData() {
      if (this.educationData.studentEducation && this.studentEducations && this.studentEducations
          .length) {
        let data = this.studentEducations.find(x => x.dictValue == this.educationData.studentEducation)
        if (data) {
          this.educationData.studentEducation = data.dictValue
          this.educationData.studentEducationName = data.dictLabel
        }
      }
    },
    bindPickerChange(type, e) {
      if (e.detail.value) {
        let index = Number(e.detail.value)
        if (type === 'studentEducation') {
          let data = this.studentEducations[index]
          this.educationData.studentEducation = data.dictValue
          this.educationData.studentEducationName = data.dictLabel
        } else {
          let data = this.experiences[index]
          this.educationData.studentExperience = data.dictValue
          this.educationData.studentExperienceName = data.dictLabel
        }
      } else {
        if (type === 'studentEducation') {
          this.educationData.studentEducation = null
          this.educationData.studentEducationName = ''
        } else {
          this.educationData.studentExperience = null
          this.educationData.studentExperienceName = ''
        }
      }
    },
    submitForm() {
      this.$refs.educationForm.validate().then(async data => {
        data.openid = this.userInfo.openid
        data.id = this.educationData.id || null
        data.schoolId = this.educationData.schoolId || null
        data.studentMajorId = this.educationData.studentMajorId || null
        data.schoolName = this.educationData.schoolName || ''
        data.studentMajor = this.educationData.studentMajor || ''
        console.log("save education ->>", data)
        let res = await saveEducation(data)
        if (res && res.data && res.data.code == 200) {
          this.$emit('saveSuccess')
        }
      }).catch(err => {
        console.log('表单错误信息：', err);
      })
    },
    submitUpdateForm() {
      this.$refs.educationForm.validate().then(async data => {
        data.openid = this.userInfo.openid
        data.id = this.educationData.id || null
        data.schoolId = this.educationData.schoolId || null
        data.studentMajorId = this.educationData.studentMajorId || null
        data.schoolName = this.educationData.schoolName || ''
        data.studentMajor = this.educationData.studentMajor || ''
        console.log("update education ->>", data)
        let res = await updateEducation(data)
        if (res && res.data && res.data.code == 200) {
          this.$emit('saveSuccess')
        }
      }).catch(err => {
        console.log('表单错误信息：', err);
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
        this.educationData.schoolName = data.schoolName
        this.educationData.major = data.studentMajor
        this.educationData.studentMajor = data.studentMajor
        this.educationData.studentEducation = data.studentEducation
        this.educationData.studentExperience = data.studentExperience
        this.educationData.id = data.id
        this.educationData.schoolId = data.schoolId
        this.educationData.studentMajorId = data.studentMajorId
        this.educationData.openid = data.openid
        this.setPickerData()
        if (this.educationData.schoolId) {
          this.queryMajors()
        }
      }
    },
    showCustomMajorInput() {
      this.showCustomMajor = true
    },
    submitCustomMajor() {
      if (this.customMajorVal.trim()) {
        this.educationData.studentMajorId = null
        this.educationData.studentMajor = this.customMajorVal.trim()
        this.$refs.popupMajor.close()
        this.showCustomMajor = false
        this.customMajorVal = ''
      } else {
        uni.showToast({
          title: '请输入专业名称',
          icon: 'none'
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
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
}

.uni-list-cell-left {
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  height: 32px;
  line-height: 32px;
  padding: 0 12px;
}

.experience-btn {
  background-color: $uni-color-primary;
  border-color: $uni-color-primary;
  color: $uni-bg-color;
}

.custom-major {
  padding: 20rpx;
  border-top: 1px solid #eee;
}

.custom-btn {
  margin: 10rpx auto;
  width: 80%;
  background-color: #f5f5f5;
  border: none;
  color: #666;
  font-size: 28rpx;
}

.confirm-btn {
  margin: 20rpx auto;
  width: 80%;
  background-color: #007AFF;
  color: white;
  border: none;
  font-size: 28rpx;
}
</style>
