<style lang="scss" scoped>
	$chestWidth: 120px;

	.chest {
		display: block;
		width: $chestWidth;
		height: 102px;
		margin-top: 4px;
		background: url('../../assets/chests.png') no-repeat;
		transition: opacity .25s;

		&:hover {
			opacity: 0.8;
		}

		&.alter-250 {
			background-position: $chestWidth * -1 0px;
		}
		&.alter-500 {
			background-position: $chestWidth * -2 0px;
			margin-top: 15px;
		}
		&.alter-1000 {
			background-position: $chestWidth * -3 0px;
			margin-top: 15px;
		}
	}

	.flex:nth-child(even) {
		padding-left: 13px !important;
	}
</style>

<template>
	<v-layout class="store-wrapper">
		<v-container grid-list-md fluid>
			<v-layout row wrap>
				<v-flex @click="makePurchase(product)" v-for="product in products" :key="product.sku" class="px-0 pointer" xs6>
					<v-tooltip nudge-top="120" bottom>
						<div :class="['chest', 'mb-1', product.sku]" slot="activator"></div>
						<span>{{ product.name }}</span>
					</v-tooltip>

					<Points :value="product.value" :name="POINTS_NAME" :img="POINTS_IMG" :size="20" pos="bottom" :css="'pointer med-points'" />
					<span :style="{ fontSize: '18px', verticalAlign: 'middle', visibility: product.bonus ? 'visible' : 'hidden' }"> +{{ product.bonus }}</span>
				</v-flex>
			</v-layout>
        </v-container>

		<v-snackbar v-model="message.status" :color="message.color" :timeout="6000" top absolute>
			<span class="subheading" style="line-height: normal;">{{ message.text }}</span>
			<v-btn @click="message.status = false" dark flat>Close</v-btn>
		</v-snackbar>
	</v-layout>
</template>

<script>
	import { EventBus } from '../../utils/event-bus'
	import Points from '../Points'

	export default {
		name: 'Store',
		props: ['user', 'POINTS_NAME', 'POINTS_IMG'],
		components: {
			Points
		},
		data () {
			return {
				products: [],
				message: {
					status: false,
					color: 'success',
					text: 'n/a'
				}
			}
		},
		methods: {
			makePurchase (product) {
				window.Twitch.ext.bits.useBits(product.sku)
			},
			openMessage (text, type) {
				this.message.text = text
				this.message.color = type
				this.message.status = true
			}
		},
		created () {
			window.Twitch.ext.bits.onTransactionComplete(transaction => {
				if (transaction.initiator === 'current_user') {
					this.axios.post(`${process.env.VUE_APP_API}payment`, {
						user: this.user._id,
						...transaction
					}).then(res => {
						EventBus.$emit('claimedReward', {
							points: res.data * -1,
							experience: 0
						})

						this.openMessage(`Thank you for purchasing ${transaction.product.displayName}!`, 'success')
					}).catch(() => {
						this.openMessage('Something went wrong, please try again later!', 'error')
					})
				}
			})

			window.Twitch.ext.bits.getProducts().then(products => {
				let list = []

				products.sort((a, b) => a.cost.amount - b.cost.amount)

				products.forEach(p => {
					let value = 0
					let bonus = 0

					switch (p.cost.amount) {
					case 100:
						value = 500
						break
					case 250:
						value = 1250
						bonus = 40
						break
					case 500:
						value = 2500
						bonus = 150
						break
					default:
						value = 5000
						bonus = 450
					}

					list.push({
						name: p.displayName,
						sku: p.sku,
						cost: p.cost.amount,
						value: value,
						bonus: bonus
					})

					this.products = list
				})
			})
		}
	}
</script>
