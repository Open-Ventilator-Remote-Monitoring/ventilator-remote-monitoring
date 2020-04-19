import React, { Component } from "react"
import { ICluster, IVentilator, IDevicePollResult } from '../types'
import { DevicePoller } from '../devicePoller'
import { SimulatedDevicePoller } from '../simulatedDevicePoller'
import Ventilator from './ventilator'
import { BaseDevicePoller } from "../baseDevicePoller"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { getFirstAlert, camelCaseToWords } from "../utils"

type Results = {[key: number] : IDevicePollResult}
type Buckets = "commError"  |   // includes missing host name
               "ventAlarmSoundMonitors" |
               "ventDataMonitors" |
               "other"          // didn't fall into at leasrt one of the previous buckets
type SplitResults = {[key in Buckets] : IVentilator[]}

interface IProps {
  cluster: ICluster
  demo: boolean
}

interface IState {
  results: Results
}

class Cluster extends Component<IProps, IState> {
  _mounted: boolean = false
  _pollers: BaseDevicePoller[] = []

  constructor(props: IProps) {
    super(props)
    this.state = {
      results: {}
    }
    this.callback = this.callback.bind(this)
  }

  componentDidMount() {
    console.log(`Component mounted !`)
    this._mounted = true

    this._pollers = []
    this.props.cluster.ventilators.forEach((v) => {
      let poller = this.props.demo  ? new SimulatedDevicePoller(v, this.callback)
                                    : new DevicePoller(v, this.callback)
      this._pollers.push(poller)
    })
  }

  componentWillUnmount() {
    console.log(`Component un-mounted !`)
    this._mounted = false

    // Call release on each poller so they can cancel their timers
    this._pollers.forEach((p) => {
      p.release()
    })
  }

  callback(device: IVentilator, pollResult: IDevicePollResult) : void {
    // console.log(`${device.name}: callback called. Mounted: ${this._mounted}`)

    if (! this._mounted) {
      console.log(`${device.name}: Callback called, but component was unmounted`)
      return
    }

    this.setState((state) => {
      let results = {...state.results}
      results[device.id] = pollResult
      return {results}
    })
  }

  render() {
    const { cluster } = this.props
    const { results } = this.state

    if (! cluster.ventilators.length) {
      return (
        <React.Fragment>
          <h4>{cluster.name}</h4>
          <h6>This cluster has no ventilators.</h6>
        </React.Fragment>
      )
    }

    let split = this.splitResults(cluster.ventilators, results)

    let result = (
      <React.Fragment>
        <h4>{cluster.name}</h4>
        {this.getVentAlarmSoundMonitorsJsx(split.ventAlarmSoundMonitors, results)}
        {this.getVentDataMonitorsJsx(split.ventDataMonitors, results)}
        {this.getCommErrorsJsx(split.commError, results)}
      </React.Fragment>
    )

    return result
  }

  splitResults = (vents: IVentilator[], results: Results) : SplitResults => {
    let split: SplitResults = {
      commError: [],
      ventAlarmSoundMonitors: [],
      ventDataMonitors: [],
      other: []
    }

    vents.forEach((v) => {
      if (! v.hostname) {
        split.commError.push(v)
        return
      }

      let result: IDevicePollResult = results[v.id]

      // If we have not received a response, it could not be sorted elsewhere
      if (!result) {
        split.other.push(v)
        return
      }

      if (! result.apiReceiveStatus.ok) {
        split.commError.push(v)
        return
      }

      let placed = false

      if (result.apiResponse.device.roles.ventilatorAlarmSoundMonitor) {
        split.ventAlarmSoundMonitors.push(v)
        placed = true
      }

      if (result.apiResponse.device.roles.ventilatorDataMonitor) {
        split.ventDataMonitors.push(v)
        placed = true
      }

      if (!placed) {
        split.other.push(v)
      }
    })

    return split
  }

