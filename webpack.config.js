const portfinder = require('portfinder')
const webpackConfig = require('./webpack.config.base')

portfinder.basePort = webpackConfig.devServer.port
module.exports = portfinder.getPortPromise()
    .then(port => {
        webpackConfig.devServer.port = port
        return webpackConfig
    })
    .catch(err => err)
