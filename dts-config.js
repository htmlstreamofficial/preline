const fs = require('fs');

const pluginsDir = './src/plugins';
const helpersDir = './src/helpers';
const distDir = './dist';
const excludePlugins = ['base-plugin', 'docs-scrollspy'];

const outputConfig = { noBanner: true };

const config = {
	compilationOptions: {
		preferredConfigPath: './tsconfig.json',
	},
	entries: [
		{
			filePath: './src/globals.ts',
			outFile: './dist/globals.d.ts',
			output: outputConfig,
		},
		{
			filePath: './src/index.ts',
			outFile: './dist/index.d.ts',
			output: outputConfig,
		},
		{
			filePath: './src/auto/index.ts',
			outFile: './dist/auto.d.ts',
			output: outputConfig,
		},
		...fs
			.readdirSync(pluginsDir)
			.map((pluginName) => writeFile(pluginsDir, pluginName))
			.filter(Boolean),
		...fs
			.readdirSync(helpersDir)
			.map((pluginName) => writeFile(helpersDir, pluginName, 'helper-'))
			.filter(Boolean),
	],
};

function writeFile(dir, plugin, prefix = '') {
	const pluginDir = `${dir}/${plugin}`;
	if (!fs.lstatSync(pluginDir).isDirectory() || excludePlugins.includes(plugin)) {
		return null;
	}

	const corePath = `${pluginDir}/core.ts`;
	const indexPath = `${pluginDir}/index.ts`;
	let filePath = indexPath;

	if (fs.existsSync(corePath)) {
		filePath = corePath;
	} else if (!fs.existsSync(indexPath)) {
		return null;
	}

	return {
		filePath,
		outFile: `${distDir}/${prefix}${plugin}.d.ts`,
		output: outputConfig,
	};
}

module.exports = config;
