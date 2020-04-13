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
import { IVentilator, IVentilatorPollResult, IVentilatorPollValues } from '../types'
import { get } from '../api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

// When the device is connected, poll this often
const GOOD_POLL_PERIOD_MS = 3000

// When the device is disconnected, poll this often
const BAD_POLL_PERIOD_MS = 60000

interface IProps {
  ventilator: IVentilator
  demo: boolean
}

interface IState {
  pollResult: IVentilatorPollResult
}

class Ventilator extends Component<IProps, IState> {
  interval: any = null
  pollingPeriod: number = GOOD_POLL_PERIOD_MS

  constructor(props: IProps) {
    super(props);

    this.state = {
      pollResult: {
        connected: false,
        result: null
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

    let connected = await this.poll()
    this.pollingPeriod = connected
        ? GOOD_POLL_PERIOD_MS
        : BAD_POLL_PERIOD_MS
    this.interval = setInterval(this.poll.bind(this), this.pollingPeriod)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  async poll() : Promise<boolean> {

    let pollResult = this.props.demo
                      ? await this.simulatePollDevice()
                      : await this.pollDevice()

    this.setState({pollResult})

    var newPollingPeriod = pollResult.connected
                              ? GOOD_POLL_PERIOD_MS
                              : BAD_POLL_PERIOD_MS

    if (newPollingPeriod != this.pollingPeriod) {
      clearInterval(this.interval)
      this.interval = setInterval(this.poll.bind(this), newPollingPeriod)
      this.pollingPeriod = newPollingPeriod
    }

    return pollResult.connected
  }

  async simulatePollDevice(): Promise<IVentilatorPollResult> {
    await delay(generateRandomValueBetween(0, 500))
    return {
      // for simulation purposes, a ventilator named 'EW Room2' will show as disconnected
      connected: this.props.ventilator.name !== 'EW Room 2',
      result: {
        tidalVolume: generateRandomValueBetween(300, 800),
        respiratoryRate: generateRandomValueBetween(8, 35),
        peakInspiratoryPressure: generateRandomValueBetween(60, 80),
        ieRatio: "1:" + generateRandomValueBetween(1,4),
        peep: generateRandomValueBetween(5, 10)
      }
    }
  }

  async pollDevice(): Promise<IVentilatorPollResult> {
    let url = `http://${this.props.ventilator.hostname}/api/ventilator`

    // todo: check on why this returns an array
    let response = await get<IVentilatorPollValues[]>(url)

    if (response.ok) {
      // todo: validate the data within some range ?
      let v = response.parsedBody[0]
      const update : IVentilatorPollResult = {
        connected: true,
        result: {
          tidalVolume: v.tidalVolume,
          respiratoryRate: v.respiratoryRate,
          peakInspiratoryPressure: v.peakInspiratoryPressure,
          ieRatio: v.ieRatio,
          peep: v.peep
        }
      }
      return update
    }

    return {
      connected: false,
      result: null
    }
  }

  render() {
    const { ventilator } = this.props
    const { pollResult } = this.state

    let statusElement = pollResult.connected
      ? <FontAwesomeIcon icon={faCircle} size="lg" color={'LimeGreen'}/>
      : <FontAwesomeIcon icon={faExclamationTriangle} size="lg" color={'red'} className="flash"/>

    let result = (
      <tr key={ventilator.id}>
        <td className="status-col">
          {
            statusElement
          }
        </td>
        <td>{ventilator.name}</td>
        <td>{display(pollResult, "tidalVolume")}</td>
        <td>{display(pollResult, "respiratoryRate")}</td>
        <td>{display(pollResult, "peakInspiratoryPressure")}</td>
        <td>{display(pollResult, "ieRatio")}</td>
        <td>{display(pollResult, "peep")}</td>
      </tr>
    )

    return result
  }
}

const display = (pollResult: IVentilatorPollResult, name: string) : string => {
  if (! pollResult.connected) {
    return "-"
  }
  return pollResult.result[name].toString()
}

const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const generateRandomValueBetween = (lower, upper) => {
  return Math.round(Math.random()*(upper-lower)+lower)
}

export default Ventilator