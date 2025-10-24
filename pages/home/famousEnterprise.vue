<template>
  <view class="famous-enterprise-container">
    <view class="page-title">知名企业</view>

    <!-- 企业卡片列表 -->
    <view class="enterprise-list">
      <!-- 使用v-for动态生成企业卡片 -->
      <view class="enterprise-card" v-for="(item, index) in enterpriseList" :key="index">
        <view class="enterprise-title">{{ item.enterpriseName }}</view>
        <view class="enterprise-content">
          <view class="enterprise-image">
            <image :src="item.enterpriseImage" mode="aspectFill"></image>
          </view>
          <view class="enterprise-desc">
            <text>{{ item.description }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "famousEnterprise",
  data() {
    return {
      enterpriseList: []
    };
  },
  methods: {
    // 加载企业数据
    loadEnterpriseData() {
      // 使用require导入JSON数据
      try {
        const enterpriseData = require('../../static/enterprise/famousEnterpriseList.json');
        this.enterpriseList = enterpriseData;
      } catch (error) {
        console.error('加载企业数据失败:', error);
        uni.showToast({
          title: '加载企业数据失败',
          icon: 'none'
        });
      }
    }
  },
  onLoad() {
    // 页面加载时执行数据加载
    this.loadEnterpriseData();
  }
};
</script>

<style lang="scss" scoped>
.famous-enterprise-container {
  padding: 30rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.page-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
  text-align: center;
}

.enterprise-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
  padding: 0 20rpx;
}

.enterprise-card {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  border: 2rpx dashed #ccc;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  position: relative;
}

.enterprise-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #34acc3;
  text-align: center;
  margin-bottom: 20rpx;
}

.enterprise-content {
  display: flex;
  margin-top: 20rpx;
  align-items: center; /* 使子元素在垂直方向居中对齐 */
}

.enterprise-image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  margin-right: 20rpx;
  border: 1px solid #eee;
}

.enterprise-image image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.enterprise-desc {
  flex: 1;
  font-size: 20rpx;
  color: #666;
  line-height: 1.6;
  text-align: justify;
}
</style>
