<style lang="scss" scoped>
	$chestWidth: 120px;

	.chest {
		position: relative;
		width: $chestWidth;
		height: 102px;
		margin-top: 4px;
		background: url('../../assets/chests.png') no-repeat;
		cursor: pointer;
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
				<v-flex v-for="product in products" :key="product.sku" class="px-0" xs6>
					<div :class="['chest', 'mb-1', product.sku]"></div>
					<Points :value="product.value" :name="POINTS_NAME" :img="POINTS_IMG" :size="20" pos="bottom" :css="'pointer med-points'" />
					<span :style="{ fontSize: '18px', verticalAlign: 'middle', visibility: product.bonus ? 'visible' : 'hidden' }"> +{{ product.bonus }}</span>
				</v-flex>
			</v-layout>
        </v-container>
	</v-layout>
</template>

<script>
	import Points from '../Points'

	export default {
		name: 'Store',
		props: ['POINTS_NAME', 'POINTS_IMG'],
		components: {
			Points
		},
		data () {
			return {
				products: []
			}
		},
		created () {
			window.Twitch.ext.bits.getProducts().then(products => {
				console.log(products)
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
						name: p.name,
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
