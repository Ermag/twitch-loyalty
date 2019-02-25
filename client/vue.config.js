module.exports = {
    runtimeCompiler: true,

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
			entry: 'src/live.js',
			template: 'public/index.html',
			filename: 'live.html',
			title: 'Live'
		}
	},

    publicPath: '',
    outputDir: undefined,
    assetsDir: undefined,
    productionSourceMap: undefined,
    parallel: undefined,
    css: undefined
}
