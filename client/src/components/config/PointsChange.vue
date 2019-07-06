<template>
	<div>
		<h5 class="headline" style="display: flex; align-items: center;">
			<div style="flex-grow: 1;">Loyalty Points <Points :value="-1" :name="POINTS_NAME" :img="POINTS_IMG" :size="23" /></div>
			<v-btn color="success" :disabled="!isValid" @click="save" outline>Save</v-btn>
		</h5>
		<v-form v-model="isValid" ref="addForm">
			<v-layout>
				<v-flex xs12 md6 class="px-2">
					<v-text-field label="Name" v-model="currencyName" :rules="[rules.required, rules.name, rules.notBits]" maxlength="20" counter></v-text-field>
				</v-flex>
				<v-flex xs12 md6 class="px-2">
					<div>
						<v-text-field placeholder="Select PNG 32x32px" @click="pickFile()" label="Image"></v-text-field>
						<input type="file" ref="image" accept="image/*" style="display: none;" />
					</div>
				</v-flex>
			</v-layout>
		</v-form>

		<v-snackbar v-model="message.isVisible" :color="message.type" :timeout="message.timeout" top>
			{{ message.text }}
			<v-btn @click="message.isVisible = false" dark flat>Close</v-btn>
		</v-snackbar>
	</div>
</template>

<script>
	import { EventBus } from '../../utils/event-bus'
	import Points from '../Points'

	export default {
		name: 'Options',
		props: ['channel', 'POINTS_NAME', 'POINTS_IMG'],
		components: {
			Points
		},
		data () {
			return {
				isValid: true,
				currencyName: this.$props.POINTS_NAME,
				rules: {
					required: value => !!value || 'Required',
					name: value => (value && value.length <= 20) || 'Max 20 characters',
					notBits: value => value.trim().toLowerCase() !== 'bits' || 'Can\'t be Bits'
				},
				message: {
					isVisible: false,
					type: '',
					text: '',
					timeout: 6000
				}
			}
		},
		methods: {
			pickFile (type) {
				this.$refs['image'].click()
			},
			setMessage (type, text) {
				this.message.type = type
				this.message.text = text
				this.message.isVisible = true
			},
			save () {
				if (this.$refs.addForm.validate()) {
					if (this.$refs['image'].files.length) {
						let reader = new FileReader()

						reader.onload = (e) => {
							let img = new Image()

							img.onload = () => {
								if (img.width !== 32 && img.height !== 32) {
									this.setMessage('error', 'Currency image size should be 32x32 pixels.')
									window.scrollTo(0, 0)
								} else {
									let data = new FormData()
									data.append('name', this.currencyName)
									data.append('image', this.$refs['image'].files[0])

									this.axios.put(`${process.env.VUE_APP_API}channel?cid=${this.channel._id}`, data).then(res => {
										EventBus.$emit('channelChange', res.data)

										this.setMessage('success', 'You have successfuly updated your options.')
									}).catch(() => {
										this.setMessage('error', 'Something went wrong :( Please, try again later.')
									}).then(() => {
										window.scrollTo(0, 0)
									})
								}
							}

							img.src = e.target.result
						}

						reader.readAsDataURL(this.$refs['image'].files[0])
					} else {
						this.axios.put(`${process.env.VUE_APP_API}channel?cid=${this.channel._id}`, {
							name: this.currencyName
						}).then(res => {
							EventBus.$emit('channelChange', res.data)

							this.setMessage('success', 'You have successfuly changed your currency.')
						}).catch(() => {
							this.setMessage('error', 'Something went wrong :( Please, try again later.')
						}).then(() => {
							window.scrollTo(0, 0)
						})
					}
				}
			}
		}
	}
</script>
