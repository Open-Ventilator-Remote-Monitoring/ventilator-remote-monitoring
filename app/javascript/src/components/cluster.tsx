import React, { Component } from "react"
import { ICluster, IVentilator, IDevicePollResult } from '../types'
import { DevicePoller } from '../poller/devicePoller'
import { SimulatedDevicePoller } from '../poller/simulatedDevicePoller'
import { BaseDevicePoller } from "../poller/baseDevicePoller"
import { ExclamationTriangle, Circle } from './icons'
import { getFirstAlert, camelCaseToWords } from "../utils"
import { SelectVentilators } from './selectVentilators'
import { HiddenVentilatorsHelper } from '../hiddenVentilatorsHelper'

type Results = {[key: number] : IDevicePollResult}
type Buckets = "commError"  |   // includes missing host name
               "ventAlarmSoundMonitors" |
               "ventDataMonitors" |
               "other"          // didn't fall into at least one of the previous buckets
type SplitResults = {[key in Buckets] : IVentilator[]}

interface IProps {
  cluster: ICluster
  demo: boolean
}

interface IState {
  results: Results
  selectVentilatorsMode: boolean
  visibleVentilators: IVentilator[]
}

class Cluster extends Component<IProps, IState> {
  _mounted: boolean = false
  _pollers: BaseDevicePoller[] = []
  _helper: HiddenVentilatorsHelper = null

  constructor(props: IProps) {
    super(props)

    this._helper = new HiddenVentilatorsHelper(props.cluster)

    let hiddenVentilatorIds = this._helper.readCleanHiddenSet()
    let visibleVentilators = props.cluster.ventilators.filter((v) => ! hiddenVentilatorIds.has(v.id))

    this.state = {
      results: {},
      selectVentilatorsMode: false,
      visibleVentilators
    }

    this.callback = this.callback.bind(this)
    this.createPoller = this.createPoller.bind(this)
  }

  componentDidMount() {
    // console.log(`Component mounted !`)
    this._mounted = true

    // start a poller for all visible monitors
    this.state.visibleVentilators.forEach((v) => {this.createPoller(v)})
  }

  createPoller(device: IVentilator) {
    // Rather than start a poller for a device that has no hostname or api-key
    // we just create the reponse and call callback just as the poller would do.
    let response = this.checkForMissingHostnameOrToken(device)
    if (response) {
      this.callback(device, response)
      return
    }

    let poller = this.props.demo  ? new SimulatedDevicePoller(device, this.callback)
                                  : new DevicePoller(device, this.callback)

    this._pollers.push(poller)
  }

  checkForMissingHostnameOrToken(device: IVentilator): IDevicePollResult {
    if (! device.hostname || ! device.hostname.trim()) {
      return {
        apiReceiveStatus: {
          ok: false,
          alerts: {
            noHostName: true
          }
        }
      }
    }

    if (! device.apiKey || ! device.apiKey.trim()) {
      return {
        apiReceiveStatus: {
          ok: false,
          alerts: {
            noApiKey: true
          }
        }
      }
    }
    return null
  }

  componentWillUnmount() {
    // console.log(`Component un-mounted !`)
    this._mounted = false

    // Call release on each poller so they can cancel their timers
    this._pollers.forEach((p) => {
      p.release()
    })
  }

  callback(device: IVentilator, pollResult: IDevicePollResult) : void {
    // console.log(`${device.name}: callback called. Mounted: ${this._mounted}`)

    if (! this._mounted) {
      // console.log(`${device.name}: Callback called, but component was unmounted`)
      return
    }

    this.setState((state) => {
      let results = {...state.results, [device.id]: pollResult}
      return {results}
    })
  }

