<template>
	<v-tooltip :top="pos === 'top'" :bottom="pos === 'bottom'" style="font-size: 0; vertical-align: middle;">
		<span slot="activator" class="point-wrap">
			<img :src="baseURL + img" :alt="name" :width="size" /> <span class="point-num">{{ value >= 0 ? formatQuantity(Math.abs(value)) : '' }}</span>
		</span>
		<span>{{ this.name }}</span>
    </v-tooltip>
</template>

<style lang="scss" scoped>
	@import '../styles/_vars';

	.point-wrap {
		color: $primary;
		font-size: 0;
		line-height: normal;
	}
	.point-num {
		position: relative;
		font-weight: bold;
		font-size: 15px;
		vertical-align: middle;
	}
	img {
		position: relative;
		vertical-align: middle;
		margin-right: 3px;
	}
	span {
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
			pos: {
				type: String,
				default: 'top'
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
