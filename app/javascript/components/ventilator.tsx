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
  IDevicePollResult,
  IDeviceApiResponse,
  IVentilatorApiV0CallResponse
} from '../types'

// When the device is connected, poll this often
const GOOD_POLL_PERIOD_MS = 3000

// When the device is disconnected, poll this often
const BAD_POLL_PERIOD_MS = 15000

const API_KEY_HEADER = "Authorization"
const API_KEY_PREFIX = 'OpenVentApiKeyV1' // followed by 1 space followed by apiKey

const VENTILATOR_NAME_WITH_SIMULATED_FAILURE = "East-2"

interface IColumn {
  min: number,
  max: number
}

const columns : {[key: string]: IColumn} = {
   tidalVolume:             {min: 300, max: 800},
   respiratoryRate:         {min: 8,   max: 35},
   peakInspiratoryPressure: {min: 60,  max: 80},
   peep:                    {min: 5,   max: 10},
   ieRatio:                 {min: 1,   max: 4},
}

const columnNames = Object.keys(columns)

interface IProps {
  ventilator: IVentilator
  demo: boolean
}

interface IState {
  pollResult: IDevicePollResult,
  previousPollResult: IDevicePollResult,
}

class Ventilator extends Component<IProps, IState> {
  _timeout: any = null
  _mounted: boolean = false
  // null is don't know yet, 0 is old api, 1 us new api - this is temporary (really!)
  _apiVersion?: number = null

  constructor(props: IProps) {
    super(props)

    this.state = {
      pollResult: null,
      previousPollResult: null
    }

    this.poll = this.poll.bind(this)
  }

  componentDidMount() {
    // console.log(`${this.props.ventilator.name}: mounted.`)

    // if all ventilator objects are created at the same time and mount at the same time,
    // they will all update at the same time (every 3 seconds), causing all lines in the
    // table to change at the same time (and will all poll at the same time).
    // This spaces them out.

    // console.log(`${this.props.ventilator.name}: Mounted. Setting _mounted to true`)
    this._mounted = true

    // this is only the initial polling period. It will be changed after the first poll.
    let delay = generateRandomValueBetween(0, 1500)

    this._timeout = setTimeout(this.poll, delay)

    // we have no results to display yet, but we want the ventilator to
    // at least display its table row and name
    this.forceUpdate()
  }

  componentWillUnmount() {
    // console.log(`${this.props.ventilator.name}: un-mounted.`)

    this._mounted = false

    clearInterval(this._timeout)
  }

  async poll() {
    // console.log(`${this.props.ventilator.name}: Entering Poll. _mounted is: ${this._mounted}.`)

    if (! this._mounted) {
      // console.log(`${this.props.ventilator.name}: Interval fired, but component was unmounted`)
      return
    }

    let pollResult = this.props.demo
          ? await this.pollSimulatedDevice()
          : await this.pollDevice()

    if (! this._mounted) {
      console.log(`${this.props.ventilator.name}: Poll returned, but component was unmounted`)
      return
    }

    this.setState({
      pollResult,
      previousPollResult: this.state.pollResult
    })


    var newPollingPeriod = pollResult.connected ? GOOD_POLL_PERIOD_MS : BAD_POLL_PERIOD_MS

    this._timeout = setTimeout(this.poll, newPollingPeriod)

    return
  }

  async pollSimulatedDevice(): Promise<IDevicePollResult> {
    await delay(generateRandomValueBetween(0, 50))

    // If there is no result in state, then this is the first call, so return random values for all fields
    if (! this.state.pollResult) {
      return this.getRandomPollResult()
    }

    let result = this.getFreshPollResultWithSameValues()

    // 50% of the time, don't change anything
    let change = generateRandomValueBetween(0, 1)
    if (change === 0) {
      return result
    }

    // otherwise, get a new status object with the value of one measuement item changed
    this.updateOneMeasurementField(result)

    return result
  }

  getRandomPollResult(): IDevicePollResult {
    let result = this.getPollResultTemplate()

    result.connected = this.props.ventilator.name !== VENTILATOR_NAME_WITH_SIMULATED_FAILURE

    let status = result.apiResponse.ventilatorDataMonitor.status
    status.tidalVolume.value = generateRandomColumnValue('tidalVolume')
    status.respiratoryRate.value = generateRandomColumnValue('respiratoryRate'),
    status.peakInspiratoryPressure.value = generateRandomColumnValue('peakInspiratoryPressure'),
    status.ieRatio.value = generateRandomColumnValue('ieRatio'),
    status.peep.value = generateRandomColumnValue('peep')

    return result
  }

  // get a PollResult with new timestamps, but copy over values
  // for connected and ventilatorDataMonitor.status
  getFreshPollResultWithSameValues(): IDevicePollResult {
    let result = this.getPollResultTemplate()
    result.connected = this.state.pollResult.connected

    let fromStatus = this.state.pollResult.apiResponse.ventilatorDataMonitor.status
    let toStatus = result.apiResponse.ventilatorDataMonitor.status

    toStatus.tidalVolume.value = fromStatus.tidalVolume.value
    toStatus.respiratoryRate.value = fromStatus.respiratoryRate.value
    toStatus.peakInspiratoryPressure.value = fromStatus.peakInspiratoryPressure.value
    toStatus.ieRatio.value = fromStatus.ieRatio.value
    toStatus.peep.value = fromStatus.peep.value

    return result
  }

