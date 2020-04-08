/**
Ventilator represents values for a single ventilator.
If the Demo prop is true:
  It will update every 3 seconds with random values.
  If the ventilator name is 'Ventilator #2', it will simulate being disconnected

If the Demo prop is false:
  It will poll the endpoint every 3 seconds
  If the polling fails, it will show as disconnected
*/

import React, { Component } from "react"
import { IVentilator } from '../types'
import { get } from '../api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'


interface IProps {
  // Parent will pass in a ventilator object with
  // just the id, name and endpoint
  ventilator: IVentilator

  // If true, random data generated every 3 seconds
  demo: boolean
}

// The id, name and endpoint of the ventilator given in the prop
// will be copied into state.ventilator, then the additional values polled
// from the monitor (or simulated) will be stored in state.ventilator
interface IState {
  ventilator: IVentilator
}

// this is the shape of the response from the polled device
interface IResponse {
  ventilator: [
    {
      tidalVolume: number
      respiratoryRate: number
      peakInspiratoryPressure: number
      ieRatio: string
      peep: number
    }
  ]
}

class Ventilator extends Component<IProps, IState> {
  interval: any

  constructor(props: IProps) {
    super(props);

    this.state = {
      // not using spread operator on purpose
      ventilator: {
        id: props.ventilator.id,
        name: props.ventilator.name,
        url: props.ventilator.url,
        connected: true
      }
    }
  }

  async componentDidMount() {
    // if all ventilator objects are created at the same time and mount at the same time,
    // they will all update at the same time (every 3 seconds), causing all lines in the
    // table to change at the same time (and will all poll at the same time).
    // This spaces them out. If we want them to update at the same time, just delete the
    // call to delay as well as the delay function below.
    await delay(generateRandomValueBetween(0, 1500))
    this.tick()
    this.interval = setInterval(this.tick.bind(this), 3000, this)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  async tick() {

    let update = this.props.demo
                    ? this.getDemoUpdate()
                    : await this.pollDevice()

    // todo: once a device is disconnected, change the polling rate from 3 seconds
    // to something like one minute. If the hostname is not available it could take 5 seconds
    // to fail, thus creating many overlapping poll request

    // todo: consider adding "polling" to state, so only one poll is executing at a time
    this.setState(state => ({
      ventilator: {...state.ventilator, ...update}
    }));
  }

  getDemoUpdate(): IVentilator {
    return {
      // for simulation purposes, a ventilator named 'Ventilator #2' will show as disconnected
      connected: this.state.ventilator.name !== 'Ventilator #2',
      tidalVolume: generateRandomValueBetween(300, 800),
      respiratoryRate: generateRandomValueBetween(8, 35),
      peakInspiratoryPressure: generateRandomValueBetween(60, 80),
      ieRatio: "1:" + generateRandomValueBetween(1,4),
      peep: generateRandomValueBetween(5, 10)
    }
  }

  async pollDevice(): Promise<IVentilator> {
    let url = this.state.ventilator.url + "/api/ventilator"

    // todo: check on why this returns an array
    let response = await get<IResponse>(url)

    if (response.ok) {
      // rather than just return whatever we get, limit the fields
      // todo: validate the data within some range ?
      let v = response.parsedBody.ventilator[0]
      const update : IVentilator = {
        connected: true,
        tidalVolume: v.tidalVolume,
        respiratoryRate: v.respiratoryRate,
        peakInspiratoryPressure: v.peakInspiratoryPressure,
        ieRatio: v.ieRatio,
        peep: v.peep
      }
      return update
    }

    return {
      connected: false
    }
  }

  render() {
    const { ventilator } = this.state

    let statusElement = ventilator.connected
      ? <FontAwesomeIcon icon={faCircle} color={'LimeGreen'}/>
      : <FontAwesomeIcon icon={faExclamationTriangle} size="lg" color={'red'} className="flash"/>

    let result = (
      <tr key={ventilator.id}>
        <td className="status-col">
          {statusElement}
        </td>
        <td>{ventilator.name}</td>
        <td>{ventilator.tidalVolume}</td>
        <td>{ventilator.respiratoryRate}</td>
        <td>{ventilator.peakInspiratoryPressure}</td>
        <td>{ventilator.ieRatio}</td>
        <td>{ventilator.peep}</td>
      </tr>
    )

    return result
  }
}

const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const generateRandomValueBetween = (lower, upper) => {
  return Math.round(Math.random()*(upper-lower)+lower)
}

export default Ventilator