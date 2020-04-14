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

    this.options = []

    // make an array for the select
    if (props.organization) {
      this.options = props.organization.clusters.map((cluster) => {
        return {
          value: cluster.id,
          label: cluster.name
        }
      })

      sortOptions(this.options)
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
        clusterDisplay = (<Cluster cluster={cluster} demo={demo}/>)
      }
    }

    let result = (
      <div>
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
      </div>
    )

    return result
  }
}

const sortOptions = (options) => {
  options.sort((a, b) => {
    var nameA = a.name.toUpperCase(); // ignore upper and lowercase
    var nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  })
}

export default Organization