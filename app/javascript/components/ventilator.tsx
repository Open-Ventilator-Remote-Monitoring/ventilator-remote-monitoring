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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { DevicePoller } from '../devicePoller'
import { SimulatedDevicePoller } from '../simulatedDevicePoller'
import { IVentilator, IDevicePollResult } from '../types'

interface IProps {
  ventilator: IVentilator
  demo: boolean
}

interface IState {
  pollResult: IDevicePollResult,
  previousPollResult: IDevicePollResult,
}

class Ventilator extends Component<IProps, IState> {
  #mounted: boolean = false
  #poller: any

  constructor(props: IProps) {
    super(props)

    this.state = {
      pollResult: null,
      previousPollResult: null
    }

    this.callback = this.callback.bind(this)

    this.#poller = this.props.demo  ? new SimulatedDevicePoller(this.props.ventilator, this.callback)
                                    : new DevicePoller(this.props.ventilator, this.callback)
  }

  componentDidMount() {
    // console.log(`${this.props.ventilator.name}: mounted.`)

    this.#mounted = true

    this.forceUpdate()
  }

  componentWillUnmount() {
    // console.log(`${this.props.ventilator.name}: un-mounted.`)

    this.#mounted = false

    this.#poller.release()
  }

  callback(deviceId: number, pollResult: IDevicePollResult) : void {
    // console.log(`${this.props.ventilator.name}: callback called.`)

    if (! this.#mounted) {
      console.log(`${this.props.ventilator.name}: Callback called, but component was unmounted`)
      return
    }

    this.setState({
      pollResult,
      previousPollResult: this.state.pollResult
    })
  }

  render() {
    // console.log(`${this.props.ventilator.name}: Entering render. _mounted is ${this._mounted}`)

    if (! this.#mounted) {
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

export default Ventilator