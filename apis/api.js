import { baseUrl, get, post, put,del } from './request.js'

//查询字典信息
export async function getDictList(dictType) {
  try {
    let res = await get('/system/student/dict/data/list', {
      dictType: dictType,
    })
    return res
  } catch (err) {
    console.log('查询字典信息错误', err)
  }
  return null
}

// 根据code获取个人信息
export async function getOpenIdByCode(data) {
  try {
    let res = await get('/system/student/mini/login', data)
    return res
  } catch (err) {
    console.log('根据code获取个人信息错误', err)
  }
  return null
}

export async function getPhoneNumber(data) {
  try {
    let res = await get('/system/student/mini/phoneNumber', data)
    return res
  } catch (err) {
    console.log('根据手机号息错误', err)
  }
  return null
}

export async function getOnlyOpenIdByCode(data) {
  try {
    let res = await get('/system/student/mini/openid', data)
		if(res && res.data && res.data.code == 200){
			if (res.data.data) {
				return res.data.data
			}
		}
  } catch (err) {
    console.log('根据code获取openId错误', err)
  }
  return null
}

export async function getDeliveryPass(data) {
  try {
    let res = await get('/system/student/delivery/pass', data)
    return res
  } catch (err) {
    console.log('根据code获取openId错误', err)
  }
  return null
}



// 保存个人微信信息
export async function saveBaseInfo(data) {
  try {
    let res = await post('/system/student/mini/save/baseInfo', data)
    // 保存成功返回入参
    if (res && res.data && res.data.code == 200) {
      getApp().globalData.wxUser = data
      return data
    }
    // 已存在，返回后台给的数据
    if (res && res.data && res.data.wxUser && res.data.wxUser.openid) {
      getApp().globalData.wxUser = res.data.wxUser
      return res.data.wxUser
    }
  } catch (err) {
    console.log('保存个人微信信息错误', err)
  }
  return null
}

// 保存个人信息
export async function saveStudent(data) {
  try {
    let res = await put('/system/student/mini/openid', data)
    return res
  } catch (err) {
    console.log('保存个人信息错误', err)
  }
  return null
}

// 保存教育经历
export async function saveEducation(data) {
  try {
    let res = await post('/system/student/education', data)
    return res
  } catch (err) {
    console.log('保存教育经历错误', err)
  }
  return null
}

// 修改教育经历
export async function updateEducation(data) {
  try {
    let res = await put('/system/student/education', data)
    return res
  } catch (err) {
    console.log('修改教育经历错误', err)
  }
  return null
}


// 岗位列表查询
export async function getEnterprisePostList(data) {
  try {
    let res = await get('/system/student/enterprise/post/list', data)
    return res
  } catch (err) {
    console.log('岗位列表查询错误', err)
  }
  return null
}

// 岗位列表查询-----苏信就业页面
export async function getSuxinEnterprisePostList(data) {
  try {
    let res = await get('/system/student/enterprise/post/suxinlist', data)
    return res
  } catch (err) {
    console.log('岗位列表查询错误', err)
  }
  return null
}

// 教育经历查询
export async function getEducationList(data) {
  try {
    let res = await get('/system/student/education/list', data)
    return res
  } catch (err) {
    console.log('教育经历查询错误', err)
  }
  return null
}

// 查询企业信息
export async function getEnterpriseInfo(data) {
  try {
    let res = await get('/system/student/enterprise/info', data)
    return res
  } catch (err) {
    console.log('查询企业信息错误', err)
  }
  return null
}


//投递简历
export async function saveDelivery(data) {
  try {
    let res = await post('/system/student/delivery', data)
    return res
  } catch (err) {
    console.log('投递简历错误', err)
  }
  return null
}

//撤銷(删除)投递的简历
export async function withdrawDelivery(studentId, postId) {
  try {
    let res = await del(`/system/student/delivery/withdraw?studentId=${studentId}&postId=${postId}`)
    return res
  } catch (err) {
    console.log('撤销投递简历出错', err)
  }
  return null
}

// 订阅岗位
export async function addEnterprise(data) {
  try {
    let res = await post('/system/student/subscribePost', data)
    if(res && res.data){
			return res.data
		}
		console.log('订阅岗位数据返回为空', res)
  } catch (err) {
    console.log('订阅岗位错误', err)
  }
  return null
}

// 删除订阅岗位
export async function delEnterprise(ids) {
  try {  ///
    let res = await del(`/system/student/subscribePost/${ids}`)
    if(res && res.data){
			return res.data
		}
		console.log('删除订阅岗位数据返回为空', res)
  } catch (err) {
    console.log('删除订阅岗位错误', err)
  }
  return null
}

