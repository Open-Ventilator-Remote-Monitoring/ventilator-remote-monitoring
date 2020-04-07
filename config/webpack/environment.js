const { environment } = require('@rails/webpacker')
const typescript =  require('./loaders/typescript')

/*

// see https://gorails.com/forum/install-bootstrap-with-webpack-with-rails-6-beta

const webpack = require('webpack')
environment.plugins.append('Provide', new webpack.ProvidePlugin({
  $: 'jquery',
  jQuery: 'jquery',
  Popper: ['popper.js', 'default']
}))
*/

environment.loaders.prepend('typescript', typescript)
module.exports = environment
