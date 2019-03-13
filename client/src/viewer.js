import Vue from 'vue'
import Vuebar from 'vuebar'
import './plugins/vuetify'
import './plugins/axios'
import { EventBus } from './utils/event-bus'
import App from './Viewer.vue'

Vue.use(Vuebar)

Vue.config.productionTip = false

let app

const initApp = () => {
	if (app) {
		app.$destroy()
	}

	app = new Vue({
		render: h => h(App)
	}).$mount('#app')
}

EventBus.$on('app-error', () => {
	initApp()
})

initApp()
