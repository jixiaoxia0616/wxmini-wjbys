<template>
  <view class="base-person">
    <view style="display: flex;
    padding: 20px 10px;
    align-items: center;
    justify-content: space-between;">
      <h1 style="font-size:24px;font-weight:700">想找什么工作?</h1>
      <text><text style="margin-right:5px;"
              class="textNum">{{expectedJobList.length||0}}</text> <text style="margin-right:5px;">/</text> 7</text>
    </view>
    <view class="text-title">
      <text>添加多个求职期望,可获得更多精准高薪工作机会</text>
    </view>
    <expectedJobs ref="expectedJobs"
                  :list="expectedJobList"
                  @saveSuccess="saveSuccess">
    </expectedJobs>
  </view>
</template>

<script>
import SectionHeader from '@/components/sectionHeader.vue';
import expectedJobs from "@/components/expectedJobs";
import {
  saveStudent
} from '@/apis/api.js'
import {
  login
} from '@/utils/util.js'
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
      uniColorPrimary: "#34acc3",
      defaultJson: '',
      expectedJobList: [],
    };
  },
  mounted () {
    console.log('getApp().globalData.wxUser.expectedJobs', getApp().globalData.wxUser.expectedJobs)
    if (getApp().globalData.wxUser) {
      let expectedJobsStr = getApp().globalData.wxUser.expectedJobs
      if (expectedJobsStr) {
        this.defaultJson = expectedJobsStr
        let expectedJobList = JSON.parse(expectedJobsStr)
        this.expectedJobList = expectedJobList
        this.$nextTick(() => {
          this.$refs.expectedJobs.setExpectedJobs(this.expectedJobList)
        })
      }
    }
  },
  beforeDestroy () {
    this.submitForm()
    console.log('beforeDestroy')
  },
  methods: {
    submitForm () {
      console.log('保存')
      setTimeout(() => {
        this.saveData()
      }, 100);
    },
    async saveData () {
      try {
        let data = {}
        data = getApp().globalData.wxUser
        data.expectedJobs = JSON.stringify(this.expectedJobList || [])
        if (this.defaultJson !== data.expectedJobs) {
          let res = await saveStudent(data)
          if (res && res.data && res.data.code == 200) {
            await login()
            // Notify main page to refresh
            uni.$emit('expectedJobsUpdated')
          }
        }

      } catch (err) {
        console.error('Save expected jobs error:', err)
      }
    },
    saveSuccess (list) {
      this.expectedJobList = list || []
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

.base-person {
  .textNum {
    color: $uni-color-primary;
  }
  .text-title {
    font-size: 13px;
    color: #999;
    margin-top: 15px;
    margin-left: 10px;
  }
}
</style>
