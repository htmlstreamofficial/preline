const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	mode: 'production',
	watch: true,
	stats: 'minimal',
	entry: {
		index: './src/index.ts',
		accordion: './src/plugins/accordion/index.ts',
		carousel: './src/plugins/carousel/index.ts',
		collapse: './src/plugins/collapse/index.ts',
		combobox: './src/plugins/combobox/index.ts',
		'copy-markup': './src/plugins/copy-markup/index.ts',
		dropdown: './src/plugins/dropdown/index.ts',
		'input-number': './src/plugins/input-number/index.ts',
		overlay: './src/plugins/overlay/index.ts',
		'pin-input': './src/plugins/pin-input/index.ts',
		'remove-element': './src/plugins/remove-element/index.ts',
		scrollspy: './src/plugins/scrollspy/index.ts',
		select: './src/plugins/select/index.ts',
		stepper: './src/plugins/stepper/index.ts',
		'strong-password': './src/plugins/strong-password/index.ts',
		tabs: './src/plugins/tabs/index.ts',
		'theme-switch': './src/plugins/theme-switch/index.ts',
		'toggle-count': './src/plugins/toggle-count/index.ts',
		'toggle-password': './src/plugins/toggle-password/index.ts',
		tooltip: './src/plugins/tooltip/index.ts',
	},
	module: {
		rules: [
			{ test: /\.ts?$/, enforce: 'pre', use: ['source-map-loader'] },
			{ test: /\.ts?$/, use: 'ts-loader', exclude: /node_modules/ },
		],
	},
	resolve: { extensions: ['.ts', '.js'] },
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js',
		library: { type: 'umd' },
	},
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				extractComments: false,
			}),
		],
	},
};
