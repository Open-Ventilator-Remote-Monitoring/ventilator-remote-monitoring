// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react'
import ReactDOM from 'react-dom'
import VentilatorTree from '../components/ventilatorTree'

let launch = () => {
  let element = document.getElementById('index-demo-container')

  if (element) {
    ReactDOM.render(
      <VentilatorTree demo={true}/>,
      element
    )
  }
}

if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', launch)
} else {
  launch()
}

