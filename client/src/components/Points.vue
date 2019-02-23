<template>
	<v-tooltip top>
		<template #activator="data">
			<span v-on="data.on" style="color: #e5c572"><img :src="baseURL + img" :alt="name" :width="size" /> {{ value >= 0 ? formatQuantity(Math.abs(value)) : '' }}</span>
		</template>
		<span>{{ this.name }}</span>
    </v-tooltip>
</template>

<style lang="scss" scoped>
	span {
		position: relative;
		font-weight: bold;
		font-size: 15px;
	}
	img {
		position: relative;
			top: -1px;
			left: 1px;
		vertical-align: middle;
	}
</style>

<script>
	import { helpers } from '../utils/helpers'

	export default {
		name: 'Points',
		props: {
			value: {
				type: Number,
				default: 0
			},
			size: {
				type: Number,
				default: 16
			},
			name: String,
			img: String
		},
		data () {
			return {
				baseURL: process.env.VUE_APP_API
			}
		},
		methods: {
			formatQuantity: helpers.formatQuantity
		}
	}
</script>
