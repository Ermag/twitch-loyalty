<template>
	<div>
		Shop
	</div>
</template>

<style lang="scss" scoped>

</style>

<script>
	export default {
		name: 'Shop',
		props: ['user', 'POINTS_NAME', 'POINTS_IMG'],
		data () {
			return {
				baseURL: process.env.VUE_APP_API
			}
		},
		methods: {}
	}
</script>
