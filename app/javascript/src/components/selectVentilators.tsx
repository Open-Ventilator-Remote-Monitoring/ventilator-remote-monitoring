import React, { Component } from "react"
import { ICluster, IVentilator } from '../types'
import { HiddenVentilatorsHelper } from '../hiddenVentilatorsHelper'
import { makeSetFromAry } from '../utils'

interface IProps {
  cluster: ICluster
  onClose: () => void
}

interface IState {
  hiddenVentilatorIds: Set<number>
}

export class SelectVentilators extends Component<IProps, IState> {
  _helper: HiddenVentilatorsHelper

  constructor(props: IProps) {
    super(props)

    console.assert(props.cluster, "missing cluster")
    console.assert(props.cluster.organization, "cluster.organization is null")

    this._helper = new HiddenVentilatorsHelper(props.cluster)

    this.state = {
      hiddenVentilatorIds: this._helper.readCleanHiddenSet()
    }
  }

  handleCheckChange = (ventId: number) => {
    this.setState(
      (prevState: Readonly<IState>) => {
        let set = makeSetFromAry([...prevState.hiddenVentilatorIds.values()])
        if (set.has(ventId)) {
          set.delete(ventId)
        } else {
          set.add(ventId)
        }
        return {hiddenVentilatorIds: set}
      },
      // N.B. callback after state is updated
      () => this._helper.persistHiddenSet(this.state.hiddenVentilatorIds)
    )
  }

  render() {
    const { cluster } = this.props
    const { hiddenVentilatorIds } = this.state

    let getRow = (v: IVentilator) => {
      let checked = ! hiddenVentilatorIds.has(v.id)
      return (
        <tr key={v.id}>
            <td>
              <label className="switch">
                <input type="checkbox" checked={checked} onChange={(e) => this.handleCheckChange(v.id, e)} />
                <span className="slider round" />
              </label>
            </td>
            {
              checked ? (<td><b>{v.name}</b></td>) : (<td className="dim">{v.name}</td>)
            }

        </tr>
      )
    }

    let result = (
      <React.Fragment>
        <section>
          <table className='demo-ventilator-table narrow'>
            <thead>
              <tr className="tr-heading">
                <th>Show</th>
                <th>{this.props.cluster.organization.ventilatorLocationTermSingular}</th>
              </tr>
            </thead>
            <tbody>
              {cluster.ventilators.map((v) => getRow(v))}
            </tbody>
          </table>
        </section>

        <section>
          <button className="btn btn-info" onClick={()=> this.props.onClose()}>
              {`Exit ${cluster.organization.ventilatorLocationTermPlural} selection`}
          </button>
        </section>

      </React.Fragment>
    )

    return result
  }
}

