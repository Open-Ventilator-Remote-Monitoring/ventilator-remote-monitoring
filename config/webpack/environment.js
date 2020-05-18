const { environment } = require('@rails/webpacker')
const typescript =  require('./loaders/typescript')

environment.loaders.prepend('typescript', typescript)

const webpack = require('webpack')
environment.plugins.append('Provide',
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    Popper: ['popper.js', 'default']
  })
)

module.exports = environment
