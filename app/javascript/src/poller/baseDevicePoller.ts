import {
  IVentilator,
  IDevicePollResult,
  IMeasurementFieldMeta,
  DevicePollerCallback
} from '../types'
import { generateRandomValueBetween } from '../utils'

/** An instance of one of the subtypes of this class is
 *  responsible for polling a single device, or for simulating
 *  the polling of a single device. *
 */
 export abstract class BaseDevicePoller {
  _device: IVentilator = null
  _callback: DevicePollerCallback = null
  _timeout = null
  _running: boolean = false

  // When the device is connected, poll this often
  static GOOD_POLL_PERIOD_MS = 3000

  // When the device is unreachable or returning bad data, poll this often
  static BAD_POLL_PERIOD_MS = 15000

  // When the poller starts up, it will pick a random number between
  // 0 and this number of milliseconds to delay before making the first call
  static STARTUP_DELAY = 500

  // See other static fields at the bottom

  constructor(device: IVentilator, callback: DevicePollerCallback) {
    // console.log(`${device.name}: Constructor.`)

    this._device = device
    this._callback = callback
    this._running = true

    this.poll = this.poll.bind(this)

    let startupDelay = generateRandomValueBetween(0, BaseDevicePoller.STARTUP_DELAY)
    this._timeout = setTimeout(this.poll, startupDelay)
  }

  release(): void {
    //console.log(`${this._device.name}: Released.`)
    this._running = false
    clearInterval(this._timeout)
  }

  /*
  pause(): void {
    console.log(`${this._device.name}: Pausing`)
    this._running = false
    clearInterval(this._timeout)
  }

  unpause(): void {
    console.log(`${this._device.name}: Unpausing`)
    this._running = true
    let startupDelay = generateRandomValueBetween(0, BaseDevicePoller.STARTUP_DELAY)
    this._timeout = setTimeout(this.poll, startupDelay)
  }
  */

  async poll(): Promise<void> {
    // console.log(`${this._device.name}: Entering Poll.`)

    // Timer was cleared so not expecting this to happen
    if (!this._running) {
      console.log(`${this._device.name}: poll called while not running`)
      return
    }

    let pollResult = await this.pollDevice()

    if (!this._running) {
      console.log(`${this._device.name}: pollDevice completed but poller is no longer running. Returning`)
      return
    }

    // console.log(`${this._device.name}: PollResult: ${JSON.stringify(pollResult)}`)

    this.validate(pollResult)

    this._callback(this._device, pollResult)

    if (! pollResult.apiReceiveStatus.ok &&
          (pollResult.apiReceiveStatus.alerts.noHostName ||
            pollResult.apiReceiveStatus.alerts.noApiKey ||
            pollResult.apiReceiveStatus.alerts.notAnAlarmSoundMonitor))
    {
      // There is no reason to keep sending these results over and over
      // Now that we sent them once, we'll stop polling forever
      console.log(`${this._device.name}: noHostname or noApiKey or notAnAlarmSoundMonitor. Done polling forever.`)
      return
    }

    this.handle(pollResult)

    var newPollingPeriod = pollResult.apiReceiveStatus.ok
                            ? BaseDevicePoller.GOOD_POLL_PERIOD_MS
                            : BaseDevicePoller.BAD_POLL_PERIOD_MS

    this._timeout = setTimeout(this.poll, newPollingPeriod)
  }

  /**
   * Validate the apiResponse within the pollResult and update the
   * apiReceiveStatus within the pollResult to reflect the validation result
   * @param pollResult
   */
  validate(pollResult: IDevicePollResult): void {

    // if not in the role of AlarmSoundMonitor, it's a comm alert
    if (pollResult.apiReceiveStatus.ok) {
      if (! pollResult?.apiResponse?.device?.roles?.ventilatorAlarmSoundMonitor ) {
        pollResult.apiReceiveStatus.ok = false
        pollResult.apiReceiveStatus.alerts = {notAnAlarmSoundMonitor: true}
      }
    }
  }

  /** Gives an opportunity for the sub-class
   *  to do something with the pollResult
   * */
  handle(pollResult: IDevicePollResult): void {
  }

  /** Actually gets the data from the device (or simulates it) */
  abstract async pollDevice(): Promise<IDevicePollResult>

  static MeasurementFieldMetadata : {[key: string]: IMeasurementFieldMeta} = {
    ieRatio:                 {min: 1,   max: 4,   uom: 'ratio'},
    peakInspiratoryPressure: {min: 60,  max: 80,  uom: 'CMH2O'},
    peep:                    {min: 5,   max: 10,  uom: 'CMH2O'},
    respiratoryRate:         {min: 8,   max: 35,  uom: 'breathsPerMinute'},
    tidalVolume:             {min: 300, max: 800, uom: 'ml/kg'},
  }

  static MeasurementFieldNames = Object.keys(BaseDevicePoller.MeasurementFieldMetadata)
}
