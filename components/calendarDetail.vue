<template>
  <view class="resume-detail">
    <uni-forms :modelValue="dataDetail">
      <!-- <sectionHeader>
				<span>面试信息</span>
			</sectionHeader> -->
			<view class="resume-detail-form">
				<uni-forms-item label="职位" name="postName" labelWidth="100">
					<view class="uni-list-cell-left">{{dataDetail.postName}}</view>
				</uni-forms-item>
				<uni-forms-item label="面试方式" name="interviewMethodName" labelWidth="100">
					<view class="uni-list-cell-left">{{dataDetail.interviewMethodName}}</view>
				</uni-forms-item>
				<uni-forms-item label="面试企业" name="enterpriseName" labelWidth="100">
					<view class="uni-list-cell-left">{{dataDetail.enterpriseName}}</view>
				</uni-forms-item>
				<uni-forms-item label="面试官" name="interviewer" labelWidth="100">
					<view class="uni-list-cell-left">{{dataDetail.interviewer}}</view>
				</uni-forms-item>
        <uni-forms-item label="联系方式" name="phone" labelWidth="100">
					<view class="uni-list-cell-left">{{dataDetail.phone || ''}}</view>
				</uni-forms-item>
				<uni-forms-item label="面试类型" name="interviewTypeName" labelWidth="100">
					<view class="uni-list-cell-left">{{dataDetail.interviewTypeName}}</view>
				</uni-forms-item>
				<uni-forms-item label="面试日期" name="interviewTime" labelWidth="100">
					<view class="uni-list-cell-left">{{dataDetail.interviewTime}}</view>
				</uni-forms-item>
				<uni-forms-item label="面试地点" name="interviewLocation" labelWidth="100">
					<view class="uni-list-cell-left">{{dataDetail.interviewLocation}}</view>
				</uni-forms-item>
			</view>
		</uni-forms>
	</view>
</template>

<script>
const interviewTypes = [{
  value: '0',
  label: '初试'
},
{
  value: '1',
  label: '复试'
},
{
  value: '2',
  label: '终试'
}]

	const interviewMethods = [{
		value: '0',
		label: '现场面试'
	},
	{
		value: '1',
		label: '电话面试'
	},{
		value: '2',
		label: '视频面试'
	}]
	import sectionHeader from '@/components/sectionHeader.vue'
	export default {
		name: "calendarDetail",
		components: {
			sectionHeader
		},
		props: {
			detail: Object,
		},
		watch: {
			detail: {
				deep: true,
				immediate:true,
				handler(val) {
					if(val){
						for(let name in val){
							if(this.dataDetail.hasOwnProperty(name)){
								this.dataDetail[name] = val[name]
							}
							if(name == 'interviewType'){
								let data = interviewTypes.find(x=>x.value == val[name])
								if(data){
									this.dataDetail.interviewTypeName = data.label
								}
							}
							if(name == 'interviewMethod'){
								let data = interviewMethods.find(x=>x.value == val[name])
								if(data){
									this.dataDetail.interviewMethodName = data.label
								}
							}
						}
					}
				}
			}
		},
		data() {
			return {
				dataDetail:{
					postName:'',
					enterpriseName:'',
					interviewTypeName:'',
					interviewer:'',
					interviewTime:'',
          phone:'',
					interviewLocation:'',
					interviewType:'',
					interviewMethod:'0',
					interviewMethodName:'',
				}
			}
		},
		onLoad() {



  },
  methods: {
    getTypeData (item) {
      let data = { name: "", tagType: item.tagType };
      if (item) {
        let dataType = typeDatas.find((x) => x.key == item.tagType);
        if (dataType && dataType.key) {
          data = { name: dataType.name, tagType: dataType.key };
        }
      }
      return data
    }
  }
}
</script>

<style lang="scss" scoped>
.resume-detail {
  width: 660rpx;
  height: 800rpx;
  overflow: hidden;

  .resume-detail-form {
    padding: 10rpx 20rpx;
    width: 650rpx;
    overflow: hidden;

    .uni-list-cell-left {
      // border: 1px solid #DCDFE6;
      border-radius: 4px;
      height: 32px;
      line-height: 32px;
      padding: 0 12px;
    }
  }
}
</style>
