module.exports = {
	root: true,
	env: {
		node: true
	},
	'extends': [
		'plugin:vue/essential',
		'@vue/standard'
	],
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		"no-tabs": 0,
		"indent": [2, "tab"],
		"vue/script-indent": ["error", "tab", { "baseIndent": 1 }]
	},
	"overrides": [
		{
			"files": ["*.vue"],
			"rules": {
				"indent": "off"
			}
		}
	],
	parserOptions: {
		parser: 'babel-eslint'
	}
}
