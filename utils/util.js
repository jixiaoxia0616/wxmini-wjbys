import {
  getOpenIdByCode,
  getOnlyOpenIdByCode,
  getPhoneNumber,
} from '@/apis/api.js'
export async function wx_login() {
  try {
    let res = await new Promise(function (resolve, reject) {
      uni.login({
        provider: 'weixin',
				onlyAuthorize: true,
				success: function(loginRes) {
          resolve(loginRes)
        },
        fail: function (err) {
          reject(err)
        },
      })
    })
    return res
  } catch (err) {
    console.error('登录微信小程序获取code值失败', err)
  }
  return null
}

// 获取openid
export async function getOpenId() {
  let res = await wx_login()
  if (res && res.code) {
    let openid = await getOnlyOpenIdByCode({ code: res.code })
    console.log('getOpenId', openid, res)
    return openid
  }
  return null
}

// 登录
export async function login(loadingShow) {
  // return null
  if(getApp() && getApp().lobalData && getApp().globalData.wxUser && getApp().globalData.openid){
    return getApp().globalData.wxUser
  }
  if (loadingShow) {
    uni.showLoading({
      title: '正在登录...',
      mask: true,
    })
  }

  let res = await wx_login()
  if (res && res.code) {
    let openres = await getOpenIdByCode({ code: res.code })
    if (openres && openres.data && openres.data.code == 200) {
      console.log("getOpenIdByCode openres data", openres.data)
      try {
        getApp().globalData.openid = openres.data.openid
        getApp().globalData.wxUser = openres.data.wxUser
        if (openres.data.wxUser == null) {
          getApp().globalData.needRegistration = true
        } else {
          getApp().globalData.needRegistration = false
        }
        uni.hideLoading()
        return openres.data.wxUser || null
      } catch (err) {
        console.error(err)
      }
    }
  }
  uni.hideLoading()
  return null
}

export async function getPhone(code) {
  if (code) {
    let openres = await getPhoneNumber({ code: code })
    console.log('openres', openres)
    if (openres && openres.data && openres.data.msg) {
      return openres.data.msg
    }
  }
  return null
}

export function getUrlParams(url) {
  let o = {};
  if (url.indexOf("?") != -1) {
    let str = url.substr(url.indexOf("?") + 1).replace(/[#/|/#/]/g, "");

    let strs = str.split("&");

    for (let i = 0; i < strs.length; i++) {
      o[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
    }
  }
  return o;
}

export function isOverdue(dateTime) {
  if (!dateTime) {
    //如果dateTim为空，默认该时间过期
    return true
  }
  //苹果iOS系统上，new Date()里面无法传YYYY-MM-DD格式的字符串，只能改为YYYY/MM/DD的形式
  return new Date(dateTime.replace(/-/g, '/')).getTime() < new Date().getTime()
}

export function isToday(dateTime) {
  if (!dateTime) {
    //如果dateTim为空，默认该时间不是今天
    return false
  }
  // Create date from input value
  var inputDate = new Date(dateTime.replace(/-/g, '/'));
  // Get today's date
  var todaysDate = new Date();
  // call setHours to take the time out of the comparison
  if(inputDate.setHours(0,0,0,0) == todaysDate.setHours(0,0,0,0)) {
    // Date equals today's date
    return true
  } else {
    return false
  }
}

export function duringTheHoldingTime(startDateTime, endDateTime) {
  if (!startDateTime || !endDateTime) {
    //如果dateTime为空，则默认该时间不是在举办时间
    return false
  }
  // Create date from input value
  var startDate = new Date(startDateTime.replace(/-/g, '/'));
  var endDate = new Date(endDateTime.replace(/-/g, '/'));
  // Get today's date
  var currentDate = new Date();
  return currentDate > startDate && endDate > currentDate
}

/**
 *
 * @param {id} 身份证号码
 * @returns {boolean} 是否为正确的身份证号
 */
export function isValidIDCardNumber(id) {
  // 身份证号的长度和格式正则
  const idCardRegex = /^\d{17}[\dXx]$/;

  // 校验码权重数组
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];

  // 校验码映射表
  const checkCodeMap = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

  // 检查基本格式
  if (!idCardRegex.test(id)) {
      return false;
  }

  // 提取出生日期部分
  const birthDateStr = id.substring(6, 14);
  const year = parseInt(birthDateStr.substring(0, 4), 10);
  const month = parseInt(birthDateStr.substring(4, 6), 10);
  const day = parseInt(birthDateStr.substring(6, 8), 10);

  // 检查日期合法性
  const birthDate = new Date(year, month - 1, day);
  if (
      birthDate.getFullYear() !== year ||
      birthDate.getMonth() + 1 !== month ||
      birthDate.getDate() !== day
  ) {
      return false;
  }

  // 计算校验码
  const digits = id.toUpperCase().split('');
  let sum = 0;
  for (let i = 0; i < 17; i++) {
      sum += parseInt(digits[i], 10) * weights[i];
  }
  const calculatedCheckCode = checkCodeMap[sum % 11];

  // 校验最后一位
  return calculatedCheckCode === digits[17];
}