// 查询订阅岗位
export async function getSubscribeList(data) {
  try {
    let res = await get('/system/student/subscribePost/list', data)
    if(res && res.data){
    	return res.data
    }
  } catch (err) {
    console.log('查询订阅岗位错误', err)
  }
  return null
}

// 订阅企业
export async function addSubscribeEnterprise(data) {
  try {
    let res = await post('/system/student/subscribeEnterprise', data)
    if(res && res.data){
			return res.data
		}
		console.log('订阅企业数据返回为空', res)
  } catch (err) {
    console.log('订阅企业错误', err)
  }
  return null
}

// 删除订阅企业
export async function delSubscribeEnterprise(ids) {
  try {
    let res = await del(`/system/student/subscribeEnterprise/${ids}`)
    if(res && res.data){
			return res.data
		}
		console.log('删除订阅岗位数据返回为空', res)
  } catch (err) {
    console.log('删除订阅岗位错误', err)
  }
  return null
}

// 查询订阅企业
export async function getSubscribeEnterpriseList(data) {
  try {
    let res = await get('/system/student/subscribeEnterprise/list', data)
    if(res && res.data){
    	return res.data
    }
  } catch (err) {
    console.log('查询订阅企业错误', err)
  }
  return null
}

//招聘日历--面试消息
export async function getInterviewList(data) {
  try {
    let res = await get('/system/student/interview/list', data)
    if(res && res.data){
    	return res.data
    }
  } catch (err) {
    console.log('查询面试消息错误', err)
  }
  return null
}


//接受面试
export async function saveInterview(data) {
  try {
    let res = await put('/system/student/interview', data)
    if(res && res.data){
    	return res.data
    }
  } catch (err) {
    console.log('接受面试错误', err)
  }
  return null
}

// offer消息列表
export async function getOfferList(data) {
  try {
    let res = await get('/system/student/offer/list', data)
    if(res && res.data){
    	return res.data
    }
  } catch (err) {
    console.log('查询offer消息错误', err)
  }
  return null
}

// 接受Offer
export async function saveOffer(data) {
  try {
    let res = await put('/system/student/offer', data)
    if(res && res.data){
    	return res.data
    }
  } catch (err) {
    console.log('接受Offer错误', err)
  }
  return null
}

// 修改普通消息
export async function saveInfo(data) {
  try {
    let res = await put('/system/student/info', data)
    if(res && res.data){
    	return res.data
    }
  } catch (err) {
    console.log('接受Offer错误', err)
  }
  return null
}

// 企业消息列表
export async function getInfoList(data) {
  try {
    let res = await get('/system/student/info/list', data)
    if(res && res.data){
    	return res.data
    }
  } catch (err) {
    console.log('查询企业消息错误', err)
  }
  return null
}

//查询学校列表
export async function getSpiderInfoList(data) {
  try {
    let res = await get('/system/spider/info/list', data)
		console.log('res',res)
    if(res && res.data && res.data.rows){
    	return res.data.rows || []
    }
  } catch (err) {
    console.log('查询企业列表错误', err)
  }
  return null
}

//查询学校专业列表
export async function getSpiderListBySchoolId(schoolId) {
  try {
    let res = await get('/system/spider/info/'+schoolId)
    if(res && res.data && res.data.data){
    	return res.data.data
    }
  } catch (err) {
    console.log('查询专业列表错误', err)
  }
  return null
}

// 查询企业列表
export async function getCompanyList(data) {
  try {
    let res = await get('/system/enterprise/list', data)
    if(res && res.data && res.data.rows){
    	return res.data.rows
    }
  } catch (err) {
    console.log('查询企业列表错误', err)
  }
  return null
}

//通过公司id查询公司展示信息
export async function getEnterpriseInfoByid(enterpriseId) {
  try {
    let res = await get(`/system/enterprise/all/info/${enterpriseId}`)
    if(res && res.data && res.data.data){
    	return res.data.data
    }
  } catch (err) {
    console.log('查询公司展示信息错误', err)
  }
  return null
}

// 我的投递岗位列表
export async function getMySelfDeliverList(data) {
  try {
    let res = await get('/system/student/myself/enterprise/post/list',data)
    if(res && res.data && res.data.rows){
    	return res
    }
  } catch (err) {
    console.log('查询企业列表错误', err)
  }
  return null
}


// 获取所有企业自创路线(routeType=0)的招聘会 或 人才中心发布的路线(routeType=1)的招聘会
export async function getAllRecruitmentConferenceList(data) {
  try {
    let res = await get('/system/recruitment/list',data)
    if(res && res.data && res.data.rows){
      return res
    }
  } catch (err) {
    console.log('获取企业路线错误', err)
  }
  return null
}


