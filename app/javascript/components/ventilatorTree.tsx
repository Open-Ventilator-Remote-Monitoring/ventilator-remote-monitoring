import React, { Component } from "react"
import Jsona from 'jsona'
import { get } from '../api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import Organization from "./organization"

import { IOrganization } from "../types"

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
  constructor(props: IProps) {
    super(props);
    this.state = {
      loading: true,
      organization: {},
      errMsg: ''
    }
  }

  async componentDidMount() {
    if (this.props.demo) {
      this.setState({
        loading: false,
        organization: demoOrg
      })
      return
    }

    let organization = null
    let success = false

    let response = await get<any>('/api/v1/ventilators')

    if (response.ok) {
      try {
        const dataFormatter = new Jsona()
        organization = dataFormatter.deserialize(response.parsedBody)
        success = true
      } catch(err) {
      }
    }

    let errMsg = success ? null : 'There was an error while getting the Organization information from the server.'

    this.setState({
      loading: false,
      organization,
      errMsg
    })
  }

  render() {
    const { loading, organization, errMsg } = this.state
    const { demo } = this.props

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
      <section>
        <Organization organization={organization} demo={demo} />
      </section>
    )
  }
}

export default VentilatorTree