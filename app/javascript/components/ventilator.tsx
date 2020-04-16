/**
Ventilator represents values for a single ventilator.
If the Demo prop is true:
  It will update GOOD_POLL_PERIOD_MS millseconds with random values.
  If the ventilator name is VENTILATOR_NAME_WITH_SIMULATED_FAILURE, it will simulate being disconnected

If the Demo prop is false:
  It will poll the endpoint every GOOD_POLL_PERIOD_MS millseconds
  If the polling fails, it will show as disconnected, and poll every BAD_POLL_PERIOD_MS milliseconds
*/

import React, { Component } from "react"
import { get } from '../api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import {
  IVentilator,
  IVentilatorPollValues,
  IVentilatorPollResult,
  IVentilatorApiCallResponse
} from '../types'

// When the device is connected, poll this often
const GOOD_POLL_PERIOD_MS = 3000

// When the device is disconnected, poll this often
const BAD_POLL_PERIOD_MS = 15000

const API_KEY_HEADER = "Authorization"
const API_KEY_PREFIX = 'OpenVentApiKeyV1' // followd by 1 space followed by apiKey

const VENTILATOR_NAME_WITH_SIMULATED_FAILURE = "East-2"

interface IColumn {
  min: number,
  max: number,
  toDisplay: (x :number) => (number | string) // convert the measurement to what will be displayed
}

const identity = (x: number) : string => x.toString()

const columns : {[key: string]: IColumn} = {
   tidalVolume:             {min: 300, max: 800, toDisplay: identity},
   respiratoryRate:         {min: 8,   max: 35,  toDisplay: identity},
   peakInspiratoryPressure: {min: 60,  max: 80,  toDisplay: identity},
   ieRatio:                 {min: 1,   max: 4,   toDisplay: x => `1:${x}`},
   peep:                    {min: 5,   max: 10,  toDisplay: identity},
}

const columnNames = Object.keys(columns)

interface IProps {
  ventilator: IVentilator
  demo: boolean
}

interface IState {
  pollResult: IVentilatorPollResult,
  previousValues: IVentilatorPollValues,
}

class Ventilator extends Component<IProps, IState> {
  _interval: any = null
  _pollingPeriod: number = GOOD_POLL_PERIOD_MS
  _mounted: boolean = false

  constructor(props: IProps) {
    super(props)

    this.state = {
      pollResult: {
        connected: false,
        result: null
      },
      previousValues: null
    }

    this.poll = this.poll.bind(this)
  }

  async componentDidMount() {
    // if all ventilator objects are created at the same time and mount at the same time,
    // they will all update at the same time (every 3 seconds), causing all lines in the
    // table to change at the same time (and will all poll at the same time).
    // This spaces them out. If we want them to update at the same time, just delete the
    // call to delay as well as the delay function below.

    // console.log(`${this.props.ventilator.name}: Mounted. Setting _mounted to true`)
    this._mounted = true

    // this is only the initial polling period. It will be changed after the first poll.
    this._pollingPeriod = generateRandomValueBetween(0, 1500)

    this._interval = setInterval(this.poll, this._pollingPeriod)
  }

  componentWillUnmount() {
    console.log(`${this.props.ventilator.name}: un-mounted.`)

    this._mounted = false

    clearInterval(this._interval)
  }

  async poll() : Promise<boolean> {
    // console.log(`${this.props.ventilator.name}: Entering Poll. _mounted is: ${this._mounted}`)

    if (! this._mounted) {
      // console.log(`${this.props.ventilator.name}: Interval fired, but component was unmounted`)
      return false
    }

    // copy the last values (if any) over to previousValues
    // so we can detect changes and flash the fields that changed.
    let previousValues = {...this.state.pollResult.result}

    let pollResult = this.props.demo
          ? await this.pollSimulatedDevice()
          : await this.pollDevice()

    // console.log(`${this.props.ventilator.name}: Finshed polling device. _mounted is: ${this._mounted}`)

    if (! this._mounted) {
      // console.log(`${this.props.ventilator.name}: Poll returned, but component was unmounted`)
      return false
    }

    this.setState({
      pollResult,
      previousValues
    })

    var newPollingPeriod = pollResult.connected
                              ? GOOD_POLL_PERIOD_MS
                              : BAD_POLL_PERIOD_MS

    if (newPollingPeriod != this._pollingPeriod) {
      clearInterval(this._interval)
      this._interval = setInterval(this.poll, newPollingPeriod)
      this._pollingPeriod = newPollingPeriod
    }

    return pollResult.connected
  }

