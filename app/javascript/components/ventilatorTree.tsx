import React, { Component } from "react"
import Jsona from 'jsona'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import ReactDOM from 'react-dom'

import Organization from "./organization"
import { get } from '../api'
import { sortObjects } from '../utils'
import { IOrganization } from "../types"

const VENTILATORS_API_URI = '/api/v1/ventilators'
const DOM_ELEMENT_ID_WHERE_MOUNTED = 'index-demo-container'

// create a demo org with two clusters
let demoOrg : IOrganization = {
  id: 1,
  name: 'General Hospital',
  clusters: [
    {
      id: 1,
      name: 'East Wing',
      ventilators: [
      ]
    },
    {
      id: 2,
      name: 'West Wing',
      ventilators: [
      ]
    }
  ]
}

// Populate the clusters with 6 ventilators each
for (let i = 0; i < 6; i ++) {
  demoOrg.clusters[0].ventilators.push({id: i, name: `East-${i}`, hostname: 'n/a'})
  demoOrg.clusters[1].ventilators.push({id: i, name: `West-${i}`, hostname: 'n/a'})
}

interface IProps {
  // If true, all ventilators will generate random data every 3 seconds
  demo: boolean
}

interface IState {
  loading: boolean
  organization: any
  errMsg: string
}

class VentilatorTree extends Component<IProps, IState> {
  _mounted: boolean = false

  constructor(props: IProps) {
    super(props);
    this.state = {
      loading: true,
      organization: {},
      errMsg: ''
    }
    this.componentCleanup = this.componentCleanup.bind(this);
  }

  componentCleanup() {
    let element = document.getElementById(DOM_ELEMENT_ID_WHERE_MOUNTED)
    if (element) {
      console.log(`Unmounting React root`)
      ReactDOM.unmountComponentAtNode(document.getElementById(DOM_ELEMENT_ID_WHERE_MOUNTED))
    }
  }

  async componentDidMount() {
    this._mounted = true

    // Normally, when the browser links to another page, all resources from the previous
    // page are cleaned up, including the React root and it's decendents and any timers
    // they created.
    // But we are using Turbolinks (https://github.com/turbolinks/turbolinks), which is
    // a single-page-app that requests the HTML for the next page and simply replaces
    // the existing DOM contents, leaving the previous React app and all of the timers running.
    // This event listener notifies us when the user clicks on another link (such as in the navbar)
    // so we can unmount our root react component, causing ComponentWillUnmount to be called on
    // all component so they can free resources.

    window.addEventListener('turbolinks:before-visit', this.componentCleanup);

    if (this.props.demo) {
      this.setState({
        loading: false,
        organization: demoOrg
      })
      return
    }

    let organization : IOrganization = null
    let success = false

    let response = await get<any>(VENTILATORS_API_URI)

    if (! this._mounted) {
      // console.log(`Get returned, but component was unmounted`)
      return false
    }

    // console.log(`response.parsedBody: ${JSON.stringify(response.parsedBody, null, 2)}`)

    if (response.ok) {
      try {
        const dataFormatter = new Jsona()
        organization = dataFormatter.deserialize(response.parsedBody) as IOrganization
        success = true
      } catch(err) {
      }
    }

    let errMsg = success ? null : 'There was an error while getting the Organization information from the server.'
    if (success) {
      // sort the cluster names
      sortObjects(organization.clusters, "name")
      // for each cluster, sort the ventilators
      organization.clusters.forEach((c) => sortObjects(c.ventilators, "name"))
    }

    this.setState({
      loading: false,
      organization,
      errMsg
    })
  }

  componentWillUnmount() {
    this._mounted = false
    window.removeEventListener('beforeunload', this.componentCleanup);
  }

  render() {
    const { loading, organization, errMsg } = this.state
    const { demo } = this.props

    if (! this._mounted) {
      // console.log(`$Render called, but component was unmounted`)
      return false
    }

    if (loading) {
      return (
        <FontAwesomeIcon icon={faSpinner} size="4x" spin />
      )
    }

    if (errMsg) {
      return (
        <div className="error">{errMsg}</div>
      )
    }

    return (
      <React.Fragment>
        <Organization organization={organization} demo={demo} />
      </React.Fragment>
    )
  }
}

export default VentilatorTree