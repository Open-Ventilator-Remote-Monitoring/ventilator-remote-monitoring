import React, { Component } from 'react'
import Select from 'react-select'
import { IOrganization } from '../types'
import Cluster from './cluster'

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

    this.options = []

    // make an array for the select
    if (props.organization) {
      this.options = props.organization.clusters.map((cluster) => {
        return {
          value: cluster.id,
          label: cluster.name
        }
      })

    }

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

    if (! organization) {
      return null
    }

    let clusterDisplay = null
    if (selectedOption) {
      let cluster = organization.clusters.find(c => c.id == selectedOption.value)
      if (cluster) {
        clusterDisplay = (<Cluster key={cluster.id} cluster={cluster} demo={demo}/>)
      }
    }

    let result = (
      <section>
        <div className="select-row">
          <h3>
            {organization.name}
          </h3>

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
      </section>
    )

    return result
  }
}

export default Organization