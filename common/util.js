function friendlyDate(timestamp) {
	var formats = {
		'year': '%n% 年前',
		'month': '%n% 月前',
		'day': '%n% 天前',
		'hour': '%n% 小时前',
		'minute': '%n% 分钟前',
		'second': '%n% 秒前',
	};

	var now = Date.now();
	var seconds = Math.floor((now - timestamp) / 1000);
	var minutes = Math.floor(seconds / 60);
	var hours = Math.floor(minutes / 60);
	var days = Math.floor(hours / 24);
	var months = Math.floor(days / 30);
	var years = Math.floor(months / 12);

	var diffType = '';
	var diffValue = 0;
	if (years > 0) {
		diffType = 'year';
		diffValue = years;
	} else {
		if (months > 0) {
			diffType = 'month';
			diffValue = months;
		} else {
			if (days > 0) {
				diffType = 'day';
				diffValue = days;
			} else {
				if (hours > 0) {
					diffType = 'hour';
					diffValue = hours;
				} else {
					if (minutes > 0) {
						diffType = 'minute';
						diffValue = minutes;
					} else {
						diffType = 'second';
						diffValue = seconds === 0 ? (seconds = 1) : seconds;
					}
				}
			}
		}
	}
	return formats[diffType].replace('%n%', diffValue);
}

// 日期格式化
function parseTime(time, pattern) {
	if (arguments.length === 0 || !time) {
		return null
	}
	const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
			time = parseInt(time)
		} else if (typeof time === 'string') {
			time = time.replace(new RegExp(/-/gm), '/').replace('T', ' ').replace(new RegExp(/\.[\d]{3}/gm), '');
		}
		if ((typeof time === 'number') && (time.toString().length === 10)) {
			time = time * 1000
		}
		date = new Date(time)
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}
	const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
		let value = formatObj[key]
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') {
			return ['日', '一', '二', '三', '四', '五', '六'][value]
		}
		if (result.length > 0 && value < 10) {
			value = '0' + value
		}
		return value || 0
	})
	return time_str
}

// 防抖
function debounce(func, delay) {
	let timer
	console.log('timer',timer,delay)
	return function(...args) {
		console.log('执行开始----',args)
		if (timer) clearTimeout(timer)
		timer = setTimeout(() => {
			func.apply(this, args)
			console.log('执行',timer,delay)
		}, delay)
	}
}
//面试邀请通知
const INTERVIEW_MSG_TEMPLATE_ID = 'GCMZT4v2trGxLqCV-RxJZoD_m4sxcIPkZOOXg26a3eI'
//职位申请通知
const RECRUITMENT_UPDATE_MSG_TEMPLATE_ID = '5Hdl-SDTxGTeC151ReNWNCsGi3o77JYwcWi8g0mjWHs'

function openSubscribeAuth() {
	wx.requestSubscribeMessage({
		tmplIds: [INTERVIEW_MSG_TEMPLATE_ID, RECRUITMENT_UPDATE_MSG_TEMPLATE_ID],
		success (res) {
			console.log("成功开启订阅", res)
		}
	})
}
/**
 * 开启朋友圈分享功能
 * https://blog.csdn.net/qq_44242030/article/details/125656155
 * @description 监听路由切换/自动执行
 * @return void
 */
function overShare() {
	wx.onAppRoute((res) => {
		// console.log('route', res)
		let pages = getCurrentPages()
		let view = pages[pages.length - 1]
		if(view) {
			wx.showShareMenu({
				menus: ['shareAppMessage', 'shareTimeline'],
				success(res) {},
				fail(e) {}
			})
		}
	})
}

export {
	friendlyDate,
	parseTime,
	debounce,
	openSubscribeAuth,
	overShare
}
