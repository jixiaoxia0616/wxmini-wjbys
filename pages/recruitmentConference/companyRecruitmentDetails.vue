<template>
  <view class="details">
    <uni-forms :modelValue="detailData">
      <sectionHeader>
        <span>{{ detailData.recruitmentName }}</span>
      </sectionHeader>
      <view class="detail-form">
        <uni-forms-item label="企业名称" labelWidth="100" name="recruitmentNum">
          <enterpriseName :enterpriseName="detailData.enterpriseName" :enterpriseId="detailData.enterpriseId"></enterpriseName>
<!--          <view class="uni-list-cell-left">{{detailData.enterpriseName}}</view>-->
        </uni-forms-item>
        <uni-forms-item label="招聘地点" labelWidth="100" name="positionName">
          <view class="uni-list-cell-left">{{detailData.campus}}</view>
        </uni-forms-item>
        <uni-forms-item label="详细地址" labelWidth="100" name="positionName">
          <view class="uni-list-cell-left">{{detailData.address}}</view>
        </uni-forms-item>
        <uni-forms-item label="开始时间" labelWidth="100" name="salary">
          <view class="uni-list-cell-left">{{detailData.startTime}}</view>
        </uni-forms-item>
        <uni-forms-item label="结束时间" labelWidth="100" name="salary">
          <view class="uni-list-cell-left">{{detailData.endTime}}</view>
        </uni-forms-item>
        <uni-forms-item label="岗位数量" labelWidth="100" name="salary">
          <view class="uni-list-cell-left">{{totalNumOfPositions}}</view>
        </uni-forms-item>

      </view>

      <sectionHeader>
        <span>需求岗位</span>
      </sectionHeader>
      <view class="table-container">
        <uni-table ref="table" :loading="recruitmentPositionsLoading" stripe="true" emptyText="没有获取到岗位需求列表">
          <uni-tr>
            <uni-th width="70" align="left">岗位</uni-th>
            <uni-th width="30" align="center">人数</uni-th>
          </uni-tr>
          <uni-tr v-for="(item, index) in recruitmentPositions" :key="index">
            <uni-td align="left">{{ item.positionName }}</uni-td>
            <uni-td align="center">{{ item.recruitmentNum }}</uni-td>
          </uni-tr>
        </uni-table>
      </view>

    </uni-forms>
  </view>
</template>

<script>
import sectionHeader from '@/components/sectionHeader.vue'
import enterpriseName from '@/components/enterpriseName.vue'
import {getAllPositionsByRoute} from "@/apis/api";
export default {
  components: {
    sectionHeader,
    enterpriseName
  },
  data() {
    return {
      routeId: '',
      detailData: {
        enterpriseId: '',
        enterpriseName: '',
        recruitmentName: '',
        startTime: '',
        endTime: '',
        address: '',
        campus: ''
      },
      recruitmentPositions: [],
      recruitmentPositionsLoading: true
    }
  },

  computed: {
    totalNumOfPositions() {
      let totalNum = 0;
      this.recruitmentPositions.map(item=> {
        if (item) {
          let validNum = parseInt(item.recruitmentNum);
          if (validNum) {
            totalNum = totalNum + validNum;
          }
        }
      });
      return totalNum;
    }
  },

  onLoad(openValue) {
    let str = openValue.detail
    if (str) {
      let data = JSON.parse(str)
      console.log("data", data);
      this.detailData.recruitmentName = data.recruitmentNames
      this.detailData.enterpriseId = data.enterpriseId
      this.detailData.enterpriseName = data.enterpriseName
      this.detailData.startTime = data.startTime
      this.detailData.endTime = data.endTime
      this.detailData.address = data.location
      this.detailData.campus = data.schoolName
      this.routeId = data.routeId
    }
    if (this.routeId) {
      console.log("routeid", this.routeId);
      this.recruitmentPositionsLoading = true;
      this.getPositions(this.routeId);
    }
  },


  methods: {
    async getPositions(routeId) {
      let res = await getAllPositionsByRoute({
        routeId: routeId,
        pageSize: 100
      })
      if (res && res.statusCode == 200) {
        console.log("获取到了招聘会岗位列表", res.data.rows);
        this.recruitmentPositionsLoading = false;
        this.recruitmentPositions = res.data.rows;
        // return res.data.rows
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.details {
  width: 750rpx;
  height: 100vh;
  overflow: auto;
  .table-container{
    margin: 0 30rpx;
  }
  .detail-form {
    padding:5rpx 5rpx;
    width: 670rpx;
    margin-left: 50rpx;
    .uni-list-cell-left {
      // border: 1px solid #DCDFE6;
      border-radius: 4px;
      //height: 32px;
      line-height: 32px;
      padding: 0px 0px;
    }
  }
  .bottom-btns{
    margin: 0 20rpx;
  }
}
</style>
