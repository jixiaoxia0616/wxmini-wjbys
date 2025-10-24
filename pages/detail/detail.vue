<template>
	<view class="details">
		<uni-forms :modelValue="dataDetail">
			<!-- <sectionHeader v-if="showPost">
				<span>岗位招聘信息</span>
				<uni-fav :checked="!!subscribePostId" :disabled="disabled" slot="right"
					:contentText="{contentDefault: '订阅',contentFav: '已订阅'}" @click="enterpriseOnClick(1)" />
			</sectionHeader> -->
			<view class="detail-form" v-if="showPost">
				<view class="position-main-info">
					<view class="additional-info">
						<view class="position-name">{{ dataDetail.positionName }}</view>
						<div v-if="dataDetail.salary" class="position-salary">{{ dataDetail.salary }}</div>
					</view>
					<view class="">
						<div v-if="dataDetail.recruitmentNum" class="position-others">招聘{{ dataDetail.recruitmentNum }}人
						</div>
						<div v-if="dataDetail.recruitmentNum && dataDetail.academic" class="position-others">&#8226
						</div>
						<div v-if="dataDetail.academic" class="position-others">{{ dataDetail.academic }}</div>
					</view>
					<view class="">
						<view v-if="dataDetail.professionalList && dataDetail.professionalList.size !=0">
							<text class="position-major-tag" v-for="(cell,index) in dataDetail.professionalList"
								size="small" :key="index">{{cell}} <text
									v-if="index < dataDetail.professionalList.length - 1">丨</text></text>
						</view>
					</view>

				</view>

				<view label="任职资格" v-if='dataDetail.qualification' class="position-description-box"
					name="qualification">
					<div class="position-label">任职资格</div>
					<rich-text class="position-description" :nodes="dataDetail.qualification"></rich-text>
				</view>


				<view label="工作职责" v-if='dataDetail.workDuty' class="position-description-box" name="qualification">
					<div class="position-label">工作职责</div>
					<rich-text class="position-description" :nodes="dataDetail.workDuty"></rich-text>
				</view>


				<uni-collapse>
					<uni-collapse-item>
						<template v-slot:title>
							<view style="height: 40px; line-height: 40px;">
								<uni-icons type="bars" size="16"></uni-icons>
								<text style="margin-left: 10px;">其他信息</text>
							</view>
						</template>
						<uni-forms-item label="福利待遇" v-if='dataDetail.welfare' labelWidth="100"
							name="welfare"></uni-forms-item>
						<rich-text :nodes="dataDetail.welfare"></rich-text>

						<uni-forms-item label="招聘地址" v-if='dataDetail.workPlace' labelWidth="100" name="workPlace">
							<view class="uni-list-cell-left">{{ dataDetail.workPlace }}</view>
						</uni-forms-item>

						<uni-forms-item label="实践经验" v-if='dataDetail.internshipExperience' labelWidth="100"
							name="internshipExperience">
							<rich-text :nodes="dataDetail.internshipExperience"></rich-text>
						</uni-forms-item>

						<uni-forms-item label="招聘人员" v-if='dataDetail.principal' labelWidth="100" name="principal">
							<view class="uni-list-cell-left">{{ dataDetail.principal ? dataDetail.principal : '' }}
							</view>
						</uni-forms-item>


						<uni-forms-item label="海报信息" labelWidth="100" name="workPlace" v-if="dataDetail.posterAddress">
							<view class="uni-list-cell-left" style="color: #007AFF;text-decoration:underline; "
								@click="shopPoster(dataDetail.posterAddress)">查看海报
							</view>
						</uni-forms-item>
					</uni-collapse-item>
				</uni-collapse>
			</view>
			<view @click="openEnterprise" class="enterpriseInfo">
				<view class="" style="position: relative;">
					<image v-if="dataDetail.enterpriseUrl" :src="baseUrl + dataDetail.enterpriseUrl" mode=""></image>
					<view v-else class="enterpriseUrl">
						企
					</view>
					<view  @click.stop="enterpriseOnClick(0)" class="isFocus">
						<uni-icons v-if="!subscribeEnterpriseId" type="plusempty" size="14"></uni-icons>
						<uni-icons v-if="subscribeEnterpriseId" type="checkmarkempty" size="14"></uni-icons>
					</view>
				</view>
				<view class="" style="margin-left: 20rpx;">
					<view class="enterpriseName">
						{{ dataDetail.enterpriseName }}
					</view>
					<view class="enterpriseDescribe">
						{{ dataDetail.enterpriseKindName }} 丨
						{{ dataDetail.enterpriseScaleName }}丨{{ dataDetail.enterpriseTradeName }}
					</view>
				</view>
				<view class="">
					<uni-icons type="right" size="16"></uni-icons>
				</view>
			</view>

			<!-- <sectionHeader v-if="showEnterprise">
				<span>企业信息</span>
				<uni-fav :checked="!!subscribeEnterpriseId" :disabled="disabled" slot="right"
					:contentText="{contentDefault: '订阅',contentFav: '已订阅'}" @click="enterpriseOnClick(0)" />
			</sectionHeader>
			<view class="detail-form" v-if="showEnterprise">
				<uni-forms-item label="企业全称" labelWidth="100" name="enterpriseName">
					<enterpriseName :enterpriseName="dataDetail.enterpriseName" :enterpriseId="enterpriseId">
					</enterpriseName>
				</uni-forms-item>
				<uni-forms-item label="企业性质" labelWidth="100" name="enterpriseKindName">
					<view class="uni-list-cell-left">{{ dataDetail.enterpriseKindName }}</view>
				</uni-forms-item>
				<uni-forms-item label="公司规模" labelWidth="100" name="enterpriseScaleName">
					<view class="uni-list-cell-left">{{ dataDetail.enterpriseScaleName }}</view>
				</uni-forms-item>
				<uni-forms-item label="所属行业" labelWidth="100" name="enterpriseTradeName">
					<view class="uni-list-cell-left">{{ dataDetail.enterpriseTradeName }}</view>
				</uni-forms-item>
				<uni-forms-item label="企业地址" labelWidth="100" name="enterpriseAddress">
					<view class="uni-list-cell-left">{{ dataDetail.enterpriseAddress }}</view>
				</uni-forms-item>
			</view> -->

		</uni-forms>
		<!--    isShowRecommend 指只能由校园大使推荐岗位，暂时取消这个限制-->

		<view class="bottoms">
			<view class="bottom-actions">
				<view class="subscribe-btn">
					<uni-fav :checked="!!subscribePostId"
							:disabled="disabled"
							:contentText="{contentDefault: '订阅',contentFav: '已订阅'}"
							@click="enterpriseOnClick(1)" />
				</view>
				<view class="action-btns">
					<button class="share-btn"
							share
							type="default"
							open-type="share">推荐给好友</button>
					<button class="submit-btn"
							type="primary"
							@click="submitResume"
							:class="{'submitted': dataDetail.submitStatus == '1'}">
						{{ dataDetail.submitStatus == '1' ? '撤销投递' : '投递简历' }}
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getEnterpriseInfo,
		getDictList,
		addEnterprise,
		delEnterprise,
		addSubscribeEnterprise,
		delSubscribeEnterprise,
		withdrawDelivery
	} from '@/apis/api.js'
	import sectionHeader from '@/components/sectionHeader.vue'
	import enterpriseName from '@/components/enterpriseName.vue'
	import {
		baseUrl
	} from '@/apis/request.js';
	export default {
		components: {
			sectionHeader,
			enterpriseName
		},
		data() {
			return {
				baseUrl,
				showPost: true,
				showEnterprise: true,
				enterpriseId: null,
				postId: null,
				disabled: false,
				subscribePostId: null,
				subscribeEnterpriseId: null,
				isShowRecommend: false,
				userId: null,
				openid: null,
				detailStr: '', // 保存原始参数用于分享
				dataDetail: {
					enterpriseName: '',
					enterpriseKindName: '',
					enterpriseScaleName: '',
					enterpriseTradeName: '',
					enterpriseAddress: '',
					positionName: '',
					posterAddress: '',
					salary: '',
					workPlace: '',
					recruitmentNum: 1,
					academic: '',
					welfare: '',
					internshipExperience: '',
					principal: '',
					workDuty: '',
					qualification: '',
					enterpriseUrl: '',
					submitStatus: '',
					professionalList: []
				},
			}
		},
		onLoad(openValue) {
			this.isShowRecommend = false
			//使用decodeURIComponent 防止json解析特殊字符报错 https://blog.csdn.net/cwb_2120/article/details/129763118
			let str = decodeURIComponent(openValue.detail)
			// 保存原始参数，用于分享
			this.detailStr = str
			if (str) {
				let data = JSON.parse(str)
				console.log("招聘信息", data);
				this.dataDetail.enterpriseName = data.enterpriseName
				this.enterpriseId = data.enterpriseId
				this.postId = data.postId
				this.subscribePostId = data.subscribePostId || null //岗位订阅
				this.dataDetail.positionName = data.positionName
				this.dataDetail.workPlace = data.workPlace
				this.dataDetail.salary = data.salary
				this.dataDetail.posterAddress = data.posterAddress
				this.dataDetail.recruitmentNum = data.recruitmentNum
				this.dataDetail.academic = data.academic
				this.dataDetail.welfare = data.welfare
				this.dataDetail.internshipExperience = data.internshipExperience
				this.dataDetail.principal = data.principal
				this.dataDetail.workDuty = data.workDuty
				this.dataDetail.qualification = data.qualification
				this.dataDetail.professionalList = data.professionalList
				this.dataDetail.submitStatus = data.submitStatus
			}
			if (this.enterpriseId) {
				this.getEnterpiseData()
			}
			// 如果是校园大使，并且绑定的企业是当前企业可以显示
			let wxUser = getApp().globalData.wxUser
			if (wxUser && wxUser.campusAmbassadorStatus == '2' &&
				wxUser.campusAmbassador && wxUser.campusAmbassador.enterpriseId == this.enterpriseId) {
				this.isShowRecommend = true
				this.userId = wxUser.id
				this.openid = wxUser.openid
			}
			let current = openValue.current
			if (current == 0) {
				this.showPost = true
				this.showEnterprise = false
			} else if (current == 1) {
				this.showPost = false
				this.showEnterprise = true
			} else {
				this.showPost = true
				this.showEnterprise = true
			}

		},
		methods: {
			openEnterprise() {
				uni.navigateTo({
					url: `/pages/enterpriseDataDetail/enterpriseDataDetail?enterpriseId=${this.enterpriseId}`
				})
			},
			shopPoster(url) {
				uni.navigateTo({
					url: '/pages/detail/posterAddress/posterAddress?url=' + url
				})
			},
			onShareAppMessage(res) {
				console.log('分享来源：', res)

				// 判断是从按钮分享还是右上角菜单分享
				// res.from === 'button' 表示来自页面内分享按钮
				// res.from === 'menu' 表示来自右上角菜单

				// 如果是校园大使点击按钮分享，走推荐逻辑
				if (res.from === 'button' && this.postId && this.enterpriseId &&
					this.userId && this.openid) {
					let wxUser = getApp().globalData.wxUser
					let detail = {
						postId: this.postId,
						enterpriseId: this.enterpriseId,
						userId: this.userId,
						openid: this.openid,
						campusAmbassadorId: wxUser.campusAmbassador && wxUser.campusAmbassador.id,
						enterpriseName: this.dataDetail.enterpriseName,
						enterpriseKindName: this.dataDetail.enterpriseKindName,
						enterpriseScaleName: this.dataDetail.enterpriseScaleName,
						enterpriseTradeName: this.dataDetail.enterpriseTradeName,
						enterpriseAddress: this.dataDetail.enterpriseAddress,
						positionName: this.dataDetail.positionName,
						professionalList: this.dataDetail.professionalList,
						workPlace: this.dataDetail.workPlace,
						salary: this.dataDetail.salary,
						recruitmentNum: this.dataDetail.recruitmentNum,
						sceneRecommend: true
					}
					let str = JSON.stringify(detail)
					// 编码
					str = encodeURI(str)
					return {
						title: `向您推荐岗位--${this.dataDetail.positionName}`,
						path: `/pages/recommendDetail/recommendDetail?detail=${str}`,
						success: function(res) {
							console.log("推荐分享成功", res);
						}
					}
				}

				// 右上角分享或普通用户分享，走普通详情页逻辑
				return {
					title: `${this.dataDetail.enterpriseName} - ${this.dataDetail.positionName}`,
					path: `/pages/detail/detail?detail=${this.detailStr}`,
					success: function(res) {
						console.log("分享成功", res);
					}
				}
			},
			onShareTimeline() {
				// 分享到朋友圈
				return {
					title: `${this.dataDetail.enterpriseName} - ${this.dataDetail.positionName}`,
					path: `/pages/detail/detail?detail=${this.detailStr}`,
					success: function(res) {
						console.log("分享到朋友圈成功", res);
					}
				}
			},
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
						studentId: wxUser ? wxUser.id : null
					})
				]).then(resList => {
					uni.hideLoading()
					this.disabled = false
					if (resList && resList.length > 3) {
						this.dataDetail.enterpriseUrl = resList[3].data.data.enterpriseUrl
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
				if (!getApp().isLogin()) {
					return
				}
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

			},
			submitResume() {
				if (!getApp().isLogin()) {
					return
				}

				if (this.dataDetail.submitStatus == '1') {
					// 撤销投递简历
					uni.showModal({
						title: '确认撤销',
						content: '确定要撤销该职位的简历投递吗？',
						confirmColor: '#34acc3',
						success: async (res) => {
							if (res.confirm) {
								let currentStudentId = getApp().globalData.wxUser.id
								let res = await withdrawDelivery(currentStudentId, this.postId)
								if (res && res.data && res.data.code === 200) {
									this.dataDetail.submitStatus = '0';
									uni.showToast({
										title: '撤销投递成功',
										icon: 'success',
										duration: 1500,
									})
								} else {
									uni.showToast({
										title: '撤销投递失败',
										icon: 'error',
										duration: 1500,
									})
								}
							}
						}
					});
				} else {
					// 投递简历
					let routes = getCurrentPages();
					let curRoute = routes[routes.length - 1].route
					getApp().globalData.currentPate = curRoute
					uni.navigateTo({
						url: '/pages/resumeDetail/resumeDetail?postId=' + this.postId +
							'&enterpriseId=' + this.enterpriseId +
							'&enterpriseName=' + this.dataDetail.enterpriseName +
							'&positionName=' + this.dataDetail.positionName
					})
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.details {
		width: 750rpx;
		height: calc(100vh - 140rpx);
		overflow: auto;
		position: relative;

		.bottoms {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			padding: 20rpx;
			background-color: #fff;
			box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

			.bottom-actions {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.subscribe-btn {
					flex: 0 0 auto;
					margin-right: 20rpx;
				}

				.action-btns {
					flex: 1;
					display: flex;
					gap: 20rpx;

					button {
						flex: 1;
						height: 80rpx;
						line-height: 80rpx;
						font-size: 28rpx;
						border-radius: 8rpx;
					}

					.share-btn {
						background-color: #f5f5f5;
						color: #666;
						border: none;
					}

					.submit-btn {
						background-color: #34acc3;
						color: #fff;

						&.submitted {
							background-color: #e74c3c; /* 红色背景 */
 						}
					}
				}
			}
		}

		.detail-form {
			padding: 5rpx 5rpx;
			padding-top: 30rpx;
			width: 680rpx;
			margin-left: 20rpx;

			.position-main-info {
				display: block;
				margin-left: 5rpx;
				margin-bottom: 10rpx;
				padding-bottom: 20rpx;
				border-bottom: 1px solid #ececec;
			}

			.position-name {
				clear: both;
				font-size: 50rpx;
			}

			.additional-info {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			.position-salary {
				font-size: 35rpx;
				font: bold;
				// float: right;
				color: $uni-color-primary;
			}

			.position-others {
				font-size: 28rpx;
				margin: 10rpx 0;
				color: gray;
				display: inline-block;
				// float: left;
			}

			.position-description-box {
				margin-bottom: 10px;
				line-height: 50rpx;
				border-bottom: 1px solid #ececec;
				padding-bottom: 20rpx;
			}

			.position-label {
				font-size: 32rpx;
				font: bold;
				margin-bottom: 10rpx;
				margin-top: 20rpx;
			}

			.position-major-tag {
				background-color: #fff;
				margin-bottom: 20rpx;
				// margin-inline: 8rpx;
				// border: 1px solid $uni-color-primary;
				color: $uni-color-primary;
				// padding: 2rpx 8rpx;
				height: 32rpx;
				line-height: 32rpx;
				border-radius: 8rpx;
				font-size: 24rpx;
				// color: $uni-color-primary;
			}

			.position-description {
				color: gray;
				font-size: 28rpx;
				margin-top: 20rpx;
			}

			.uni-list-cell-left {
				// border: 1px solid #DCDFE6;
				color: $uni-color-primary;
				border-radius: 4px;
				//height: 32px;
				line-height: 32px;
				padding: 0px 0px;

				.uni-forms-item__label {
					color: $uni-color-primary;
				}
			}
		}

		.bottom-btns {
			// margin: 0rpx 20rpx;
			// margin-top: 30rpx;
			width: 80%;

			button {
				background-color: $uni-color-primary;
				font-size: 32rpx;
			}
		}
	}
</style>
<style lang="scss">
	.details {
		.uni-forms-item {
			margin-bottom: 4px;
			align-items: center !important;
		}
	}

	.enterpriseInfo {
		display: flex;
		padding: 20rpx;
		align-items: center;
	}

	.enterpriseInfo image {
		width: 100rpx;
		border-radius: 50%;
		height: 100rpx;
		flex-shrink: 0;
	}

	.enterpriseUrl {
		width: 100rpx;
		height: 100rpx;
		background: #efefef;
		border-radius: 50%;
		color: gray;
		line-height: 100rpx;
		text-align: center;
		font-size: 40rpx;
	}

	.enterpriseName {
		font-weight: bolder;
		margin-bottom: 10rpx;
	}

	.enterpriseDescribe {
		width: 550rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		color: gray;
		font-size: 28rpx;
	}

	.isFocus {
		position: absolute;
		bottom: -10rpx;
		width: 100%;
		text-align: center;
	}

	.uniui-plusempty {
		color: white !important;
		width: 30rpx;
		height: 30rpx;
		background: #ff8100;
		border-radius: 50%;
	}
	.uniui-checkmarkempty{
		color: white !important;
		width: 30rpx;
		height: 30rpx;
		background: forestgreen;
		border-radius: 50%;
	}
</style>
