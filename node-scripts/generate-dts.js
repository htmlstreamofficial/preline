const fs = require('fs');
const { execSync } = require('child_process');

const pluginsDir = './src/plugins';
const distDir = './dist';
const nodeScriptsDir = './node-scripts';
const excludePlugins = ['base-plugin'];

const startTime = Date.now();

fs.readdirSync(pluginsDir).forEach((pluginName) => {
	if (
		fs.lstatSync(`${pluginsDir}/${pluginName}`).isDirectory() &&
		!excludePlugins.includes(pluginName)
	) {
		const outputFile = `${distDir}/${pluginName}.d.ts`;

		console.log(`Generating .d.ts for ${pluginName}`);

		try {
			execSync(
				`npx dts-bundle-generator --no-banner -o ${distDir}/${pluginName}.d.ts ${pluginsDir}/${pluginName}/index.ts`,
			);
			console.log(`Generated ${pluginName}.d.ts successfully`);
		} catch (error) {
			console.error(`Error generating .d.ts for ${pluginName}:`, error);
		}
	} else {
		console.log(`Skipping ${pluginName}`);
	}
});

try {
	const outputFile = `${distDir}/index.d.ts`;

	console.log(`Generating .d.ts for MAIN`);

	execSync(
		`npx dts-bundle-generator --no-banner -o ${distDir}/index.d.ts ./src/index.ts`,
	);
	console.log(`Generated d.ts for MAIN successfully`);
} catch (error) {
	console.error(`Error generating .d.ts for MAIN:`, error);
}

console.log(`Ended after ${((Date.now() - startTime) / 10 / 60).toFixed()}s`);
