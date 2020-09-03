module.exports = {
	env: {
		commonjs: true,
		es6: true,
		node: true
	},
	extends: 'eslint:recommended',
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly'
	},
	parserOptions: {
		ecmaVersion: 2020
	},
	rules: {
		'no-console': ['warn', { allow: ['warn', 'info', 'error'] }],
		'quotes': ['error', 'single'],
		'semi': ['warn', 'never'],
		'max-len': [
			'error',
			{
				'code': 120,
				'ignoreComments': true,
				'ignoreTrailingComments': true,
				'ignoreUrls': true,
				'ignoreStrings': true,
				'ignoreTemplateLiterals': true,
				'ignoreRegExpLiterals': true
			}
		],
		'comma-dangle': ['error'],
		'no-unused-vars': 'warn', // не используеммые переменные,
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'windows'],
		semi: ['error', 'never'],
		'no-multiple-empty-lines': ['warn', { max: 2, maxEOF: 1 }] // пустые строки
	}
}
