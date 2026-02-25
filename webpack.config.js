const path = require('path');
const fs = require('fs');
const TerserPlugin = require('terser-webpack-plugin');

const pluginsDir = path.resolve(__dirname, 'src/plugins');
const helperEntries = {
	'helper-shared': './src/helpers/shared/index.ts',
	'helper-apexcharts': './src/helpers/apexcharts/index.ts',
	'helper-clipboard': './src/helpers/clipboard/index.ts',
	utils: './src/utils/index.ts',
};
const excludedPluginEntries = new Set(['accessibility-manager', 'base-plugin']);

const pluginEntries = fs
	.readdirSync(pluginsDir)
	.filter((pluginName) => {
		if (excludedPluginEntries.has(pluginName)) return false;

		const pluginDir = path.join(pluginsDir, pluginName);
		if (!fs.lstatSync(pluginDir).isDirectory()) return false;

		return fs.existsSync(path.join(pluginDir, 'core.ts')) || fs.existsSync(path.join(pluginDir, 'index.ts'));
	})
	.reduce((acc, pluginName) => {
		const pluginDir = path.join(pluginsDir, pluginName);
		const entryFile = fs.existsSync(path.join(pluginDir, 'core.ts')) ? 'core.ts' : 'index.ts';

		acc[pluginName] = `./src/plugins/${pluginName}/${entryFile}`;

		return acc;
	}, {});

module.exports = {
	mode: 'production',
	stats: 'minimal',
	entry: {
		index: './src/auto/index.ts',
		'non-auto': './src/index.ts',
		...pluginEntries,
		...helperEntries,
	},
	module: {
		rules: [
			{ test: /\.ts?$/, enforce: 'pre', use: ['source-map-loader'] },
			{ test: /\.ts?$/, use: 'ts-loader', exclude: /node_modules/ },
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
		alias: {
			'VanillaCalendarPro': 'vanilla-calendar-pro'
		}
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js',
		library: { type: 'umd' },
	},
	externals: {
		jquery: 'jQuery',
		lodash: '_',
		apexcharts: 'ApexCharts',
		'datatable.net-dt': 'DataTable',
		dropzone: 'Dropzone',
		clipboard: 'ClipboardJS',
		noUiSlider: 'noUiSlider',
		VanillaCalendarPro: 'VanillaCalendarPro'
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
