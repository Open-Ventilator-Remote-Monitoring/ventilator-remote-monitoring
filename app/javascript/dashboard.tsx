// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react'
import ReactDOM from 'react-dom'
import VentilatorTree from './components/ventilatorTree'

// Normally, when the browser links to another page, all resources from the previous
// page are cleaned up, including the React root and it's decendents and any timers
// they created.
// But we are using Turbolinks (https://github.com/turbolinks/turbolinks), which is
// a single-page-app that requests the HTML for the next page and simply replaces
// the existing DOM contents, leaving the previous React app and all of the timers running.

// if the div with ID "index-demo-container" includes 'data_demo': 'true', like this:
// <div id="index-demo-container" data-demo="true"> </div>
// Then the VentilatorTree will use a hard-coded organizaiton/cluster/ventilator tree
// and simulate the polled values. Otherwise, it will read the tree from the API
// and poll the ventilators (using their host names)


// see: https://www.honeybadger.io/blog/turbolinks/

let mount = () => {
  // if the cached version is being displayed, don't waste time mounting
  // only to unmount when the non-cached version is displayed
  if (document.documentElement.hasAttribute("data-turbolinks-preview")) {
    // console.log("it's only a preview")
    return
  }
  let element = document.getElementById('index-demo-container')
  if (element) {
    // console.log(`Mounting React root`)
    let demo = (element.getAttribute('data-demo') == 'true')

    ReactDOM.render(
      <VentilatorTree demo={demo}/>,
      element
    )
  }
}

let unmount = () => {
  let element = document.getElementById('index-demo-container')
  if (element) {
    // console.log(`Unmounting React root`)
    ReactDOM.unmountComponentAtNode(element)
  }
}

// Called once after the initial page has loaded
document.addEventListener(
  'turbolinks:load',
  () => {
    // console.log('turbolinks:load received')
    mount()
  },
  { once: true }
)

// Called after every non-initial page load
document.addEventListener('turbolinks:render', (e) => {
  // console.log(`turbolinks:render received. e is ${JSON.stringify(e, null, 2)}`)
  mount()
})

// tear-down each page
document.addEventListener('turbolinks:before-render', (e) => {
  // console.log(`turbolinks:before-render received. e is: ${JSON.stringify(e, null, 2)}`)
  unmount()
})
