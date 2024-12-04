const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	mode: 'production',
	stats: 'minimal',
	entry: {
		index: './src/index.ts',
		accordion: './src/plugins/accordion/index.ts',
		carousel: './src/plugins/carousel/index.ts',
		collapse: './src/plugins/collapse/index.ts',
		combobox: './src/plugins/combobox/index.ts',
		'copy-markup': './src/plugins/copy-markup/index.ts',
		datatable: './src/plugins/datatable/index.ts',
		dropdown: './src/plugins/dropdown/index.ts',
		'file-upload': './src/plugins/file-upload/index.ts',
		'input-number': './src/plugins/input-number/index.ts',
		'layout-splitter': './src/plugins/layout-splitter/index.ts',
		overlay: './src/plugins/overlay/index.ts',
		'pin-input': './src/plugins/pin-input/index.ts',
		'range-slider': './src/plugins/range-slider/index.ts',
		'remove-element': './src/plugins/remove-element/index.ts',
		scrollspy: './src/plugins/scrollspy/index.ts',
		select: './src/plugins/select/index.ts',
		stepper: './src/plugins/stepper/index.ts',
		'strong-password': './src/plugins/strong-password/index.ts',
		tabs: './src/plugins/tabs/index.ts',
		'textarea-auto-height': './src/plugins/textarea-auto-height/index.ts',
		'theme-switch': './src/plugins/theme-switch/index.ts',
		'toggle-count': './src/plugins/toggle-count/index.ts',
		'toggle-password': './src/plugins/toggle-password/index.ts',
		tooltip: './src/plugins/tooltip/index.ts',
		'tree-view': './src/plugins/tree-view/index.ts',

		// Helpers
		'helper-apexcharts': './src/helpers/apexcharts/index.ts',
		'helper-clipboard': './src/helpers/clipboard/index.ts',
	},
	module: {
		rules: [
			{ test: /\.ts?$/, enforce: 'pre', use: ['source-map-loader'] },
			{
				test: /\.ts?$/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							configFile: 'tsconfig.mjs.json',
						},
					},
				],
				exclude: /node_modules/,
			},
		],
	},
	experiments: {
		outputModule: true,
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].mjs',
		libraryTarget: 'module',
	},
	externals: {
		jquery: 'jQuery',
		lodash: '_',
		'datatable.net-dt': 'DataTable',
		dropzone: 'Dropzone',
		clipboard: 'ClipboardJS',
		noUiSlider: 'noUiSlider',
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
