import Vue from 'vue'
import './plugins/vuetify'
import './plugins/axios'
import App from './Live.vue'

Vue.config.productionTip = false

new Vue({
	render: h => h(App)
}).$mount('#app')
