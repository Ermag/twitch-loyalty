<template>
	<div style="height: 600px;">
		lololo
	</div>
</template>

<style lang="scss" scoped>

</style>

<script>
	export default {
		name: 'Profile',
		props: ['user', 'POINTS_NAME', 'POINTS_IMG'],
		data () {
			return {
				baseURL: process.env.VUE_APP_API
			}
		},
		methods: {
			test () {
				this.axios.get(`${process.env.VUE_APP_API}reward/ref?name=test`).then(res => {
					console.log(res.data)
					this.axios.post(`${process.env.VUE_APP_API}claim`, {
						reward: res.data._id,
						user: this.user._id,
						channel: this.user.channel._id
					}).then(res => {
						console.log(res.data)
					}).catch((err) => {
						console.log(err)
					}).then(() => {
						this.isLoading = false
					})
				}).catch(() => {
					this.hasError = true
				})
			}
		}
	}
</script>