  getVentAlarmSoundMonitorsJsx = (vents: IVentilator[], results: Results) => {

    let getRow = (v: IVentilator) => {
      let result: IDevicePollResult = results[v.id]
      let alert = getFirstAlert(result?.apiResponse?.ventilatorAlarmSoundMonitor?.alerts)
      let reason = this.getAlertText(alert)
      let statusJsx = this.getStatus(!alert)
      return (
        <tr key={this.getKey(v)}>
            <td>{v.name}</td>
            <td>{statusJsx}</td>
            <td>{reason}</td>
        </tr>
      )
    }

    return (
      <section>
        <h4>Ventilator Alarm Sound Monitors</h4>
        {
          vents.length
          ? (
              <table className='demo-ventilator-table narrow'>
                <thead>
                  <tr className="tr-heading">
                    <th>Unit</th>
                    <th>Status</th>
                    <th>Alert</th>
                  </tr>
                </thead>
                <tbody>
                  {vents.map((v) => getRow(v))}
                </tbody>
              </table>
            )
          : (
              <div>No Ventilator Alarm Sound Monitors</div>
            )
        }
      </section>
    )
  }

  getVentDataMonitorsJsx = (vents: IVentilator[], results: Results) => {

    return (
      <div className="group">
        <h4>Ventilator Data Monitors</h4>
        {
          vents.length
          ? (
              <table className='demo-ventilator-table'>
                <thead>
                  <tr className="tr-heading">
                    <th>Unit</th>
                    <th>Status</th>
                    <th>Tidal Volume </th>
                    <th>Respiratory Rate</th>
                    <th>Peak Inspiratory Press.</th>
                    <th>I/E Ratio</th>
                    <th>PEEP</th>
                  </tr>
                  <tr className="tr-subheading">
                    <th></th>
                    <th></th>
                    <th>mL/Breath</th>
                    <th>breaths/min</th>
                    <th>cm H2O</th>
                    <th></th>
                    <th>cm H2O</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    vents.map((v) => (
                      <Ventilator key={this.getKey(v)} ventilator={v} pollResult={results[v.id]}/>
                    ))
                  }
                </tbody>
              </table>
            )
          : (
              <div>No Ventilator Data Monitors</div>
            )
        }
      </div>
    )
  }

  getCommErrorsJsx = (vents: IVentilator[], results: Results) => {
    if (! vents.length) {
      return null
    }

    let getRow = (v: IVentilator) => {
      let result: IDevicePollResult = results[v.id]
      let alert = getFirstAlert(result?.apiReceiveStatus?.alerts)
      let reason = this.getAlertText(alert)
      let statusJsx = this.getStatus(!alert)
      return (
        <tr key={this.getKey(v)}>
            <td>{v.name}</td>
            <td>{statusJsx}</td>
            <td>{reason}</td>
        </tr>
      )
    }

    return (
      <div className="group">
        <h4>Communication Errors</h4>
        <table className='demo-ventilator-table narrow'>
          <thead>
            <tr className="tr-heading">
              <th>Unit</th>
              <th>Status</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {vents.map((v) => getRow(v))}
          </tbody>
        </table>
      </div>
    )
  }

  // Must ensure ventilator objects are not reused when switching clusters
  // by ensuring the key has both the cluster id and ventilator id
  getKey = (vent: IVentilator) => {
    return `${this.props.cluster.id}-${vent.id}`
  }

  getStatus = (ok: boolean) => {
    return ok
      ? <FontAwesomeIcon icon={faCircle} size="lg" color={'LimeGreen'}/>
      : <FontAwesomeIcon icon={faExclamationTriangle} size="lg" color={'red'} className="flash"/>
  }

  static alertMapping = {
    audioAlarm: "Audio Alarm",
    noHostname: "Missing Hostname",
    noApiKey: "Missing API Key",
    connection: "Network Connection",
    schemaValidation: "Invalid Response",
    uomMismatch: "Invalid Response",
    staleTimeStamp: "Measurement was too old"
  }

  getAlertText = (key: string) => {
    let result = Cluster.alertMapping[key] || camelCaseToWords(key)
    return result
  }
}

export default Cluster