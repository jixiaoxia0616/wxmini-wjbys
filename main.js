import App from './App.vue'
import common from '@/utils/common.js'

const host = 'https://unidemo.dcloud.net.cn/';

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
Vue.prototype.$host = host;
// 日期格式化
Vue.prototype.$formateDate = common.formateDate
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
