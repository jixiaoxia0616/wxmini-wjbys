export default {
	 /**
		 *
		 * @param {日期格式} date
		 * @param {分隔符} seperator
		 */
	  formateDate (date, seperator = '-', onlyTime = false) {
	    if (Number(date) > 0) {
	      date = new Date(date)
	    } else {
	      date = new Date()
	    }
	
	    let year = date.getFullYear()
	    let month = date.getMonth() + 1
	    let strDate = date.getDate()
	
	    let hour = date.getHours()
	    let min = date.getMinutes()
	    let sec = date.getSeconds()
	
	    if (hour >= 0 && hour <= 9) {
	      hour = '0' + hour
	    }
	    if (min >= 0 && min <= 9) {
	      min = '0' + min
	    }
	    if (sec >= 0 && sec <= 9) {
	      sec = '0' + sec
	    }
	
	    if (month >= 1 && month <= 9) {
	      month = '0' + month
	    }
	    if (strDate >= 0 && strDate <= 9) {
	      strDate = '0' + strDate
	    }
	    let currentdate = year + seperator + month + seperator + strDate
	    if (onlyTime) {
	      currentdate = `${hour}:${min}:${sec}`
	    }
	    return currentdate
	  },
}