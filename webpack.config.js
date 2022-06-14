const path = require('path')

module.exports = {
    mode: 'production',
    watch: true,
    entry: {
        'hs-ui.bundle': './src/index.js',
        'components/hs-accordion/hs-accordion': './src/components/hs-accordion/index.js',
        'components/hs-collapse/hs-collapse': './src/components/hs-collapse/index.js',
        'components/hs-dropdown/hs-dropdown': './src/components/hs-dropdown/index.js',
        'components/hs-mega-menu/hs-mega-menu': './src/components/hs-mega-menu/index.js',
        'components/hs-modal/hs-modal': './src/components/hs-modal/index.js',
        'components/hs-offcanvas/hs-offcanvas': './src/components/hs-offcanvas/index.js',
        'components/hs-remove-element/hs-remove-element': './src/components/hs-remove-element/index.js',
        'components/hs-scrollspy/hs-scrollspy': './src/components/hs-scrollspy/index.js',
        'components/hs-sidebar/hs-sidebar': './src/components/hs-sidebar/index.js',
        'components/hs-smooth-scroll/hs-smooth-scroll': './src/components/hs-smooth-scroll/index.js',
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