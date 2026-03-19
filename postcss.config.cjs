const pxtorem = require('@minko-fe/postcss-pxtorem')

module.exports = {
    plugins: [
        pxtorem({
            rootValue: 16,
            unitPrecision: 5,
            propList: ['*'],
            selectorBlackList: [],
            replace: true,
            mediaQuery: false,
            minPixelValue: 0,
            exclude: /node_modules/i
        })
    ]
}