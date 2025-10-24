<template>
  <view>
    <image v-if="!error" :src="url" style="width:750rpx;height:100vh;" @error="imgError">
    </image>
    <view v-else style="width:100%;height:100%;display: flex;  flex-direction: column;  align-items: center;">
      <image :src="empty" style="width: 200rpx;height:200rpx;margin-top: 100rpx;"></image>
      <text class="poster-error">海报地址错误！</text>
    </view>
  </view>
</template>

<script>
import empty from '@/static/empty.png'

export default {
  data() {
    return {
      empty,
      error: false,
      url: ''
    }
  },
  onLoad(openValue) {
    this.url = openValue.url
    console.log('this.url', this.url)
  },
  methods: {
    imgError() {
      this.error = true
    }
  }
}
</script>

<style lang="scss">
.poster-error {
  margin-top: 50 rpx;
  font-size: 26 rpx;
  color: $uni-color-primary;
  font-weight: 500;
}
</style>
