const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/scripts/main.js',
    output: {
        filename: 'index.js',
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|jpeg|gif|woff2)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.css$/i,
                use: [
                    'style-loader', 
                    'css-loader'
                ],
            },
            {
                test: /\.scss$/i,
                use: [
                  'style-loader',
                  'css-loader',
                  'sass-loader',
                ],
            },
            
        ]
    },
    plugins: [
        new HtmlWebpackPlugin(),
    ],
    devServer: {
        historyApiFallback: true,
        hot: true,
    },
    externalsType: 'script',
    externals: {
        ymaps: [
            'https://api-maps.yandex.ru/2.1/?apikey=27a58b67-7193-453f-acb5-c13a5844027f&load=Map,Placemark&lang=ru_RU',
            'ymaps',
        ]
    }
}