module.exports = {
	runtimeCompiler: true,
	pages: {
		index: {
			entry: 'src/main.js',
			template: 'public/index.html', // the source template
			filename: 'index.html', // output as dist/index.html
			title: 'Index'
		},
		config: {
			entry: 'src/config.js',
			template: 'public/index.html',
			filename: 'config.html',
			title: 'Config'
		},
		live: {
			entry: 'src/live.js',
			template: 'public/index.html',
			filename: 'live.html',
			title: 'Live'
		}
	}
}
