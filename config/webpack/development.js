const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const path = require("path");

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const environment = require('./environment')

environment.plugins.append(
  "ForkTsCheckerWebpackPlugin",
  new ForkTsCheckerWebpackPlugin({
    // this is a relative path to your project's TypeScript config
    tsconfig: path.resolve(__dirname, "../../tsconfig.json"),
    // non-async so type checking will block compilation
    async: false,
  })
);

// to disable webpack optimization of JS so you can debug,
// add these lines (and comment out the existing export)

// const config = environment.toWebpackConfig()
// config.optimization ={minimize: false}
// module.exports = config

module.exports = environment.toWebpackConfig()
