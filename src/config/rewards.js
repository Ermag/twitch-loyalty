module.exports = {
	limit: 25, // Maximum amount of rewards for a channel
	defaults: [ // Set of rewards added for every channel on creation
		{
			name: 'Hi',
			points: 250,
			image: 'hello.png',
			sound: 'hello.wav'
		},
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
		}
	]
}
