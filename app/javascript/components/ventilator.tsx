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
import FlashChange from '@avinlab/react-flash-change';

// When the device is connected, poll this often
const GOOD_POLL_PERIOD_MS = 3000

// When the device is disconnected, poll this often
const BAD_POLL_PERIOD_MS = 60000

interface IColumn {
  min: number,
  max: number,
  make: (x :number) => any // convert the measurement to what will be displayed
}

const columns : {[key: string]: IColumn} = {
   tidalVolume: {min: 300, max: 800, make: x => x},
   respiratoryRate: {min: 8, max: 35, make: x => x},
   peakInspiratoryPressure: {min: 60, max: 80, make: x => x},
   ieRatio: {min: 1, max: 4, make: x => "1:" + x},
   peep: {min: 5, max: 10, make: x => x},
}

const columnNames = Object.keys(columns)

const IE_RATIO_INDEX = 3

const Flash = (value) => {
  return (
    <FlashChange
        value={value}
        className="flashing"
        flashClassName="active"
        compare={(prevProps, nextProps) => {
            return nextProps.value !== prevProps.value;
        }}
    >
        {value}
    </FlashChange>
  )
}

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

    // If there is no result in state, then this is the first call, so return random values for all fields
    if (! this.state.pollResult.result) {
      let result = {
        // for simulation purposes, a ventilator named 'EW Room2' will show as disconnected
        connected: this.props.ventilator.name !== 'EW Room 2',
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

    // otherwise, pick one field to change, pick up or down, and adjust that field
    // to simplify, we will not change ieRatio. Just pick n-1 numbers and adjust
    let columnIndx = generateRandomValueBetween(0, columnNames.length - 2)
    columnIndx = columnIndx == IE_RATIO_INDEX ? IE_RATIO_INDEX + 1 : columnIndx

    let upDown = generateRandomValueBetween(0,1)

    console.assert(columnIndx >= 0 && columnIndx < 5  && columnIndx != IE_RATIO_INDEX && upDown >= 0 && upDown < 2,
      `columnIndx ${columnIndx} upDown ${upDown}`)

    let key = columnNames[columnIndx]
    let value = this.state.pollResult.result[key]
    value = upDown == 1 ? value + 1 : value - 1
    value = clamp(value, columns[key].min, columns[key].max)

    let pollResultValue = {...this.state.pollResult.result, [key]: value}
    let result = {
      connected: this.props.ventilator.name !== 'EW Room 2',
      result: pollResultValue
    }
    return result
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
        <td>{Flash(display(pollResult, "tidalVolume"))}</td>
        <td>{Flash(display(pollResult, "respiratoryRate"))}</td>
        <td>{Flash(display(pollResult, "peakInspiratoryPressure"))}</td>
        <td>{Flash(display(pollResult, "ieRatio"))}</td>
        <td>{Flash(display(pollResult, "peep"))}</td>
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

const generateRandomColumnValue = (key: string) : any => {
  let column = columns[key]
  let value = generateRandomValueBetween(column.min, column.max)
  let display = column.make(value)
  return display
}

const generateRandomValueBetween = (lower, upper) => {
  return Math.round(Math.random()*(upper-lower)+lower)
}

const clamp = (num: number, min: number, max: number) : number => {
  return Math.min(Math.max(num, min), max)
}

export default Ventilator