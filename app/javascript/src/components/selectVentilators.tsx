import React, { Component } from "react"
import { ICluster, IVentilator } from '../types'
import { HiddenVentilatorsHelper } from '../hiddenVentilatorsHelper'
import { makeSetFromAry, getLayout } from '../utils'
import { RowPack } from './shared'

const MINIMUM_ITEM_WIDTH = 400

interface IProps {
  cluster: ICluster
  onClose: () => void
}

interface IState {
  hiddenVentilatorIds: Set<number>

  // whenever the number of ventilators changes, or the size of the window
  // we'll call getLayout which will calculate the # or rows and columns to use.
  layout: {rows: number, cols: number}
}

export class SelectVentilators extends Component<IProps, IState> {
  _helper: HiddenVentilatorsHelper

  constructor(props: IProps) {
    super(props)

    console.assert(props.cluster, "missing cluster")
    console.assert(props.cluster.organization, "cluster.organization is null")

    this._helper = new HiddenVentilatorsHelper(props.cluster)

    this.state = {
      hiddenVentilatorIds: this._helper.readCleanHiddenSet(),
      layout: {rows: 0, cols: 0}
    }

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions)
  }

  updateWindowDimensions() {
    // console.log(`getting layout with: width: ${window.innerWidth} Height: ${window.innerHeight}`)
    let layout = getLayout(this.props.cluster.ventilators.length, window.innerWidth, window.innerHeight, MINIMUM_ITEM_WIDTH )
    this.setState({ layout })
  }

  handleCheckChange = (ventId: number) => {
    this.setState(
      (prevState) => {
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

  showAll = () => {
    let set = new Set<number>()
    this._helper.persistHiddenSet(set)
    this.setState(
      (prevState) => {
        return {hiddenVentilatorIds: set}
      }
    )
  }

  hideAll = () => {
    let set = makeSetFromAry(this.props.cluster.ventilators.map((v) => v.id))
    this._helper.persistHiddenSet(set)
    this.setState(
      (prevState) => {
        return {hiddenVentilatorIds: set}
      }
    )
  }

  render() {
    const { cluster } = this.props
    const { hiddenVentilatorIds } = this.state

    let buttons = (
      <RowPack>
          <button className="btn btn-info" onClick={()=> this.hideAll()}>
              {`Hide all ${cluster.organization.ventilatorLocationTermPlural}`}
          </button>
          <button className="btn btn-info ml-3" onClick={()=> this.showAll()}>
              {`Show all ${cluster.organization.ventilatorLocationTermPlural}`}
          </button>
        </RowPack>
    )

    let getRowJsx = (v: IVentilator) => {
      let checked = ! hiddenVentilatorIds.has(v.id)
      return (
        <tr key={v.id}>
            {
              checked ? (<td><b>{v.name}</b></td>) : (<td className="dim">{v.name}</td>)
            }
            <td>
              <label className="switch">
                <input type="checkbox" checked={checked} onChange={(e) => this.handleCheckChange(v.id)} />
                <span className="slider round" />
              </label>
            </td>
        </tr>
      )
    }

    let count = cluster.ventilators.length
    let {rows, cols} = this.state.layout
    console.log(`rendering ${count} items into ${cols} columns of ${rows} rows`)

    let allColsJsx = []
    for (var colIndx = 0; colIndx < cols; colIndx++) {
      let rowsJsx = []
      for (var rowIndx = 0; rowIndx < rows; rowIndx++) {
        var indx = colIndx * rows + rowIndx

        if (indx > count - 1) {
          // cols * rows is > count. We're done, leaving some unused rows in the last column
          break;
        }

        var vent = cluster.ventilators[indx]
        let rowJsx = getRowJsx(vent)
        rowsJsx.push(rowJsx)
      }

      let colJsx = (
        <div>
          <table className='ventVisTable'>
            <colgroup>
              <col width="50%" />
              <col width="50%" />
            </colgroup>
            <thead>
              <tr className="tr-heading">
                <th>{cluster.organization.ventilatorLocationTermSingular}</th>
                <th>Hide {'<--->'} Show</th>
              </tr>
            </thead>
            <tbody>
              {rowsJsx}
            </tbody>
          </table>
        </div>
      )

      allColsJsx.push(colJsx)
    }

    let jsx = (
      <React.Fragment>
        {buttons}
        <div className="ventVisTables">
          { allColsJsx }
        </div>
        <section>
          <button className="btn btn-primary" onClick={()=> this.props.onClose()}>
              {`Exit ${cluster.organization.ventilatorLocationTermSingular} selection`}
          </button>
        </section>
      </React.Fragment>
    )

    return jsx
  }
}