  render() {
    const { cluster } = this.props
    const { results, selectVentilatorsMode, visibleVentilators } = this.state

    if (selectVentilatorsMode) {
      return (
        <React.Fragment>
          <h4>{cluster.name}</h4>
          <section>
            <h6>{`Please select the ${cluster.organization.ventilatorLocationTermPlural} you would like to show`}</h6>
            <SelectVentilators cluster={cluster} onClose={this.exitSelectVentilatorsMode}/>
          </section>
        </React.Fragment>
      )
    }

    // selectVentilatorMode is false

    if (! cluster.ventilators.length) {
      return (
        <React.Fragment>
          <h4>{cluster.name}</h4>
          <section>
            <h6>{`This ${cluster.organization.clusterTermSingular} has no ventilator monitors.`}</h6>
          </section>
        </React.Fragment>
      )
    }

    let headerJsx = (
      <div className="row-spread">
        <h4>{cluster.name}</h4>
        <button className="btn btn-outline-primary" onClick={this.enterSelectVentilatorsMode}>
          {`Hide/Show ${cluster.organization.ventilatorLocationTermPlural}`}
        </button>
      </div>
    )

    if (! visibleVentilators.length) {
      return (
        <React.Fragment>
          {headerJsx}
          <section>
            <h6>
              {
                `This ${cluster.organization.clusterTermSingular} has ventilator monitors but they are all hidden.
                Please click the 'Hide/Show ${cluster.organization.ventilatorLocationTermPlural}' button to make some of them visible`
              }
            </h6>
          </section>
        </React.Fragment>
      )
    }

    let split = this.splitResults(cluster.ventilators, results)

    let result = (
      <React.Fragment>
        { headerJsx }
        { this.getVentAlarmSoundMonitorsJsx(split.ventAlarmSoundMonitors, results) }
        {
          // Temporarily removing for MVP
          // this.getVentDataMonitorsJsx(split.ventDataMonitors, results)
        }
        { this.getCommErrorsJsx(split.commError, results) }
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
      let result: IDevicePollResult = results[v.id]

      // We only know whether the device at the other end is a data monitor or an alarm
      // monitor based on what it tells us in a response (at least one of the keys in
      // result.apiResponse.device.roles should be true). So, if we do not have a response
      // we can't be sure what it is.

      if (!result) {
        split.other.push(v)
        return
      }

      // If we get a communication error, we also can't tell what it is, but we'll display
      // it because it might have been an alarm monitor.

      if (! result.apiReceiveStatus.ok) {
        split.commError.push(v)
        return
      }

      // We have a response ! - What role is the monitor in?

      let placed = false

      if (result.apiResponse.device.roles.ventilatorAlarmSoundMonitor) {
        split.ventAlarmSoundMonitors.push(v)
        placed = true
      }

      if (result.apiResponse.device.roles.ventilatorDataMonitor) {
        split.ventDataMonitors.push(v)
        placed = true
      }

      // we got a response, but neither key was true. This is a schema error and should
      // have resulted in a comm error.
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
      let statusJsx = this.getStatusJsx(!alert)
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
          <table className='demo-ventilator-table narrow'>
            <thead>
              <tr className="tr-heading">
                <th>{this.props.cluster.organization.ventilatorLocationTermSingular}</th>
                <th>Status</th>
                <th>Alert</th>
              </tr>
            </thead>
            <tbody>
              {vents.map((v) => getRow(v))}
            </tbody>
          </table>
        }
      </section>
    )
  }

  /*
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
                    <th>{this.props.cluster.organization.ventilatorLocationTermSingular}</th>
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
  */

  getCommErrorsJsx = (vents: IVentilator[], results: Results) => {
    if (! vents.length) {
      return null
    }
    let getRow = (v: IVentilator) => {
      let result: IDevicePollResult = results[v.id]
      let alert = getFirstAlert(result?.apiReceiveStatus?.alerts)
      let reason = this.getAlertText(alert)
      let statusJsx = this.getStatusJsx(!alert)
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
              <th>{this.props.cluster.organization.ventilatorLocationTermSingular}</th>
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

  // Ensure ventilator objects are not reused when switching clusters
  // by ensuring the key has both the cluster id and ventilator id
  getKey = (vent: IVentilator) => {
    return `${this.props.cluster.id}-${vent.id}`
  }

  getStatusJsx = (ok: boolean) => {
    return ok
      ? <Circle size="lg" color={'LimeGreen'}/>
      : <ExclamationTriangle size="lg" color={'red'} className="flash"/>
  }

  static alertMapping = {
    audioAlarm: "Audio Alarm",
    noHostName: "Missing Hostname",
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

  enterSelectVentilatorsMode = () => {
    // kill all of the pollers while the user is selecting ventilators to show/hide
    this._pollers.forEach((p) => p.release())
    this._pollers = []
    this.setState({selectVentilatorsMode: true})
  }

  exitSelectVentilatorsMode = () => {
    // since we're exiting selection mode, we need to re-read the list of monitors to hide
    let hiddenVentilatorIds = this._helper.readHiddenSet()
    let visibleVentilators = this.props.cluster.ventilators.filter((v) => ! hiddenVentilatorIds.has(v.id))

    // user could have been in select mode for several minutes. Previous results are outdated so we delete them.
    // We don't want to create the pollers for the now-visable monitors until the state is updat
    this.setState({
      selectVentilatorsMode: false,
      visibleVentilators,
      results: {}
      }
    )

      // start new pollers for all of the visible ventilators
    visibleVentilators.forEach((v) => {this.createPoller(v)})
  }
}

export default Cluster