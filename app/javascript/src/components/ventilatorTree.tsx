import React, { Component } from "react"
import Jsona from 'jsona'
import { IOrganization } from "../types"
import Organization from "./organization"
import { get } from '../api'
import { sortObjects } from '../utils'
import { DemoOrg } from '../demoOrg'
import { LargeSpinner } from './spinner'
import { Error } from './shared'

const VENTILATORS_API_URI = '/api/v1/ventilators'

interface IProps {
  // If true, all ventilators will generate random data every 3 seconds
  demo: boolean
}

interface IState {
  loading: boolean
  organization: any
  errMsg: string
}

/**
 * VentilatorTree either uses DemoOrg, or reads the org/cluster/ventilator
 * topology from an API on the server, and then displays the Organization.
 */
export default class VentilatorTree extends Component<IProps, IState> {
  _mounted: boolean = false

  constructor(props: IProps) {
    super(props)

    this.state = {
      loading: true,
      organization: {},
      errMsg: null
    }
  }

  async componentDidMount() {
    console.log(`ventilatorTree: componentDidMount`)

    this._mounted = true

    if (this.props.demo) {
      this.setState({
        loading: false,
        organization: DemoOrg
      })
      return
    }

    // render is called before componentDidMount, but render
    // returns if this._mounted has not beed set, so we need
    // to force a render again, before calling the API.

    this.forceUpdate()

    let organization: IOrganization = null
    let success = false

    // console.log('calling api')
    let response = await get<any>(VENTILATORS_API_URI)

    // Things can happen in other parts of the code while we were awaiting.
    // For example, the user may have clicked on another link, causing an unmount
    // Updating state after being unmounted causes React errors.

    if (! this._mounted) {
      // console.log(`Get returned, but component was unmounted`)
      return false
    }

    // console.log(`response: ${JSON.stringify(response, null, 2)}`)

    if (response.ok) {
      try {
        const dataFormatter = new Jsona()
        organization = dataFormatter.deserialize(response.parsedBody) as IOrganization
        success = true
      } catch(err) {
      }
    }

    // console.log(`Organization: ${JSON.stringify(organization, null, 2)}`)

    let errMsg = success ? null : 'There was an error while getting the Organization information from the server.'

    if (success) {
      // sort the cluster names
      sortObjects(organization.clusters, "name")
      // for each cluster, sort the ventilators, and fix-up a back-pointer to organization
      organization.clusters.forEach((c) => {
        c.organization = organization
        sortObjects(c.ventilators, "name")
      })
    }

    this.setState({
      loading: false,
      organization,
      errMsg
    })
  }

  componentWillUnmount() {
    // console.log(`ventilatorTree: componentWillUnmount`)
    this._mounted = false
  }

  render() {
    const { loading, organization, errMsg } = this.state
    const { demo } = this.props

    // console.log(`render: mounted: ${this._mounted}, loading: ${loading}, errMsg: ${errMsg}`)

    if (! this._mounted) {
      // console.log(`$Render called, but component was unmounted`)
      return false
    }

    if (loading) {
      return (
        <LargeSpinner />
      )
    }

    if (errMsg) {
      return (
        <Error>{errMsg}</Error>
      )
    }

    return (
      <Organization organization={organization} demo={demo} />
    )
  }
}
