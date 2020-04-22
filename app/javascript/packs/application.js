// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

require("@rails/ujs").start()
require("turbolinks").start()
// require("@rails/activestorage").start()
require("channels")
require("bootstrap/dist/js/bootstrap")

// import "@fortawesome/fontawesome-free/js/all";

import '../dashboard'

// This will fade out the Rails flash notice.
// Note that it does not remove error messages
const fadeOutFlashNotice = () => {
  var ele = $(".fade-msg").first()
  if (ele.length) {
    setTimeout(() => {
      ele.animate({marginTop: '-='+42},{always: () => {ele.remove()}})
    }, 2000)
  }
}

// document.addEventListener("turbolinks:load", () => {
$( document ).ready(() => {
  fadeOutFlashNotice()
})

// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)
