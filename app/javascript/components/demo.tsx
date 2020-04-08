import React, { Component } from "react"
import { RouteComponentProps } from "react-router-dom"
import { get } from '../api'
import { IVentilator } from '../types'
import Ventilator from './ventilator'

import "./ventilators.scss"

interface IProps extends RouteComponentProps<any> {
}

interface IState {
  ventilators: IVentilator[]
  error: string
}

class Ventilators extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      ventilators: [],
      error: ''
    }
  }

  async componentDidMount() {
    let response = await get<IVentilator[]>('/api/v1/ventilators')

    let ventilators = []
    if (response.parsedBody) {
      ventilators = response.parsedBody.slice(0, 1)
    }

    this.setState({
      ventilators,
      error: response.errMsg
    })
  }

  render() {
    const { ventilators, error } = this.state;

    const heading = (
      <div>
        <h3>Live Demo</h3>

        <h5 style={{fontWeight: "normal", marginTop: "15px"}}>
          To use this demo, you need to have properly configured
          raspberry pi connected to your local network.
        </h5>

        <p style={{marginBottom: "2.5rem"}}>
          Note: this demo is a concept only
          - it is neither approved nor intended to be used in a medical setting.
        </p>
      </div>
    )
    const allVentilators = (
      <div>
        {heading}
        <div id="index-demo-container">
          <h4 style={{color: "DarkBlue"}}>Demo Ventilator Cluster</h4>
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
                  <Ventilator key={i} ventilator={v} demo={false}/>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    )

    const noVentilator = (
      <div>
        <h4>
          No ventilators yet.
        </h4>
      </div>
    );

    return (
      <div>
        {
            error ? error
                  : ventilators.length > 0
                    ? allVentilators
                    : noVentilator
        }
      </div>
    );
  }
}

export default Ventilators