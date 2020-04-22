import React, { Component } from "react"
import {ExclamationTriangle, Circle} from './icons'
import { IVentilator, IDevicePollResult } from '../types'
import { getFirstAlert } from '../utils'

interface IProps {
  ventilator: IVentilator
  pollResult: IDevicePollResult
}

interface IState {
  previousPollResult: IDevicePollResult,
}

class Ventilator extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      previousPollResult: null
    }
  }

  componentDidUpdate(prevProps: IProps) {
    let o = prevProps?.pollResult?.apiResponse?.ventilatorDataMonitor?.status
    let n = this.props.pollResult?.apiResponse?.ventilatorDataMonitor?.status

    if (!o || !n) {
      return
    }

    if (o.ieRatio !== n.ieRatio ||
        o.peakInspiratoryPressure !== n.peakInspiratoryPressure ||
        o.peep !== n.peep ||
        o.respiratoryRate !== n.respiratoryRate ||
        o.tidalVolume !== n.tidalVolume) {
          this.setState({previousPollResult: prevProps.pollResult})
    }
  }

  render() {
    // console.log(`${this.props.ventilator.name}: Entering render. `)

    const { ventilator, pollResult } = this.props
    const { previousPollResult } = this.state

    let alerts = pollResult?.apiResponse?.ventilatorDataMonitor?.alerts
    let alert = getFirstAlert(alerts)

    let statusJsx = ! alert
      ? <Circle size="lg" color={'LimeGreen'}/>
      : <ExclamationTriangle size="lg" color={'red'} className="flash"/>

    const display = (columnName: string) : JSX.Element => {
      if (alert) {
        return (<td>---</td>)
      }
      let value = pollResult?.apiResponse?.ventilatorDataMonitor?.status[columnName]?.value
      let prevValue = previousPollResult?.apiResponse?.ventilatorDataMonitor?.status[columnName]?.value
      let changed = previousPollResult?.apiReceiveStatus?.ok && (value !== prevValue)

      return changed
        ? <td className="pop">{value}</td>
        : <td>{value}</td>
    }

    let result = (
      <tr>
        <td>{ventilator.name}</td>
        <td>{statusJsx}</td>
        { display('tidalVolume') }
        { display('respiratoryRate') }
        { display('peakInspiratoryPressure') }
        { display('ieRatio') }
        { display('peep') }
      </tr>
    )

    return result
  }

  getStatus = (ok: boolean) => {
    return ok
      ? <Circle size="lg" color={'LimeGreen'}/>
      : <ExclamationTriangle size="lg" color={'red'} className="flash"/>
  }
}

export default Ventilator