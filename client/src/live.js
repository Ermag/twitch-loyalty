import Vue from 'vue'
import moment from 'vue-moment'
import './plugins/vuetify'
import './plugins/axios'
import App from './Live.vue'

Vue.config.productionTip = false

Vue.use(moment)

new Vue({
	render: h => h(App)
}).$mount('#app')
