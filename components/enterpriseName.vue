<template>
  <view>
    <view class="uni-list-cell-left"
          @click="openEnterprise">
      <text>{{enterpriseName || ''}}</text>
      <uni-icons v-if="enterpriseName && enterpriseId"
        type="link"
        size="24"
        color="#247888FF">
      </uni-icons>
    </view>

  </view>
</template>

<script>
export default {
  name: "enterpriseName",
  props: {
    enterpriseName: String,
    enterpriseId: String
  },
  data () {
    return {

    };
  },
  methods: {
    openEnterprise () {
      uni.navigateTo({
        url: `/pages/enterpriseDataDetail/enterpriseDataDetail?enterpriseId=${this.enterpriseId}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.uni-list-cell-left {
  // border: 1px solid #DCDFE6;
  border-radius: 4px;
  height: 32px;
  line-height: 32px;
  padding: 3px 12px;
  color: $uni-color-title;
  display: flex;
  align-items: center;
}
.uni-icon {

}
</style>
