import React, { Component } from "react"
import { RouteComponentProps } from "react-router-dom"
import { get } from '../api'
import { IVentilator } from '../types'
import Ventilator from './ventilator'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import "./ventilators.scss"

interface IProps extends RouteComponentProps<any> {
}

interface IState {
  loading: boolean
  ventilators: IVentilator[]
  errMsg: string
}

class Ventilators extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      loading: true,
      ventilators: [],
      errMsg: ''
    }
  }

  async componentDidMount() {
    let response = await get<IVentilator[]>('/api/v1/ventilators')

    this.setState({
      loading: false,
      ventilators: response.parsedBody || [],
      errMsg: response.errMsg
    })
  }

  render() {
    const { loading, ventilators, errMsg } = this.state;

    const heading = (
      <div>
        <h3>Welcome to the Open Source Remote Ventilator Monitoring Project</h3>

        <h5 style={{fontWeight: "normal", marginTop: "15px"}}>
          Our goal is to quickly develop a remote
          monitoring interface for low-cost rapidly-manufactured ventilators currently
          being developed to provide emergency relief in the Covid-19 Pandemic.
          We strive for a lightweight, interoperable, and reliable interface.
        </h5>

        <p style={{marginBottom: "2.5rem"}}>
          This software is currently only a concept - it is neither approved
          nor intended to be used in any medical setting.
        </p>

        <hr />
        <h3>Demo</h3>
        <hr />
      </div>
    )

    const spinner = (
      <FontAwesomeIcon icon={faSpinner} size="4x" spin />
    )

    const allVentilators = (
      <div>
        {heading}
        <div id="index-demo-container">
          <h4 style={{color: "DarkBlue"}}>East Wing Ventilator Cluster</h4>
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
                ventilators.map((v, i) => (
                  <Ventilator key={i} ventilator={v} demo={true}/>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    )

    const noVentilators = (
      <div>
        <h4>
          No ventilators yet.
        </h4>
      </div>
    )

    return (
      <div>
        {
          loading
            ? spinner
            : errMsg
              ? (<div className="error">{errMsg}</div>)
              : ventilators.length > 0
                  ? allVentilators
                  : noVentilators
        }
      </div>
    );
  }
}

export default Ventilators