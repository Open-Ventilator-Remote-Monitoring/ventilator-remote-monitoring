import React, { Component } from "react"
import { IOrganization } from '../types'
import Cluster from './cluster'

interface IProps {
  organization: IOrganization
  demo: boolean
}

class Organization extends Component<IProps, null> {
  render() {
    const { organization, demo } = this.props

    let result = (
      <div>
        <h3>
          {organization.name}
        </h3>
        {
          organization.clusters.map((c, i) => (
            <Cluster key={i} cluster={c} demo={demo}/>
          ))
        }
      </div>
    )

    return result
  }
}

export default Organization