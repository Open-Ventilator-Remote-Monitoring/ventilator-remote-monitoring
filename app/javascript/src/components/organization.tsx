import React, { Component } from 'react'
import { IOrganization } from '../types'
import Cluster from './cluster'
import { RowSpread, StyledSelect } from './shared'

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
  options: IOption[]
  selectedClusterNameKey: string

  constructor(props: IProps) {
    super(props)

    console.assert(!!props.organization, "missing organization")

    this.selectedClusterNameKey = `SelectedClusterName-${props.organization.id}`

    // make an array for the select
    this.options = props.organization.clusters.map((cluster) => {
      return {
        value: cluster.id,
        label: cluster.name
      }
    })

    this.state = {selectedOption: null}

    this.setClusterSelection()
  }

  /** Get the last cluster name selected from the drop-down for this organization
   *  from localStorage. If it's not in local storage or there are no clusters
   *  by that name, just select the first cluster. If there are no clusters, return null
   */
  setClusterSelection(): void {
    if (! this.options.length) {
      return null
    }

    let selectedClusterIndx = -1

    // note: we store the cluster ID (for each specfic org-id), not the index
    var storedClusterName = localStorage.getItem(this.selectedClusterNameKey)

    if (storedClusterName) {
      selectedClusterIndx = this.options.findIndex((o) => o.label == storedClusterName)
    }

    selectedClusterIndx = selectedClusterIndx === -1 ? 0 : selectedClusterIndx

    let selectedOption = this.options[selectedClusterIndx]

    // called from the c'tor so needs to init state rather than call setState
    this.state = {selectedOption}
  }

  changeSelection = (selectedOption: IOption) => {
    this.setState({ selectedOption })

    // update localStorage each time the user selects a new option from the
    // dropdown. When they refresh the page, the same option should be selected for them.
    localStorage.setItem(this.selectedClusterNameKey, selectedOption.label)
  }

  render() {
    const { organization, demo } = this.props
    const { selectedOption } = this.state

    if (! organization) {
      return null
    }

    if (! organization.clusters.length) {
      return (
        <section>
          <h3>{organization.name}</h3>
          <h4>{`This organization does not have any ${organization.clusterTermPlural}.`}</h4>
        </section>
      )
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
        <RowSpread>
          <h3>{organization.name}</h3>

          <StyledSelect
            value={selectedOption}
            className="select"
            options={this.options}
            onChange={value => this.changeSelection(value)}
          />
        </RowSpread>
        {clusterDisplay}
      </section>
    )

    return result
  }
}

export default Organization