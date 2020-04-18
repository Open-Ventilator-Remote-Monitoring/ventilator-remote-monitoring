import { IVentilator, IDevicePollResult } from './types'
import { clamp, generateRandomValueBetween } from './utils'
import { BaseDevicePoller } from './baseDevicePoller'

const VENTILATOR_NAME_WITH_SIMULATED_FAILURE = "East-2"

export class SimulatedDevicePoller extends BaseDevicePoller {
  // We save the last result so we can change just one value
  // (becasue the UI flashes whenever a field is changed
  // so we don't want to change too many)
  _lastPollResult: IDevicePollResult = null

  constructor(device: IVentilator, callback: BaseDevicePoller.Callback) {
    super(device, callback)
  }

  pollDevice(): Promise<IDevicePollResult> {
    // If there is no last result, then this is the first call,
    // so return random values for all fields
    if (! this._lastPollResult) {
      return Promise.resolve(this.getRandomPollResult())
    }

    let result = this.getFreshPollResultWithSameValues()

    // 50% of the time, don't change anything
    let change = generateRandomValueBetween(0, 1)
    if (change === 0) {
      return Promise.resolve(result)
    }

    // otherwise, get a new status object with the value of one measuement item changed
    this.updateOneMeasurementField(result)

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

    result.connected = this._device.name !== VENTILATOR_NAME_WITH_SIMULATED_FAILURE

    let status = result.apiResponse.ventilatorDataMonitor.status

    status.ieRatio.value = this.generateRandomColumnValue('ieRatio')
    status.peakInspiratoryPressure.value = this.generateRandomColumnValue('peakInspiratoryPressure')
    status.peep.value = this.generateRandomColumnValue('peep')
    status.respiratoryRate.value = this.generateRandomColumnValue('respiratoryRate')
    status.tidalVolume.value = this.generateRandomColumnValue('tidalVolume')

    return result
  }

  // get a PollResult with new timestamps, but copy over values
  // for connected and ventilatorDataMonitor.status
  getFreshPollResultWithSameValues(): IDevicePollResult {
    let result = this.getPollResultTemplate()
    result.connected = this._lastPollResult.connected

    let fromStatus = this._lastPollResult.apiResponse.ventilatorDataMonitor.status
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

  generateRandomColumnValue = (columnName: string) : string => {
    let column = BaseDevicePoller.MeasurementFieldMetadata[columnName]
    let value = generateRandomValueBetween(column.min, column.max).toString()
    if (columnName === 'ieRatio') {
      value = `1:${value}`
    }
    return value
  }
}