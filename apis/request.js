
export const baseUrl = 'https://bys.wjhr.net/prod-api'
// export const baseUrl = 'http://localhost:8080'

// get请求
export function get(url, data) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: baseUrl + url,
			method: 'GET',
			data: data,
			success: (res) => {
				resolve(res)
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}

export function post(url, data) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: baseUrl + url,
			method: 'POST',
			data: data,
			success: (res) => {
				resolve(res)
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}

export function put(url, data) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: baseUrl + url,
			method: 'PUT',
			data: data,
			success: (res) => {
				resolve(res)
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}

export function del(url, data) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: baseUrl + url,
			method: 'DELETE',
			data: data,
			success: (res) => {
				resolve(res)
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}