  // Get a new response (with fresh timestamps), copy over the measurement from the current state, and then
  // modify one of the measurement items. Pick one at random and pick the direction (+1 / -1) at random.
  // ieRatio is a special case becasue the value is 1:n, so just mack it 1:2 or 1:4
  updateOneMeasurementField(result: IDevicePollResult) : void {
    let status = result.apiResponse.ventilatorDataMonitor.status
    let columnIndx = generateRandomValueBetween(0, columnNames.length - 1)
    let upDown = generateRandomValueBetween(0,1)
    let key = columnNames[columnIndx]
    let value = (key == "ieRatio") ? 3 : Number(status[key].value)
    value = upDown === 0 ? value + 1 : value - 1
    value = clamp(value, columns[key].min, columns[key].max)
    let newValue = (key == "ieRatio") ? `1:${value}` : value.toString()
    status[key].value = newValue
    // console.log(`changed ${key} to ${newValue}`)
  }

  getPollResultTemplate(): IDevicePollResult {
    let result: IDevicePollResult = {
      connected: false,
      apiResponse: {
        device: {
          id: this.props.ventilator.name,
          currentTime: new Date(),
          roles: {
            ventilatorAlarmSoundMonitor: false,
            ventilatorDataMonitor: true
          }
        },
        ventilatorDataMonitor: {
          timestamp: new Date(),
          status: {
            ieRatio: {
              value: '',
              uom: "ratio"
            },
            peakInspiratoryPressure: {
              value: '',
              uom: "CMH2O"
            },
            peep: {
              value: '',
              uom: "CMH2O"
            },
            respiratoryRate: {
              value: '',
              uom: "breathsPerMinute"
            },
            tidalVolume: {
              value: '',
              uom: "ml/kg"
            }
          },
          alerts: {}
        }
      }
    }
    return result
  }

  async pollDevice(): Promise<IDevicePollResult> {
    if (this._apiVersion === 1) {
      return this.pollNewAPI()
    }

    if (this._apiVersion === 0) {
      return this.pollOldAPI()
    }

    // we don't know which to use - try new then old
    let result = await this.pollNewAPI()
    if (result.connected) {
      this._apiVersion = 1
      return result
    }

    result = await this.pollOldAPI()
    if (result.connected) {
      this._apiVersion = 0
      return result
    }

    // still don't know which to use, so we'll keep trying both until we do
    return {
      connected: false
    }
  }

  // poll the old API and make the response look like an IDevicePollResult
  async pollOldAPI(): Promise<IDevicePollResult> {
    let uri = `http://${this.props.ventilator.hostname}/api/ventilator`

    console.log(`${this.props.ventilator.name}: Getting from Old API at: ${uri}`)

    let headers = {}
    if (this.props.ventilator.apiKey) {
      headers[API_KEY_HEADER] = `${API_KEY_PREFIX} ${this.props.ventilator.apiKey.trim()}`
    }

    let response = await get<IVentilatorApiV0CallResponse>(uri, headers)
    console.log(`${this.props.ventilator.name}: Old API Response: ${JSON.stringify(response)}`)

    if (response.ok) {
      let result = this.getPollResultTemplate()
      result.connected = true
      let status = result.apiResponse.ventilatorDataMonitor.status
      let v = response.parsedBody.ventilator[0]
      status.tidalVolume.value = v.tidalVolume.toString()
      status.respiratoryRate.value = v.respiratoryRate.toString(),
      status.peakInspiratoryPressure.value = v.peakInspiratoryPressure.toString(),
      status.ieRatio.value = `1:${v.ieRatio}`,
      status.peep.value = v.peep.toString()
      return result
    }

    return {connected: false}
  }

  async pollNewAPI(): Promise<IDevicePollResult> {
    let uri = `http://${this.props.ventilator.hostname}/api/v1/status`

    console.log(`${this.props.ventilator.name}: Getting from New API at: ${uri}`)

    let headers = {}
    if (this.props.ventilator.apiKey) {
      headers[API_KEY_HEADER] = `${API_KEY_PREFIX} ${this.props.ventilator.apiKey.trim()}`
    }

    let response = await get<IDeviceApiResponse>(uri, headers)
    console.log(`${this.props.ventilator.name}: Response: ${JSON.stringify(response)}`)

    if (response.ok) {
      // todo: validate response: schema, roles/keys, timestamps, UOMs, etc.
      const result : IDevicePollResult = {
        connected: true,
        apiResponse: response.parsedBody
      }
      return result
    }

    return {connected: false}
  }

  render() {
    // console.log(`${this.props.ventilator.name}: Entering render. _mounted is ${this._mounted}`)

    if (! this._mounted) {
      // no need to do anything. The ventilator is already unmounted.
      // console.log(`${this.props.ventilator.name}: Render called, but component was unmounted`)
      return null
    }

    const { ventilator } = this.props
    const { pollResult, previousPollResult } = this.state

    let statusElement = pollResult?.connected
      ? <FontAwesomeIcon icon={faCircle} size="lg" color={'LimeGreen'}/>
      : <FontAwesomeIcon icon={faExclamationTriangle} size="lg" color={'red'} className="flash"/>

    const display = (columnName: string) : JSX.Element => {
      if (! pollResult?.connected) {
        return (<td>---</td>)
      }
      let value = pollResult?.apiResponse?.ventilatorDataMonitor?.status[columnName]?.value
      let preValue = previousPollResult?.apiResponse?.ventilatorDataMonitor?.status[columnName]?.value
      let changed = previousPollResult?.connected && (value !== preValue)

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

const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const generateRandomColumnValue = (columnName: string) : string => {
  let column = columns[columnName]
  let value = generateRandomValueBetween(column.min, column.max).toString()
  if (columnName === 'ieRatio') {
    value = `1:${value}`
  }
  return value
}

const generateRandomValueBetween = (lower: number, upper: number) : number => {
  return Math.round(Math.random()*(upper-lower)+lower)
}

const clamp = (num: number, min: number, max: number) : number => {
  return Math.min(Math.max(num, min), max)
}

export default Ventilator