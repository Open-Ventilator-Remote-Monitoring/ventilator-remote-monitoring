import { IVentilator, IDevicePollResult, IMeasurementFieldMeta } from './types'
import { generateRandomValueBetween } from './utils'

/** An instance of one of the subtypes of this class is
 *  responsible for polling a single device, or for simulating
 *  the polling of a single device. *
 */
export abstract class BaseDevicePoller {
  _device: IVentilator = null
  _callback: BaseDevicePoller.Callback = null
  _timeout: NodeJS.Timeout = null

  // When the device is connected, poll this often
  static GOOD_POLL_PERIOD_MS = 3000

  // When the device is unreachable or returning bad data, poll this often
  static BAD_POLL_PERIOD_MS = 15000

  // See other static fields at the bottom

  constructor(protected device: IVentilator, protected callback: BaseDevicePoller.Callback) {
    this._device = device
    this._callback = callback

    this.poll = this.poll.bind(this)

    let startupDelay = generateRandomValueBetween(0, BaseDevicePoller.GOOD_POLL_PERIOD_MS)
    this._timeout = setTimeout(this.poll, startupDelay)
  }

  release(): void {
    // console.log(`${this.#device.name}: Released.`)
    clearInterval(this._timeout)
  }

  async poll(): Promise<void> {
    // console.log(`${this.#device.name}: Entering Poll.`)

    let pollResult = await this.pollDevice()

    this._callback(this._device.id, pollResult)

    this.handle(pollResult)

    var newPollingPeriod = pollResult.connected
                            ? BaseDevicePoller.GOOD_POLL_PERIOD_MS
                            : BaseDevicePoller.BAD_POLL_PERIOD_MS

    this._timeout = setTimeout(this.poll, newPollingPeriod)
  }

  /** Gives an opportunity for the sub-class
   *  to do something with the pollResult
   * */
  handle(IDevicePollResult): void {
  }

  /** Actually gets the data from the device (or simulates it) */
  abstract async pollDevice(): Promise<IDevicePollResult>

  /**
   * This is used by SimulatedDevicePoller to initialize the result.
   * But it is also used by DevicePoller in the oldApi to present a response which looks like the new API.
   * Todo: When we are no longer supporting the old API, move this to SimulatedDevicePoller
   */
  getPollResultTemplate(): IDevicePollResult {
    let result: IDevicePollResult = {
      connected: false,
      apiResponse: {
        device: {
          id: `${this._device.id}-${this._device.name}`,
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

  static MeasurementFieldMetadata : {[key: string]: IMeasurementFieldMeta} = {
    ieRatio:                 {min: 1,   max: 4},
    peakInspiratoryPressure: {min: 60,  max: 80},
    peep:                    {min: 5,   max: 10},
    respiratoryRate:         {min: 8,   max: 35},
    tidalVolume:             {min: 300, max: 800},
  }

  static MeasurementFieldNames = Object.keys(BaseDevicePoller.MeasurementFieldMetadata)
}

// Ideally the type would be defined inside the class, but it can't be done yet.
// https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-namespaces-with-classes

export namespace BaseDevicePoller {
  // Any user of a subclass of BaseDevidcePoller should implement
  // a function with the signiture which is called whenever a poll has completed
  export type Callback = (deviceId: number, result: IDevicePollResult) => void
}





