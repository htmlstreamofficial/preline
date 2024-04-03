const fs = require('fs');

const pluginsDir = './src/plugins';
const distDir = './dist';
const excludePlugins = ['base-plugin'];

const outputConfig = { noBanner: true };

const config = {
	compilationOptions: {
		preferredConfigPath: './tsconfig.json',
	},
	entries: [
		{
			filePath: './src/index.ts',
			outFile: './dist/index.d.ts',
			output: outputConfig,
		},
		...fs
			.readdirSync(pluginsDir)
			.map((pluginName) => {
				if (
					!fs.lstatSync(`${pluginsDir}/${pluginName}`).isDirectory() ||
					excludePlugins.includes(pluginName)
				) {
					return null;
				}

				return {
					filePath: `${pluginsDir}/${pluginName}/index.ts`,
					outFile: `${distDir}/${pluginName}.d.ts`,
					output: outputConfig,
				};
			})
			.filter(Boolean),
	],
};

module.exports = config;
