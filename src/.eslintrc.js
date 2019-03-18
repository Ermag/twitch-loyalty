module.exports = {
	"env": {
		"browser": true,
		"commonjs": true,
		"es6": true
	},
	"extends": "standard",
	"rules": {
		"no-console": process.env.NODE_ENV === "production" ? "error" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
		"no-tabs": 0,
		"indent": [2, "tab"]
	},
	"globals": {
		"Atomics": "readonly",
		"SharedArrayBuffer": "readonly"
	},
	"parserOptions": {
		"ecmaVersion": 2018
	}
}
