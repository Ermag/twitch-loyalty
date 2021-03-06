const fs = require('fs')

module.exports = {
	runtimeCompiler: true,
	devServer: {
		port: 9000,
		https: {
			key: fs.readFileSync('../ssl/local.key'),
			cert: fs.readFileSync('../ssl/local.pem')
		}
	},

	pages: {
		viewer: {
			entry: 'src/viewer.js',
			template: 'public/index.html', // the source template
			filename: 'index.html', // output as dist/index.html
			title: 'Viewer'
		},
		config: {
			entry: 'src/config.js',
			template: 'public/index.html',
			filename: 'config.html',
			title: 'Config'
		},
		live: {
			entry: 'src/dashboard.js',
			template: 'public/index.html',
			filename: 'live.html',
			title: 'Live Dashboard'
		}
	},

	publicPath: '',
	outputDir: undefined,
	assetsDir: undefined,
	productionSourceMap: undefined,
	parallel: undefined,
	css: undefined
}
