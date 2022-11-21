const path = require('path')

module.exports = {
    mode: 'production',
    watch: true,
    entry: {
        'preline': './src/index.js',
        'components/hs-accordion/hs-accordion': './src/components/hs-accordion/index.js',
        'components/hs-collapse/hs-collapse': './src/components/hs-collapse/index.js',
        'components/hs-dropdown/hs-dropdown': './src/components/hs-dropdown/index.js',
        'components/hs-overlay/hs-overlay': './src/components/hs-overlay/index.js',
        'components/hs-remove-element/hs-remove-element': './src/components/hs-remove-element/index.js',
        'components/hs-scrollspy/hs-scrollspy': './src/components/hs-scrollspy/index.js',
        'components/hs-tabs/hs-tabs': './src/components/hs-tabs/index.js',
        'components/hs-tooltip/hs-tooltip': './src/components/hs-tooltip/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: {
            type: 'umd'
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: 'pre',
                use: ['source-map-loader'],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['', '.js']
    },
}