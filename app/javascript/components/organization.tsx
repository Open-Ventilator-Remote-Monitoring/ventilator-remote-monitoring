import React, { Component } from 'react'
import Select from 'react-select'
import { IOrganization } from '../types'
import Cluster from './cluster'
import './organization.css'

interface IOption {
  value: number,
  label: string
}

interface IProps {
  organization: IOrganization
  demo: boolean
}

interface IState {
  selectedOption: IOption
}

class Organization extends Component<IProps, IState> {
  options

  constructor(props: IProps) {
    super(props);

    // make an array for the select
    this.options = props.organization.clusters.map((cluster) => {
      return {
        value: cluster.id,
        label: cluster.name
      }
    })

    let selectedOption = (this.options.length > 0)
        ? this.options[0]
        : null

    this.state = {
      selectedOption
    }
  }

  changeSelection = (selectedOption) => {
    this.setState({ selectedOption })
  }

  render() {
    const { organization, demo } = this.props
    const { selectedOption } = this.state

    let clusterDisplay = null
    if (selectedOption) {
      let cluster = organization.clusters.find(c => c.id == selectedOption.value)
      if (cluster) {
        clusterDisplay = (<Cluster cluster={cluster} demo={demo}/>)
      }
    }

    let result = (
      <div>
        <h3>
          {organization.name}
        </h3>
        <div className="select-row">
          <div className="label">Select Cluster:</div>
          <Select
            value={selectedOption}
            className="select"
            options={this.options}
            onChange={value => this.changeSelection(value)}
          />
        </div>
        <section>
        {
          clusterDisplay
        }
        </section>
      </div>
    )

    return result
  }
}

export default Organization