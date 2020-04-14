// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react'
import ReactDOM from 'react-dom'
import VentilatorTree from '../components/ventilatorTree'

// if the javascript_pack_tag includes 'data_demo': 'true', like this:
// <%= javascript_pack_tag 'dashboard', 'data-demo': 'true' %>
// Then the home page will use a hard-coded organizaiton/cluster/ventilator tree
// and simulate the polled values. Otherwise, it will read the tree from the API
// and poll the ventilators (using their host names)

let launch = () => {
  let element = document.getElementById('index-demo-container')
  if (element) {
    let link = document.querySelector('script[data-demo]');
    let demo = (link.getAttribute('data-demo') == 'true')

    ReactDOM.render(
      <VentilatorTree demo={demo}/>,
      element
    )
  }
}

if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', launch)
} else {
  launch()
}
