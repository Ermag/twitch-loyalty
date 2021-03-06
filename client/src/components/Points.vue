<style lang="scss" scoped>
	@import '../styles/_vars';

	.point-wrap {
		color: $primary;
		font-size: 0;
		line-height: normal;
	}
	.point-tooltip {
		font-size: 0;
		vertical-align: middle;
		white-space: nowrap;
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

<template>
	<v-tooltip :top="pos === 'top'" :bottom="pos === 'bottom'" class="point-tooltip">
		<span slot="activator" class="point-wrap" @click="clicked" :class="{ pointer: $listeners.clicked }">
			<img :src="baseURL + img" :alt="name" :width="size" /> <span class="point-num" :class="[css]">{{ value >= 0 ? formatQuantity(Math.abs(displayNumber)) : '' }}</span>
		</span>
		<span>{{ this.name }}</span>
    </v-tooltip>
</template>

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
			css: {
				type: String,
				default: ''
			},
			name: String,
			img: String
		},
		data () {
			return {
				displayNumber: 0,
				interval: false,
				baseURL: process.env.VUE_APP_API
			}
		},
		methods: {
			formatQuantity: helpers.formatQuantity,
			clicked () {
				this.$emit('clicked')
			}
		},
		mounted () {
			this.displayNumber = this.value ? this.value : 0
		},
		watch: {
			value () {
				clearInterval(this.interval)

				if (this.value === this.displayNumber) {
					return
				}

				this.interval = setInterval(() => {
					if (this.displayNumber !== this.value) {
						let change = (this.value - this.displayNumber) / 10

						change = change >= 0 ? Math.ceil(change) : Math.floor(change)

						this.displayNumber = this.displayNumber + change
					}
				}, 20)
			}
		}
	}
</script>
