import js from '@eslint/js';
import globals from 'globals';

export default [
	js.configs.recommended,

	{ ignores: [] },

	{
		plugins: {},
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.browser,
				foundry: 'readonly',
				game: 'readonly',
				CONST: 'readonly',
				CONFIG: 'readonly',
				Hooks: 'readonly',
			},
		},
	},
];
