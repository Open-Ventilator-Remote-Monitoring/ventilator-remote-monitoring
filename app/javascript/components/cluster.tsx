import React, { Component } from "react"
import { ICluster } from '../types'
import Ventilator from './ventilator'

interface IProps {
  cluster: ICluster
  demo: boolean
}

class Cluster extends Component<IProps, null> {
  render() {
    const { cluster, demo } = this.props

    let result = (
      <React.Fragment>
        <h4>
          {cluster.name}
        </h4>
        <table className="table demo-ventilator-table">
          <thead>
            <tr className="tr-heading">
              <th></th>
              <th>Unit</th>
              <th>Tidal Volume </th>
              <th>Respiratory Rate</th>
              <th>Peak Inspiratory Press.</th>
              <th>I/E Ratio</th>
              <th>PEEP</th>
            </tr>
            <tr className="tr-subheading">
              <td></td>
              <td></td>
              <td>mL/Breath</td>
              <td>breaths/min</td>
              <td>cm H2O</td>
              <td></td>
              <td>cm H2O</td>
            </tr>
          </thead>
          <tbody>
            {
              cluster.ventilators.map((v, i) => (
                <Ventilator key={i} ventilator={v} demo={true}/>
              ))
            }
          </tbody>
        </table>
      </React.Fragment>
    )

    return result
  }
}

export default Cluster