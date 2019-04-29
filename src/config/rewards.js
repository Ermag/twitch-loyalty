module.exports = {
	limit: 25, // Maximum amount of rewards for a channel
	defaults: [ // Set of rewards added for every channel on creation
		{
			name: '<3',
			points: 250,
			image: 'heart.png'
		},
		{
			name: 'LUL',
			points: 250,
			image: 'lul.png',
			sound: 'lul.wav'
		},
		{
			name: 'Woohoo',
			points: 250,
			image: 'woohoo.png',
			sound: 'woohoo.wav'
		},
		{
			name: 'Challenge: Do the floss',
			points: 500,
			image: 'floss.gif'
		}
	]
}
