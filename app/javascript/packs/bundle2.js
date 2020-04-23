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