import React, { Component } from "react"
import isEqual from 'lodash/isEqual'

import { ICluster, IVentilator, IDevicePollResult } from '../types'
import { DevicePoller } from '../poller/devicePoller'
import { SimulatedDevicePoller } from '../poller/simulatedDevicePoller'
import { BaseDevicePoller } from "../poller/baseDevicePoller"
import { getLayout, getFirstAlert, camelCaseToWords } from "../utils"
import { SelectVentilators } from './selectVentilators'
import { HiddenVentilatorsHelper } from '../hiddenVentilatorsHelper'
import { Spinner } from './spinner'
import { RowSpread } from './shared'

const MINIMUM_ITEM_WIDTH = 300

interface IProps {
  cluster: ICluster
  demo: boolean
}

interface IState {
  results: Map<number, IDevicePollResult>
  selectVentilatorsMode: boolean
  visibleVentilators: IVentilator[]

  // whenever the number of visible ventilators changes, or the size of the window
  // we'll call getLayout which will calculate the # or rows and columns to use.
  layout: {rows: number, cols: number}
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
      results: new Map(),
      selectVentilatorsMode: false,
      visibleVentilators,
      layout: {rows: 0, cols: 0}
    }

    this.callback = this.callback.bind(this)
    this.createPoller = this.createPoller.bind(this)
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
  }

  componentDidMount() {
    // console.log(`Component mounted !`)
    this._mounted = true

    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions)

    // start a poller for all visible monitors
    this.state.visibleVentilators.forEach((v) => {this.createPoller(v)})
  }

  componentWillUnmount() {
    // console.log(`Component un-mounted !`)
    this._mounted = false

    window.removeEventListener('resize', this.updateWindowDimensions)

    // Call release on each poller so they can cancel their timers
    this._pollers.forEach((p) => {
      p.release()
    })
  }

  /**
   * Part of React Framework. Enables us to reduce the number of times that render is called.
   * Becasue we get a new response every 3 seconds for every monitor, and in most cases it will not
   * have changed substantially from the previous response (timestamps will differ, but the alert
   * fields will not), we will try to avoid a render.
   */
  shouldComponentUpdate(nextProps: Readonly<IProps>, nextState: Readonly<IState>) {
    if (nextState.selectVentilatorsMode !== this.state.selectVentilatorsMode) {
      return true
    }

    if (nextState.layout.rows !== this.state.layout.rows
        || nextState.layout.cols !== this.state.layout.cols) {
      return true
    }

    if (! isEqual(nextState.visibleVentilators, this.state.visibleVentilators)) {
      return true
    }

    // we are focusing here on the results. They arrive every 3 seconds,
    // yet they seldom change. So, if they have not changed, we may be able
    // to avoid a render.

    if (nextState.results.size !== this.state.results.size) {
      return true
    }

    // Becasue results are continually being added as they come back from polling,
    // we expect the next results to have >= this results, so we iterate over next results

    for (const [key, nextPollResult] of nextState.results) {
      const thisPollResult = this.state.results.get(key)
      if (!thisPollResult) {
        return true
      }

      const nextRecStat = nextPollResult.apiReceiveStatus
      const thisRecStat = thisPollResult.apiReceiveStatus

      if (nextRecStat.ok !== thisRecStat.ok || ! isEqual(nextRecStat.alerts, thisRecStat.alerts)) {
        return true
      }

      const nextApiResp = nextPollResult.apiResponse
      const thisApiResp = thisPollResult.apiResponse

      if (nextApiResp?.ventilatorAlarmSoundMonitor?.alerts?.audioAlarm  !== thisApiResp?.ventilatorAlarmSoundMonitor?.alerts?.audioAlarm) {
        return true
      }
    }

    return false
  }

  updateWindowDimensions() {
    // console.log(`getting layout with: width: ${window.innerWidth} Height: ${window.innerHeight}`)
    let layout = getLayout(this.state.visibleVentilators.length, window.innerWidth, window.innerHeight, MINIMUM_ITEM_WIDTH )
    this.setState({ layout })
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

  callback(device: IVentilator, pollResult: IDevicePollResult) : void {
    // console.log(`${device.name}: callback called. Mounted: ${this._mounted}`)

    if (! this._mounted) {
      // console.log(`${device.name}: Callback called, but component was unmounted`)
      return
    }

    this.setState((state) => {
      let results = new Map(state.results.entries())
      results.set(device.id, pollResult)
      return {results}
    })
  }

  render() {
    if (! this._mounted) {
      return null
    }

    const { cluster } = this.props
    const { selectVentilatorsMode, visibleVentilators } = this.state

    if (selectVentilatorsMode) {
      return (
        <section>
          <h4>{cluster.name}</h4>
          <SelectVentilators cluster={cluster} onClose={this.exitSelectVentilatorsMode}/>
        </section>
      )
    }

    if (! cluster.ventilators.length) {
      return (
        <section>
          <h4>{cluster.name}</h4>
          <section>
            <h6>{`This ${cluster.organization.clusterTermSingular} has no ventilator monitors.`}</h6>
          </section>
        </section>
      )
    }

    let hiddenMonitorsJsx = null
    if (this.state.visibleVentilators.length < cluster.ventilators.length) {
      hiddenMonitorsJsx = (
        <h6 className="warning-msg">
          {`One or more ${cluster.organization.ventilatorLocationTermPlural} are hidden`}
        </h6>
      )
    }

    let headerJsx = (
      <RowSpread>
        <h4>{cluster.name}</h4>
        {hiddenMonitorsJsx}
        <button className="btn btn-info" onClick={this.enterSelectVentilatorsMode}>
          {`Hide/Show ${cluster.organization.ventilatorLocationTermPlural}`}
        </button>
      </RowSpread>
    )

    if (! visibleVentilators.length) {
      return (
        <React.Fragment>
          {headerJsx}
          <section>
            <h5>{`This ${cluster.organization.clusterTermSingular} has ventilator monitors but they are all hidden.`}</h5>
            <h5>{`Please click the 'Hide/Show ${cluster.organization.ventilatorLocationTermPlural}' button if you would like to make some visible.`}</h5>
          </section>
        </React.Fragment>
      )
    }

    let result = (
      <div>
        { headerJsx }
        { this.getVentAlarmSoundMonitorsJsx() }
      </div>
    )

    return result
  }

  getVentAlarmSoundMonitorsJsx = () => {
    let count = this.state.visibleVentilators.length
    let {rows, cols} = this.state.layout

    console.log(`rendering ${count} items into ${cols} columns of ${rows} rows`)

    let allColsJsx = []
    for (var colIndx = 0; colIndx < cols; colIndx++) {
      let rowsJsx = []
      for (var rowIndx = 0; rowIndx < rows; rowIndx++) {
        var indx = colIndx * rows + rowIndx

        if (indx > count - 1) {
          // cols * rows is > count. We're done, leaving some unused rows in the last column
          break;
        }

        var vent = this.state.visibleVentilators[indx]
        let rowJsx = this.getVentAlarmSoundMonitorsRowJsx(vent)
        rowsJsx.push(rowJsx)
      }

      let colJsx = (
        <div key={colIndx} className='column'>
          { rowsJsx }
        </div>
      )
      allColsJsx.push(colJsx)
    }

    let jsx = (
      <React.Fragment>
        <div className="allColumns">
          { allColsJsx }
        </div>
      </React.Fragment>
    )

    return jsx
  }

  getVentAlarmSoundMonitorsRowJsx = (vent: IVentilator) => {
    let result = this.state.results.get(vent.id)

    if (! result) {
      return (
        <div key={this.getKey(vent)} className="vent">
          {vent.name}<Spinner />
        </div>
      )
    }

    let commFail = false
    let alert = false

    if (! result.apiReceiveStatus.ok) {
      commFail = true
    } else {
      let alertKey = getFirstAlert(result?.apiResponse?.ventilatorAlarmSoundMonitor?.alerts)
      if (alertKey) {
        alert = true
      }
    }

    let trClassName = commFail ? "commFail" : alert ? "alerting" : "good"

    return (
      <div key={this.getKey(vent)} className={"vent " + trClassName}  >
        {vent.name}
      </div>
    )
  }

  // Ensure ventilator objects are not reused when switching clusters
  // by ensuring the key has both the cluster id and ventilator id
  getKey = (vent: IVentilator) => {
    return `${this.props.cluster.id}-${vent.id}`
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

    // the number of visible ventilators may have changed. Update layout.
    let layout = getLayout(visibleVentilators.length, window.innerWidth, window.innerHeight, MINIMUM_ITEM_WIDTH)

    // user could have been in select mode for several minutes. Previous results are outdated so we delete them.
    // We don't want to create the pollers for the now-visable monitors until the state is updat
    this.setState({
      selectVentilatorsMode: false,
      visibleVentilators,
      results: new Map(),
      layout
      }
    )

      // start new pollers for all of the visible ventilators
    visibleVentilators.forEach((v) => {this.createPoller(v)})
  }

  static alertMapping: {[key: string] : string} = {
    audioAlarm: "Audio Alarm",
    noHostName: "Missing Hostname",
    noApiKey: "Missing API Key",
    connection: "Connection Error",
    schemaValidation: "Invalid Response",
    uomMismatch: "Invalid Response",
    staleTimeStamp: "Measurement was too old",
    notAnAlarmSoundMonitor: "Not a sound monitor"
  }
}

export default Cluster