<template>
	<view class="messenger">
		<view class="messenger-form">
			<uni-forms :modelValue="formData" ref="messengerForm" :rules="messengerRules">
				<sectionHeader>企业信息</sectionHeader>
				<view class="resume-detail-form">
					<uni-forms-item required label="企业名称" name="enterpriseId" labelWidth="100">
						<view @click="open()" class="uni-list-cell-left">{{formData.enterpriseName}}</view>
						<uni-popup ref="popup" type="bottom" background-color="#fff" style="width: 700rpx;">
							<uni-easyinput v-model="companyValue" inputBorder suffixIcon="search" @iconClick="updateCompanyList"
								@input="updateCompanyList" placeholder="请输入企业名称" trim></uni-easyinput>
							<view style="height: 760rpx;overflow-y: auto;">
								<uni-list :border="true">
									<uni-list-item v-for="(item,index) in companyList" :key="index"
										:title="item.enterpriseName" clickable @click="setEnterpriseInfo(item)"
										:note="item.enterpriseAddress" :rightText="item.registerCapital+'万元'">
									</uni-list-item>
								</uni-list>
							</view>
						</uni-popup>
					</uni-forms-item>
				</view>
				<sectionHeader v-if="formData.approve == 2">积分排名</sectionHeader>
				<view class="resume-detail-form" v-if="formData.approve == 2">
					<uni-forms-item required label="积分" name="integralValue" readonly labelWidth="100">
						<view class="uni-list-cell-left">{{formData.integralValue || 0}}</view>
					</uni-forms-item>
					<uni-forms-item required label="排名" name="rank" readonly labelWidth="100">
						<view class="uni-list-cell-left">{{'第'+(formData.rankName || '一')+'名'}}</view>
					</uni-forms-item>
				</view>
				<sectionHeader>大使理由</sectionHeader>
				<view class="resume-detail-form">
					<uni-forms-item required label="申请理由" name="reason" labelWidth="100">
						<uni-easyinput type="textarea" autoHeight disableColor="#ffffff" :disabled="formData.approve == 2"
							v-model="formData.reason" placeholder="请输入申请理由">
						</uni-easyinput>
					</uni-forms-item>
					<uni-forms-item required label="拒绝理由" name="reason" v-if="formData.approve == '3'" labelWidth="100">
						<uni-easyinput type="textarea" autoHeight :disabled="formData.approve == 2"
							v-model="formData.refuseOfferReason" placeholder="请输入拒绝理由">
						</uni-easyinput>
					</uni-forms-item>
				</view>
				<sectionHeader>证件信息</sectionHeader>
				<view class="resume-detail-form">
					<uni-forms-item required label="身份证号" name="identityNumber" labelWidth="100">
						<uni-easyinput type="idcard" :disabled="formData.approve == 2" v-model="formData.identityNumber"
							placeholder="请输入身份证号">
						</uni-easyinput>
					</uni-forms-item>
					<uni-forms-item required label="开户行" name="accountBank" labelWidth="100">
						<uni-easyinput v-model="formData.accountBank" :disabled="formData.approve == 2"
							placeholder="请输入开户行">
						</uni-easyinput>
					</uni-forms-item>
					<uni-forms-item required label="银行卡号" name="bankCardNumber" labelWidth="100">
						<uni-easyinput type="number" :disabled="formData.approve == 2" v-model="formData.bankCardNumber"
							placeholder="请输入银行卡号">
						</uni-easyinput>
					</uni-forms-item>
				</view>
				<sectionHeader>个人基本信息</sectionHeader>
				<view class="resume-detail-form">
					<uni-forms-item label="姓名" name="name" readonly labelWidth="100">
						<view class="uni-list-cell-left">{{formData.name}}</view>
					</uni-forms-item>
					<uni-forms-item label="联系方式" name="phoneNumber" readonly labelWidth="100">
            <uni-easyinput type="number" v-model="formData.phoneNumber" placeholder="请输入手机号" :clearable="true" />
<!--						<view class="uni-list-cell-left">{{formData.phoneNumber}}</view>-->
					</uni-forms-item>
					<uni-forms-item label="邮箱" name="mail" readonly labelWidth="100">
						<view class="uni-list-cell-left">{{formData.mail}}</view>
					</uni-forms-item>
					<uni-forms-item label="学校名称" name="schoolName" readonly labelWidth="100">
						<view class="uni-list-cell-left">{{formData.schoolName}}</view>
					</uni-forms-item>
					<uni-forms-item name="professional" label="所学专业" labelWidth="100">
						<view class="uni-list-cell-left">{{formData.professional}}</view>
					</uni-forms-item>
					<uni-forms-item name="graduationTime" label="毕业时间" labelWidth="100">
						<view class="uni-list-cell-left">{{formData.graduationTime}}</view>
					</uni-forms-item>
				</view>
			</uni-forms>
		</view>
		<view class="messenger-btns" v-if="formData.approve != 2">
			<button type="primary" @click="saveData">保存</button>
		</view>
	</view>
</template>

