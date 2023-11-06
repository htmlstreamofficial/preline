const path = require('path');
const WebpackObfuscator = require('webpack-obfuscator');

module.exports = [
  {
    name: 'regular',
    mode: 'production',
    watch: true,
    entry: {
      index: './src/index.ts',
      accordion: './src/plugins/accordion/index.ts',
      'bunch-check': './src/plugins/bunch-check/index.ts',
      carousel: './src/plugins/carousel/index.ts',
      collapse: './src/plugins/collapse/index.ts',
      'copy-markup': './src/plugins/copy-markup/index.ts',
      dropdown: './src/plugins/dropdown/index.ts',
      'input-mask': './src/plugins/input-mask/index.ts',
      'input-number': './src/plugins/input-number/index.ts',
      overlay: './src/plugins/overlay/index.ts',
      'pin-input': './src/plugins/pin-input/index.ts',
      'remove-element': './src/plugins/remove-element/index.ts',
      scrollspy: './src/plugins/scrollspy/index.ts',
      select: './src/plugins/select/index.ts',
      stepper: './src/plugins/stepper/index.ts',
      'strong-password': './src/plugins/strong-password/index.ts',
      tabs: './src/plugins/tabs/index.ts',
      'toggle-count': './src/plugins/toggle-count/index.ts',
      'toggle-password': './src/plugins/toggle-password/index.ts',
      tooltip: './src/plugins/tooltip/index.ts',
    },
    module: {
      rules: [
        { test: /\.ts?$/, enforce: 'pre', use: ['source-map-loader'] },
        { test: /\.ts?$/, use: 'ts-loader', exclude: /node_modules/ }
      ],
    },
    resolve: { extensions: ['.ts', '.js'] },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      library: { type: 'umd' },
    },
  },
  {
    name: 'obfuscate',
    mode: 'production',
    watch: true,
    entry: './dist/index.js',
    output: {
      path: path.resolve(__dirname, 'live'),
      filename: 'index.js',
      library: { type: 'umd' },
    },
    plugins: [
      new WebpackObfuscator({ rotateStringArray: true })
    ],
  }
];
