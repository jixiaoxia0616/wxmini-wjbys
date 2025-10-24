<template>
	<view class="resume-detail">
		<uni-forms :modelValue="dataDetail">
			<sectionHeader v-if="showEnterprise">
				<span>面试信息</span>
			</sectionHeader>
			<view class="resume-detail-form" v-if="showEnterprise">
				<uni-forms-item required label="企业全称" name="enterpriseName">
					<enterpriseName :enterpriseName="dataDetail.enterpriseName" :enterpriseId="enterpriseId"></enterpriseName>
				</uni-forms-item>
				<uni-forms-item required label="企业性质" name="enterpriseKindName">
					<view class="uni-list-cell-left">{{dataDetail.enterpriseKindName}}</view>
				</uni-forms-item>
				<uni-forms-item required label="公司规模" name="enterpriseScaleName">
					<view class="uni-list-cell-left">{{dataDetail.enterpriseScaleName}}</view>
				</uni-forms-item>
				<uni-forms-item required label="所属行业" name="enterpriseTradeName">
					<view class="uni-list-cell-left">{{dataDetail.enterpriseTradeName}}</view>
				</uni-forms-item>
				<uni-forms-item required label="企业地址" name="enterpriseAddress">
					<view class="uni-list-cell-left">{{dataDetail.enterpriseAddress}}</view>
				</uni-forms-item>
			</view>
		</uni-forms>
	</view>
</template>

<script>
	import {
		getEnterpriseInfo,
		getDictList,
		addEnterprise,
		delEnterprise,
		addSubscribeEnterprise,
		delSubscribeEnterprise
	} from '@/apis/api.js'
	import sectionHeader from '@/components/sectionHeader.vue'
	import enterpriseName from '@/components/enterpriseName.vue'
	export default {
		components: {
			sectionHeader,
			enterpriseName
		},
		data() {
			return {
				showPsot:true,
				showEnterprise:true,
				enterpriseId: null,
				postId: null,
				disabled: false,
				subscribePostId: null,
				subscribeEnterpriseId: null,
				dataDetail: {
					enterpriseName: '',
					enterpriseKindName: '',
					enterpriseScaleName: '',
					enterpriseTradeName: '',
					enterpriseAddress: '',
					positionName: '',
					workPlace: '',
				},
			}
		},
		onLoad(openValue) {
			let str = openValue.detail
			if (str) {
				let data = JSON.parse(str)
				this.dataDetail.enterpriseName = data.enterpriseName
				this.enterpriseId = data.enterpriseId
				this.postId = data.postId
				this.subscribePostId = data.subscribePostId || null //岗位订阅
				this.dataDetail.positionName = data.positionName
				console.log('this.subscribePostId', this.subscribePostId)
				this.dataDetail.workPlace = data.workPlace
				this.dataDetail.salary = data.salary 
				this.dataDetail.recruitmentNum = data.recruitmentNum 
			}
			if (this.enterpriseId) {
				this.getEnterpiseData()
			}
			let current = openValue.current
			if(current == 0){
				this.showPsot = true
				this.showEnterprise = false
			} else if (current == 1){
				this.showPsot = false
				this.showEnterprise = true
			}else{
				this.showPsot = true
				this.showEnterprise = true
			}

		},
		methods: {
			getEnterpiseData() {
				uni.showLoading({
					title: '正在加载...',
					mask: true
				})
				this.disabled = true
				let wxUser = getApp().globalData.wxUser
				Promise.all([getDictList('scope'),
					getDictList('property'),
					getDictList('profession'),
					getEnterpriseInfo({
						enterpriseId: this.enterpriseId,
						studentId: wxUser.id
					})
				]).then(resList => {
					uni.hideLoading()
					this.disabled = false
					if (resList && resList.length > 3) {
						let scopeList = resList[0].data.rows || [] //规模
						let propertyList = resList[1].data.rows || [] //性质
						let professionList = resList[2].data.rows || [] //行业
						let enterpriseInfo = resList[3].data.data || {} //企业信息
						let property = propertyList.find(x => x.dictValue == enterpriseInfo.enterpriseKind)
						if (property) {
							this.dataDetail.enterpriseKindName = property.dictLabel
						}
						let scope = scopeList.find(x => x.dictValue == enterpriseInfo.enterpriseScale)
						if (scope) {
							this.dataDetail.enterpriseScaleName = scope.dictLabel
						}
						let profession = professionList.find(x => x.dictValue == enterpriseInfo.enterpriseTrade)
						if (profession) {
							this.dataDetail.enterpriseTradeName = profession.dictLabel
						}
						this.dataDetail.enterpriseAddress = enterpriseInfo.enterpriseAddress
						this.subscribeEnterpriseId = enterpriseInfo.subscribeEnterpriseId || null //公司订阅
					}
				}).catch(() => {
					uni.hideLoading()
					this.disabled = false
				})
			},
			// 收藏接口
			async enterpriseOnClick(type) {
				let res = null
				let wxUser = getApp().globalData.wxUser
				if (type === 0) {
					//企业
					let param = {
						enterpriseId: this.enterpriseId,
						studentId: wxUser.id
					}
					if (!this.subscribeEnterpriseId) {
						res = await addSubscribeEnterprise(param)
					} else {
						res = await delSubscribeEnterprise(this.subscribeEnterpriseId)
					}
				} else if (type === 1) {
					//岗位
					let param = {
						postId: this.postId,
						studentId: wxUser.id
					}
					if (!this.subscribePostId) {
						res = await addEnterprise(param)
					} else {
						res = await delEnterprise(this.subscribePostId)
					}
				}
				console.log('res', res)
				if (res && res.code == 200) {
					uni.showToast({
						title: '操作成功!',
						icon: 'success'
					})

					if (type === 0) {
						if (this.subscribeEnterpriseId) {
							this.subscribeEnterpriseId = null
						} else {
							this.subscribeEnterpriseId = res.id
							
						}

					} else if (type === 1) {
						if (this.subscribePostId) {
							this.subscribePostId = null
						} else {
							this.subscribePostId = res.id
						}
					}
				} else {

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
				// border: 1px solid #DCDFE6;
				border-radius: 4px;
				height: 32px;
				line-height: 32px;
				padding: 0 12px;
			}
		}
	}
</style>
