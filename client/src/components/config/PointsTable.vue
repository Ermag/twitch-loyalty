<template>
	<v-alert class="subheading" v-model="isPointsInfo" color="info" icon="info" dismissible>
		Viewers start with <Points :value="STARTING_POINTS" :name="POINTS_NAME" :img="POINTS_IMG" /> and receive <strong style="font-size: 15px;">X</strong> amount every minute they watch your stream, based on their status.
		<table class="table pt-2">
			<thead>
				<tr>
					<th class="text-xs-left">Time/Status</th>
					<th>Minute</th>
					<th>Hour</th>
					<th>Day</th>
					<th>Week</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<th class="text-xs-left">Viewer</th>
					<td class="text-xs-right"><Points :value="BASE_POINTS" :name="POINTS_NAME" :img="POINTS_IMG" /></td>
					<td class="text-xs-right"><Points :value="BASE_POINTS * 60" :name="POINTS_NAME" :img="POINTS_IMG" /></td>
					<td class="text-xs-right"><Points :value="BASE_POINTS * 1440" :name="POINTS_NAME" :img="POINTS_IMG" /></td>
					<td class="text-xs-right"><Points :value="BASE_POINTS * 10080" :name="POINTS_NAME" :img="POINTS_IMG" /></td>
				</tr>
				<tr>
					<th class="text-xs-left">Follower</th>
					<td class="text-xs-right"><Points :value="BASE_POINTS * FOLLOWER_MULTIPLIER" :name="POINTS_NAME" :img="POINTS_IMG" /></td>
					<td class="text-xs-right"><Points :value="BASE_POINTS * 60 * FOLLOWER_MULTIPLIER" :name="POINTS_NAME" :img="POINTS_IMG" /></td>
					<td class="text-xs-right"><Points :value="BASE_POINTS * 1440 * FOLLOWER_MULTIPLIER" :name="POINTS_NAME" :img="POINTS_IMG" /></td>
					<td class="text-xs-right"><Points :value="BASE_POINTS * 10080 * FOLLOWER_MULTIPLIER" :name="POINTS_NAME" :img="POINTS_IMG" /></td>
				</tr>
				<tr>
					<th class="text-xs-left">Subscriber</th>
					<td class="text-xs-right"><Points :value="BASE_POINTS * SUBSCRIBER_MULTIPLIER" :name="POINTS_NAME" :img="POINTS_IMG" /></td>
					<td class="text-xs-right"><Points :value="BASE_POINTS * 60 * SUBSCRIBER_MULTIPLIER" :name="POINTS_NAME" :img="POINTS_IMG" /></td>
					<td class="text-xs-right"><Points :value="BASE_POINTS * 1440 * SUBSCRIBER_MULTIPLIER" :name="POINTS_NAME" :img="POINTS_IMG" /></td>
					<td class="text-xs-right"><Points :value="BASE_POINTS * 10080 * SUBSCRIBER_MULTIPLIER" :name="POINTS_NAME" :img="POINTS_IMG" /></td>
				</tr>
			</tbody>
		</table>
	</v-alert>
</template>

<script>
	import { APP_CONFIG } from '../../utils/constants'
	import Points from '../Points'

	export default {
		name: 'PointsTable',
		props: ['POINTS_NAME', 'POINTS_IMG'],
		components: {
			Points
		},
		data () {
			return {
				BASE_POINTS: APP_CONFIG.BASE_POINTS,
				STARTING_POINTS: APP_CONFIG.STARTING_POINTS,
				FOLLOWER_MULTIPLIER: APP_CONFIG.FOLLOWER_MULTIPLIER,
				SUBSCRIBER_MULTIPLIER: APP_CONFIG.SUBSCRIBER_MULTIPLIER,
				isPointsInfo: true
			}
		}
	}
</script>
