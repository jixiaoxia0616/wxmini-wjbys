<template>
  <view class="base-person">
    <view class="base-person-form">
      <uni-list>
        <uni-list-item class="uni-list-item"
                       :key="tag"
                       v-for="tag in expectedJobs"
                       :title="tag"
                       rightText="点击删除"
                       clickable="true"
                       showBadge="true"
                       @click="deleteExpectedJob(tag)" />
      </uni-list>
      <uni-easyinput v-if="expectedJobInputVisible"
                     v-model="newInputExpectedJob"
                     ref="jobTagInput"
                     size="small"
                     focus
                     style="width:100%;margin-top:10px;"
                     @keyup.enter.native="handleNewInputConfirm"
                     @blur="handleNewInputConfirm">
      </uni-easyinput>
      <button class="add-button button-new-tag"
              v-else
              :disabled="!allowNewExpectedJob"
              size="mini"
              style="width:100%;margin-top:10px;"
              @click="showNewExpectedJobInput">+ 添加期望的职位名称
      </button>

    </view>
  </view>
</template>

<script>
import SectionHeader from '@/components/sectionHeader.vue';

export default {
  name: "expectedJobs",
  props: {
  },
  components: {
    SectionHeader
  },
  data () {
    return {
      MAX_EXPECTED_JOBS: 7,
      expectedJobs: [],
      newInputExpectedJob: null,
      expectedJobInputVisible: false
    };
  },

  computed: {
    allowNewExpectedJob () {
      return this.expectedJobs && this.expectedJobs.length < this.MAX_EXPECTED_JOBS
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    setExpectedJobs (list) {
      this.expectedJobs = list || []
    },
    deleteExpectedJob (tag) {
      const index = this.expectedJobs.indexOf(tag);
      if (index > -1) { // only splice array when item is found
        this.expectedJobs.splice(index, 1);
        this.$emit('saveSuccess', this.expectedJobs)// 2nd parameter means remove one item only
      }
    },

    handleNewInputConfirm () {
      let inputJobValue = this.newInputExpectedJob;
      if (inputJobValue) {
        if (this.expectedJobs.indexOf(inputJobValue) < 0) {
          this.expectedJobs.push(inputJobValue);
          this.newInputExpectedJob = '';
        } else {
          this.newInputExpectedJob = '';
          uni.showToast({
            title: '当前职位已存在!',
            icon: 'none'
          })
        }

      }
      this.$emit('saveSuccess', this.expectedJobs)
      this.expectedJobInputVisible = false;
    },
    showNewExpectedJobInput () {
      this.expectedJobInputVisible = true;
      //   this.$nextTick(() => {
      // console.log('this.$refs',this.$refs)
      //     this.$refs.jobTagInput._Focus();
      //   });

    },
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

  .base-person-form {
    margin: 30rpx 40rpx;
    //height: calc(100vh - 300rpx);
    overflow: auto;
    display: block;

    .uni-list-item {
      color: $uni-color-primary;
    }
  }

  .add-button {
    width: 90%;
    color: #fff;
    background-color: $uni-color-primary;
  }
}
</style>
