import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import Routes from '../routes'
import NavBar from './navbar'

const App = () => (
  <Router>
    <NavBar />
    <div className="container" style={{marginTop: '3rem'}}>
      <Routes />
    </div>
  </Router>
)

export default App