  async pollSimulatedDevice(): Promise<IVentilatorPollResult> {

    // If there is no result in state, then this is the first call, so return random values for all fields
    if (! this.state.pollResult.result) {
      let result = {
        // for simulation purposes, a ventilator named 'EW Room2' will show as disconnected
        connected: this.props.ventilator.name !== VENTILATOR_NAME_WITH_SIMULATED_FAILURE,
        result: {
          tidalVolume: generateRandomColumnValue('tidalVolume'),
          respiratoryRate: generateRandomColumnValue('respiratoryRate'),
          peakInspiratoryPressure: generateRandomColumnValue('peakInspiratoryPressure'),
          ieRatio: generateRandomColumnValue('ieRatio'),
          peep: generateRandomColumnValue('peep')
        }
      }
      return result
    }

    // 50% of the time, don't change anything
    let change = generateRandomValueBetween(0, 1)

    if (change === 0) {
      return this.state.pollResult
    }

    // Otherwise, pick one field to change, pick up or down, and adjust that field, ensuring it stays in range.
    // To simplify, we will not change ieRatio. Just pick n-1 numbers and adjust
    let columnIndx = generateRandomValueBetween(0, columnNames.length - 1)
    let upDown = generateRandomValueBetween(0,1)

    console.assert(columnIndx >= 0 && columnIndx < columnNames.length && upDown >= 0 && upDown <= 1,
      `columnIndx ${columnIndx} upDown ${upDown}`)

    let key = columnNames[columnIndx]
    let value = this.state.pollResult.result[key]
    value = upDown === 0 ? value + 1 : value - 1
    value = clamp(value, columns[key].min, columns[key].max)

    let pollResultValue = {...this.state.pollResult.result, [key]: value}

    let result = {
      connected: this.state.pollResult.connected,
      result: pollResultValue
    }

    return result
  }

  async pollDevice(): Promise<IVentilatorPollResult> {
    let uri = `http://${this.props.ventilator.hostname}/api/ventilator`

    // todo: check on why this returns an array
    // console.log(`${this.props.ventilator.name}: Getting from: ${uri}`)

    let headers = {}
    if (this.props.ventilator.apiKey) {
      headers[API_KEY_HEADER] = `${API_KEY_PREFIX} ${this.props.ventilator.apiKey.trim()}`
    }

    let response = await get<IVentilatorApiCallResponse>(uri, headers)
    console.log(`${this.props.ventilator.name}: Response: ${JSON.stringify(response)}`)

    if (response.ok) {
      // todo: validate the data within some range ?
      let v = response.parsedBody.ventilator[0]
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

    return {connected: false, result: null}
  }

  render() {
    // console.log(`${this.props.ventilator.name}: Entering render. _mounted is ${this._mounted}`)
    if (! this._mounted) {
      // no need to do anything. The ventilator is already unmounted.
      // console.log(`${this.props.ventilator.name}: Render called, but component was unmounted`)
      return null
    }

    const { ventilator } = this.props
    const { pollResult, previousValues } = this.state

    let statusElement = pollResult.connected
      ? <FontAwesomeIcon icon={faCircle} size="lg" color={'LimeGreen'}/>
      : <FontAwesomeIcon icon={faExclamationTriangle} size="lg" color={'red'} className="flash"/>

    const display = (columnName: string) : JSX.Element => {
      if (! pollResult.connected) {
        return (<td>---</td>)
      }
      let toDisplay = columns[columnName].toDisplay
      let value = toDisplay(pollResult.result[columnName])
      let changed = previousValues &&
                    previousValues[columnName] &&
                    (previousValues[columnName] !== pollResult.result[columnName])
      return changed
        ? <td className="pop">{value}</td>
        : <td>{value}</td>
    }

    let result = (
      <tr>
        <td className="status-col">
          {
            statusElement
          }
        </td>
        <td>{ventilator.name}</td>
          { display('tidalVolume') }
          { display('respiratoryRate') }
          { display('peakInspiratoryPressure') }
          { display('ieRatio') }
          { display('peep') }
      </tr>
    )

    return result
  }
}

const generateRandomColumnValue = (columnName: string) : any => {
  let column = columns[columnName]
  let value = generateRandomValueBetween(column.min, column.max)
  return value
}

const generateRandomValueBetween = (lower, upper) => {
  return Math.round(Math.random()*(upper-lower)+lower)
}

const clamp = (num: number, min: number, max: number) : number => {
  return Math.min(Math.max(num, min), max)
}

export default Ventilator