// 根据招聘路线获取该路线下所有的招聘会
export async function getRecruitmentConferenceListByRouteId(routeId) {
  try {
    let data = {
      routeId: routeId
    }
    let res = await get('/system/recruitment/all/list',data)
    if(res && res.data && res.data.rows){
      return res
    }
  } catch (err) {
    console.log('获取该路线招聘会列表出错', err)
  }
  return null
}


// 通过路线id获取路线下所有招聘的岗位
export async function getAllPositionsByRoute(data) {
  try {
    let res = await get('/system/recruitment/post/list',data)
    if(res && res.data && res.data.rows){
      return res
    }
  } catch (err) {
    console.log('获取招聘路线中的岗位发生错误', err)
  }
  return null
}

// 获取招聘路线的招聘岗位总需求人数
export async function getTotalRecruitmentPositionJobs(routeId) {
  try {
    let res = await get('/system/recruitment/post/total', {
      routeId: routeId
    })
    if(res && res.data){
      return res.data
    }
  } catch (err) {
    console.log('获取招聘岗位总需求人数错误', err)
  }
  return null
}

// 通过路线id获取该路线下所有企业的列表
export async function getAllEnterprisesByRoute(data) {
  try {
    let res = await get('/system/routeEnterpriseRecruitment/mini/enterprise/list',data)
    if(res && res.data && res.data.rows){
      return res
    }
  } catch (err) {
    console.log('获取所有报名企业发生错误', err)
  }
  return null
}

export async function getAllRouteEnterpriseRecruitment(data) {
  try {
    let res = await get('/system/routeEnterpriseRecruitment/mini/post/list',data)
    if(res && res.data && res.data.rows){
      return res
    }
  } catch (err) {
    console.log('获取所有报名企业发生错误', err)
  }
  return null
}

//筛选学校匹配的路线中的岗位
export async function getRecommendPositionListByspecial(data) {
  try {
    let res = await get('/system/route/post/search',data)
    if(res && res.data){
      return res
    }
  } catch (err) {
    console.log('获取根据专业名称推荐的岗位出错', err)
  }
  return null
}

// 申请成为校园大使
export async function addAmbassador(data) {
  try {
    let res = await post('/system/ambassador', data)
    if(res && res.data){
			return res
		}
  } catch (err) {
    console.log('申请成为校园大使', err)
  }
  return null
}


export async function addCampusShare(data) {
  try {
    let res = await post('/system/campus/share', data)
    if(res && res.data){
			return res
		}
  } catch (err) {
    console.log('校园大使分享、查看添加次数', err)
  }
  return null
}



// 申请成为校园大使
export async function updateAmbassador(data) {
  try {
    let res = await put('/system/ambassador', data)
    if(res && res.data){
			return res
		}
  } catch (err) {
    console.log('申请成为校园大使', err)
  }
  return null
}

export async function getAmbassadorRanking(data) {
  try {
    let res = await get('/system/ambassador/enterprise/list', data)
    if(res && res.data && res.data.rows){
			return res.data.rows
		}
  } catch (err) {
    console.log('校园大使排名', err)
  }
  return []
}


// 查询校园大使信息
export async function getAmbassadorById(id) {
  try {
    let res = await get(`/system/ambassador/${id}`)
    if(res && res.data && res.data.data){
    	return res.data.data
    }
  } catch (err) {
    console.log('查询企业列表错误', err)
  }
  return null
}
//查询校园大使全部的岗位信息
export async function getAmbassaAllList(data) {
  try {
    let res = await get(`/system/ambassador/listAll`,data)
    if(res && res.data && res.data.data){
    	return res.data.data
    }
  } catch (err) {
    console.log('查询企业列表错误', err)
  }
  return null
}

export async function getBannerList() {
  try {
    let res = await get(`/system/banner/list`)
    if (res && res.data && res.data.rows) {
      return res.data.rows
    }
  } catch (err) {
    console.log('获取广告列表错误', err)
  }
  return null
}




//退出登录
export async function studentOut(data) {
  try {
    let res = await get(`/system/student/mini/out`,data)
    if(res && res.data){
    	return res.data
    }
  } catch (err) {
    console.log('退出登录', err)
  }
  return null
}


//上传文件
export async function uploadFile(tempFilePaths) {
  try {
    if (!tempFilePaths.length) return
    const path = tempFilePaths.pop()
    const [err, res] = await uni.uploadFile({
      url: baseUrl + '/system/student/common/upload',
      filePath: path,
      name: 'file',
    })
    if (res.data) {
      let data = JSON.parse(res.data)
      return { url: data.url, name: data.fileName }
    }
    return file
  } catch (err) {
    console.log('上传文件错误', err)
  }
  return null
}
