import React, { Component } from "react"
import Jsona from 'jsona'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import Organization from "./organization"
import { get } from '../api'
import { sortObjects } from '../utils'
import { IOrganization } from "../types"

const VENTILATORS_API_URI = '/api/v1/ventilators'

// create a demo org with two clusters
let demoOrg : IOrganization = {
  id: 1,
  name: 'DEMO Hospital',
  clusters: [
    {
      id: 1,
      name: 'DEMO East Wing',
      ventilators: [
      ]
    },
    {
      id: 2,
      name: 'DEMO West Wing',
      ventilators: [
      ]
    }
  ]
}

// Populate the clusters with 6 ventilators each
for (let i = 0; i < 6; i ++) {
  demoOrg.clusters[0].ventilators.push({id: i, name: `East-${i}`, hostname: 'n/a', apiKey: 'n/a'})
  demoOrg.clusters[1].ventilators.push({id: i, name: `West-${i}`, hostname: 'n/a', apiKey: 'n/a'})
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
  }

  async componentDidMount() {
    this._mounted = true

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