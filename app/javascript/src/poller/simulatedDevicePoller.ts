import { IDevicePollResult } from '../types'
import { BaseDevicePoller } from './baseDevicePoller'
import cloneDeep from 'lodash.clonedeep'
// import { clamp, generateRandomValueBetween } from '../utils'

const VENTILATOR_NAMES_WITH_SIMULATED_COMM_FAILURE = ["East-2", "West-4"]
const VENTILATOR_NAMES_WITH_AUDIO_ALARM_ALERT = ["East-4"]

export class SimulatedDevicePoller extends BaseDevicePoller {
  // We save the last result so we can change just one measurement field
  // (because the UI flashes whenever a field is changed
  // so we don't want to change too many)
  _lastPollResult: IDevicePollResult = null

  pollDevice(): Promise<IDevicePollResult> {
    // If there is no last result, then this is the first call,
    // so return random values for all fields
    if (! this._lastPollResult) {
      return Promise.resolve(this.getRandomPollResult())
    }

    let result = this.getFreshPollResultWithPreviousValues()

    // because we are not simulating data monitors, we can skip this.
    // we are not randomly changing alarm sound monitors from/to alerted/not alerted

    /*
    // 50% of the time, don't change anything
    let change = generateRandomValueBetween(0, 1)
    if (change === 0) {
      return Promise.resolve(result)
    }

    // otherwise, get a new status object with the value of one measuement item changed
    this.updateOneMeasurementField(result)
    */

    return Promise.resolve(result)
  }

  /** Called by base class to give us a chance to stow away the
   *  pollResult into _lastPollResult, so in the call to pollDevice()
   *  above, we can change a single field and return it again
   *  */
  handle(pollResult: IDevicePollResult) {
    this._lastPollResult = pollResult
  }

  getRandomPollResult(): IDevicePollResult {
    let result = this.getPollResultTemplate()

    if (VENTILATOR_NAMES_WITH_SIMULATED_COMM_FAILURE.includes(this._device.name)) {
      result.apiReceiveStatus.ok = false
      result.apiReceiveStatus.alerts = {
        connection: true
      }
    }

    if (VENTILATOR_NAMES_WITH_AUDIO_ALARM_ALERT.includes(this._device.name)) {
      result.apiResponse.ventilatorAlarmSoundMonitor.alerts.audioAlarm = true
    }

    /*
    if (result.apiResponse['ventilatorDataMonitor']) {
      let status = result.apiResponse.ventilatorDataMonitor.status

      status.ieRatio.value = this.generateRandomColumnValue('ieRatio')
      status.peakInspiratoryPressure.value = this.generateRandomColumnValue('peakInspiratoryPressure')
      status.peep.value = this.generateRandomColumnValue('peep')
      status.respiratoryRate.value = this.generateRandomColumnValue('respiratoryRate')
      status.tidalVolume.value = this.generateRandomColumnValue('tidalVolume')
    }
    */

    return result
  }

  // Make a deep clone of _lastPollResult and update all of the timestamps
  getFreshPollResultWithPreviousValues(): IDevicePollResult {
    let result = null
    if (this._lastPollResult) {
      result = cloneDeep(this._lastPollResult) as IDevicePollResult
      result.apiResponse.device.currentTime = new Date()
      result.apiResponse.ventilatorAlarmSoundMonitor.timestamp = new Date()
    }
    return result
  }

  // Get a new response (with fresh timestamps), copy over the measurement from the current state, and then
  // modify one of the measurement items. Pick one at random and pick the direction (+1 / -1) at random.
  // ieRatio is a special case becasue the value is 1:n, so just mack it 1:2 or 1:4

  /*
  updateOneMeasurementField(result: IDevicePollResult) : void {
    let status = result.apiResponse.ventilatorDataMonitor.status
    let columnIndx = generateRandomValueBetween(0, BaseDevicePoller.MeasurementFieldNames.length - 1)
    let upDown = generateRandomValueBetween(0,1)
    let key = BaseDevicePoller.MeasurementFieldNames[columnIndx]
    let value = (key == "ieRatio") ? 3 : Number(status[key].value)
    value = upDown === 0 ? value + 1 : value - 1
    let metadata = BaseDevicePoller.MeasurementFieldMetadata[key]
    value = clamp(value, metadata.min, metadata.max)
    let newValue = (key == "ieRatio") ? `1:${value}` : value.toString()
    status[key].value = newValue
    // console.log(`changed ${key} to ${newValue}`)
  }
  */

  /**
   * This is used by SimulatedDevicePoller to initialize the result.
   * But it is also used by DevicePoller in the oldApi to present a response which looks like the new API.
   * Todo: When we are no longer supporting the old API, move this to SimulatedDevicePoller
   */
  getPollResultTemplate(): IDevicePollResult {
    let result: IDevicePollResult = {
      apiReceiveStatus: {
        ok: true
      },
      apiResponse: {
        device: {
          id: `${this._device.id}-${this._device.name}`,
          currentTime: new Date(),
          roles: {
            ventilatorAlarmSoundMonitor: true,
            ventilatorDataMonitor: false
          }
        },
        /*
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
        },
        */
        ventilatorAlarmSoundMonitor: {
            timestamp: new Date(),
            status: {

            },
            alerts: {
              "audioAlarm": false
            }
        },
      }
    }
    return result
  }

  /*
  generateRandomColumnValue = (columnName: string) : string => {
    let column = BaseDevicePoller.MeasurementFieldMetadata[columnName]
    let value = generateRandomValueBetween(column.min, column.max).toString()
    if (columnName === 'ieRatio') {
      value = `1:${value}`
    }
    return value
  }
  */
}