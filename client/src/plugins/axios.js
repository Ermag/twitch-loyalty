import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

axios.interceptors.response.use(function (response) {
	return response
}, function (error) {
	if (error.response.status === 401) {
		setTimeout(function () {
			window.location.reload()
		}, 2000)
	} else {
		return Promise.reject(error)
	}
})

Vue.use(VueAxios, axios)
