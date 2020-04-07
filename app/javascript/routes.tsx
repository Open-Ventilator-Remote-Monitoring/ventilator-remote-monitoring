import React from 'react'
import {
  Route,
  Switch
} from 'react-router-dom'

import About from './components/about'
import Ventilators from './components/ventilators'
import Contribute from './components/contribute'
import Demo from './components/demo'

const Routes = () => (
    <Switch>
      <Route path="/" exact component={Ventilators} />
      <Route path="/about" component={About} />
      <Route path="/contribute" component={Contribute} />
      <Route path="/demo" component={Demo} />
    </Switch>
)

export default Routes

