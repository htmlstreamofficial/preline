const fs = require("fs");
const path = require("path");
const { generateDtsBundle } = require("dts-bundle-generator");

const rootDir = path.resolve(__dirname, "..");
const srcDir = path.join(rootDir, "src");
const distDir = path.join(rootDir, "dist");
const tmpDir = path.join(rootDir, ".dts-tmp");

const pluginsDir = path.join(srcDir, "plugins");
const helpersDir = path.join(srcDir, "helpers");
const excludedPlugins = new Set(["base-plugin", "docs-scrollspy"]);

const ensureDist = () => {
	if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
};

const clearDistDts = () => {
	if (!fs.existsSync(distDir)) return;

	for (const name of fs.readdirSync(distDir)) {
		if (name.endsWith(".d.ts")) fs.rmSync(path.join(distDir, name), { force: true });
	}
};

const bundleTo = (inputFile, outFile) => {
	if (!fs.existsSync(inputFile)) return false;

	const [bundled] = generateDtsBundle(
		[
			{
				filePath: inputFile,
				output: {
					noBanner: true,
				},
			},
		],
		{
			preferredConfigPath: path.join(rootDir, "tsconfig.dts.json"),
		},
	);

	fs.writeFileSync(outFile, bundled);

	return true;
};

const bundleIndexDeclaration = () => {
	bundleTo(path.join(tmpDir, "auto", "index.d.ts"), path.join(distDir, "index.d.ts"));
};

const bundleNonAutoDeclaration = () => {
	bundleTo(path.join(tmpDir, "index.d.ts"), path.join(distDir, "non-auto.d.ts"));
};

const bundlePluginDeclarations = () => {
	if (!fs.existsSync(pluginsDir)) return;

	for (const pluginName of fs.readdirSync(pluginsDir)) {
		if (excludedPlugins.has(pluginName)) continue;

		const pluginSrcDir = path.join(pluginsDir, pluginName);

		if (!fs.lstatSync(pluginSrcDir).isDirectory()) continue;

		const pluginTmpDir = path.join(tmpDir, "plugins", pluginName);
		const coreDts = path.join(pluginTmpDir, "core.d.ts");
		const indexDts = path.join(pluginTmpDir, "index.d.ts");
		const outDts = path.join(distDir, `${pluginName}.d.ts`);

		bundleTo(coreDts, outDts) || bundleTo(indexDts, outDts);
	}
};

const bundleHelperDeclarations = () => {
	if (!fs.existsSync(helpersDir)) return;

	for (const helperName of fs.readdirSync(helpersDir)) {
		const helperSrcDir = path.join(helpersDir, helperName);

		if (!fs.lstatSync(helperSrcDir).isDirectory()) continue;

		const helperDts = path.join(tmpDir, "helpers", helperName, "index.d.ts");
		const outDts = path.join(distDir, `helper-${helperName}.d.ts`);

		bundleTo(helperDts, outDts);
	}
};

const bundleUtilsDeclaration = () => {
	const utilsDts = path.join(tmpDir, "utils", "index.d.ts");
	const outDts = path.join(distDir, "utils.d.ts");

	bundleTo(utilsDts, outDts);
};

const cleanupTmp = () => {
	if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });
};

const cleanupLegacyDistDirs = () => {
	for (const dirName of ["auto", "helpers", "plugins", "utils"]) {
		const target = path.join(distDir, dirName);

		if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true });
	}
};

ensureDist();
clearDistDts();

bundleIndexDeclaration();
bundleNonAutoDeclaration();
bundlePluginDeclarations();
bundleHelperDeclarations();
bundleUtilsDeclaration();

cleanupTmp();
cleanupLegacyDistDirs();
