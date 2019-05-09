module.exports = {
    entry: __dirname + '/src',
    output: {
        path: '/',
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: '/node_modules',
            loader: 'babel-loader',
                query: {
                    presets: ['env', 'react']
                },
            }
        ]
    },
    mode: 'development'
}

