import Vue from 'vue'
import Vuebar from 'vuebar'
import './plugins/vuetify'
import './plugins/axios'
import App from './Viewer.vue'

Vue.use(Vuebar)

Vue.config.productionTip = false

new Vue({
	render: h => h(App)
}).$mount('#app')
