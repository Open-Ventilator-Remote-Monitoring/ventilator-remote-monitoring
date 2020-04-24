process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const environment = require('./environment')

// to disable webpack optimization of JS so you can debug,
// add these lines (and comment out the existing export)

// const config = environment.toWebpackConfig()
// config.optimization ={minimize: false}
// module.exports = config

module.exports = environment.toWebpackConfig()
