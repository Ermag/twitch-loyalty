import Vue from 'vue'
import './plugins/vuetify'
import './plugins/axios'
import router from './utils/router'
import App from './Viewer.vue'

Vue.config.productionTip = false

new Vue({
	router,
	render: h => h(App)
}).$mount('#app')
