// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

require("@rails/ujs").start()
require("turbolinks").start()
//require("@rails/activestorage").start()
//require("channels")

// Bootstrap
// Note: Boostrap 4.2.2 collapse currently does not work with jQuery 3.5
// Please stay on jQuery 3.4.1 until this is closed.
// https://github.com/twbs/bootstrap/issues/30553

//import 'bootstrap/js/dist/alert'
import 'bootstrap/js/dist/button'
//import 'bootstrap/js/dist/carousel'
import 'bootstrap/js/dist/collapse'
import 'bootstrap/js/dist/dropdown'
//import 'bootstrap/js/dist/model'
//import 'bootstrap/js/dist/popover'
//import 'bootstrap/js/dist/scrollspy'
//import 'bootstrap/js/dist/tab'
//import 'bootstrap/js/dist/toast'
//import 'bootstrap/js/dist/tooltip'
import 'bootstrap/js/dist/util'

// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)

// Support component names relative to this directory:
var componentRequireContext = require.context("src", true)
var ReactRailsUJS = require("react_ujs")
ReactRailsUJS.useContext(componentRequireContext)

// This will fade out the Rails flash notice.
// Note that it does not remove error messages
const fadeOutFlashNotice = () => {
  var ele = $(".fade-msg").first()
  if (ele.length) {
    setTimeout(() => {
      ele.animate({marginTop: '-=42'},
                  {always: () => {ele.remove()}})
    }, 2000)
  }
}

document.addEventListener("turbolinks:load", () => {
  fadeOutFlashNotice()
})