<script>
	import {
		getCompanyList,
		getEducationList,
		addAmbassador,
		updateAmbassador,
		getAmbassadorById
	} from '@/apis/api.js'
	import {
		login
	} from '@/utils/util.js'
	import sectionHeader from '@/components/sectionHeader.vue'
	export default {
		components: {
			sectionHeader
		},
		data() {
			return {
				openid: null,
				filterCom: [],
				companyList: [],
				companyValue: '',
				formData: {
					id: null,
					enterpriseId: null,
					enterpriseName: '',
					integralValue:0,
					rank:0,
					rankName:'一',
					studentId: null,
					schoolName: '',
					openid: null,
					schoolId: null,
					professional: '',
					education: '',
					approve: 1,
					name: '',
					phoneNumber: '',
					mail: '',
					avatarUrl: '',
					graduationTime: '',
					reason: '',
					identityNumber: '',
					bankCardNumber: '',
					accountBank: '',

				},
				messengerRules: {
					enterpriseId: {
						rules: [{
							required: true,
							errorMessage: '请选择企业名称',
						}]
					},
					reason: {
						rules: [{
							required: true,
							errorMessage: '请输入申请理由',
						}]
					},
					identityNumber: {
						rules: [{
							required: true,
							errorMessage: '请输入身份证号',
						}]
					},
					bankCardNumber: {
						rules: [{
							required: true,
							errorMessage: '请输入银行卡号',
						}]
					},
					accountBank: {
						rules: [{
							required: true,
							errorMessage: '请输入开户行',
						}]
					}
				}
			}
		},
		async onLoad() {
			let userInfo = getApp().globalData.wxUser
			this.formData.name = userInfo.studentName || ''
			this.formData.phoneNumber = userInfo.phoneNumber || ''
			this.formData.mail = userInfo.email || ''
			this.formData.studentId = userInfo.id
			this.formData.avatarUrl = userInfo.avatarUrl
			this.formData.graduationTime = userInfo.graduationTime || ''
			this.formData.openid = userInfo.openid
			this.openid = userInfo.openid
			this.getEducations()
			if (userInfo.campusAmbassador && userInfo.campusAmbassador.id) {
				let campusAmbassador = await getAmbassadorById(userInfo.campusAmbassador.id)
				if (campusAmbassador) {
					this.formData.enterpriseName = campusAmbassador.enterpriseName || ''
					this.formData.integralValue = campusAmbassador.integralValue || 0
					this.formData.integralValue = campusAmbassador.integralValue | 0
					this.formData.rankName = campusAmbassador.rankName || '一'
					this.formData.enterpriseId = campusAmbassador.enterpriseId
					this.formData.reason = campusAmbassador.reason
					this.formData.approve = campusAmbassador.approve
					this.formData.id = campusAmbassador.id
					this.formData.identityNumber = campusAmbassador.identityNumber
					this.formData.bankCardNumber = campusAmbassador.bankCardNumber
					this.formData.accountBank = campusAmbassador.accountBank
				}
			}
		},
		methods: {

      async updateCompanyList() {
        let list = await getCompanyList({
          enterpriseName: this.companyValue || '',
          pageNum: 1,
          pageSize: 20
        })
        this.companyList = list
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
					this.formData.schoolId = data.id
					this.formData.schoolName = data.schoolName
					this.formData.professional = data.studentMajor
					this.formData.education = data.studentEducation

				}
			},
			open() {
				if (this.formData.approve == 2) {
					return
				}
				this.$refs.popup.open()
			},
			close() {
				this.$refs.popup.close()
			},

			setEnterpriseInfo(com) {
        console.log('submit com', com)
				if (com && com.id) {
					this.formData.enterpriseId = com.id
					this.formData.enterpriseName = com.enterpriseName.trim()
					this.close()
				}
			},
			async saveData() {
				this.$refs.messengerForm.validate().then(async data => {
					let param = JSON.parse(JSON.stringify(this.formData))
					delete param.integralValue
					delete param.rank
					let res = null
					if (param.id) {
						res = await updateAmbassador(param)
					} else {
						res = await addAmbassador(param)
					}

					if (res && res.data && res.data.code == 200) {
						uni.showToast({
							title: '已申请，请等待审核!',
							icon: 'success'
						})
						uni.navigateBack()
					}
				}).catch(err => {
					console.log('表单错误信息：', err);
				})
			},
		}
	}
</script>

<style lang="scss">
	.messenger {
		padding: 30rpx 20rpx;
		overflow: hidden;

		.messenger-title {
			margin: 30rpx 40rpx;
			display: flex;
			align-items: center;
			justify-content: center;

			.messenger-title-right {
				margin-left: 80rpx;

				view {
					height: 50rpx;
					line-height: 50rpx;
				}
			}
		}

		.messenger-form {
			margin: 30rpx 10rpx;
			height: calc(100vh - 300rpx);
			overflow: auto;

			.resume-detail-form {
				padding: 10rpx 20rpx;

				.uni-list-cell-left {
					border: 1px solid #DCDFE6;
					border-radius: 4px;
					height: 32px;
					line-height: 32px;
					padding: 0 12px;
				}
			}
		}

		.messenger-btns {
			display: flex;
			align-items: center;
			justify-content: center;

			button {
				width: 90%;
        background-color: $uni-color-primary;
			}
		}
	}
</style>
