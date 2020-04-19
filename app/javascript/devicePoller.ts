import {
  IVentilator,
  IDevicePollResult,
  IDeviceApiResponse,
  IVentilatorApiV0CallResponse
} from './types'
import { get } from './api'
import { BaseDevicePoller } from './baseDevicePoller'

const API_KEY_HEADER = "Authorization"
const API_KEY_PREFIX = 'OpenVentApiKeyV1' // followed by 1 space followed by apiKey

const getOldUrl = (hostname) => {
  return `http://${hostname}/api/ventilator`
}

const getNewUrl = (hostname) => {
  return `http://${hostname}/api/v1/status`
}

export class DevicePoller extends BaseDevicePoller {
  _apiVersion?: number = null // null - unknown, 0 - old api, 1 - new api
  _oldUrl: string = null
  _newUrl: string = null

  constructor(device: IVentilator, callback: BaseDevicePoller.Callback) {
    super(device, callback)

    this._oldUrl = getOldUrl(this._device.hostname)
    this._newUrl = getNewUrl(this._device.hostname)

    if (this._device.apiKey) {
      this._device.apiKey = this._device.apiKey.trim()
    }
  }

  async pollDevice(): Promise<IDevicePollResult> {
    if (! this._device.hostname) {
      return {
        apiReceiveStatus: {
          ok: false,
          alerts: {
            noHostName: true
          }
        }
      }
    }

    if (! this._device.apiKey) {
      return {
        apiReceiveStatus: {
          ok: false,
          alerts: {
            noApiKey: true
          }
        }
      }
    }

    if (this._apiVersion === 1) {
      return this.pollNewAPI()
    }

    if (this._apiVersion === 0) {
      return this.pollOldAPI()
    }

    // we don't know which to use - try new then old
    let result = await this.pollNewAPI()
    if (result.apiReceiveStatus.ok) {
      this._apiVersion = 1
      return result
    }

    result = await this.pollOldAPI()
    if (result.apiReceiveStatus.ok) {
      this._apiVersion = 0
      return result
    }

    // Both APIs failed - we still don't know which to use,
    // so we'll keep trying both until we do
    return {
      apiReceiveStatus: {
        ok: false,
        alerts: {
          connection: true
        }
      }
    }
  }

  // poll the old API and make the response look like an IDevicePollResult
  async pollOldAPI(): Promise<IDevicePollResult> {
    // console.log(`${this._device.name}: Getting from Old API at: ${this._oldUrl}`)

    let headers = {}
    if (this._device.apiKey) {
      headers[API_KEY_HEADER] = `${API_KEY_PREFIX} ${this._device.apiKey}`
    }

    let response = await get<IVentilatorApiV0CallResponse>(this._oldUrl, headers)
    console.log(`${this._device.name}: Old API Response: ${JSON.stringify(response)}`)

    if (response.ok) {
      let result = this.getPollResultTemplate()
      result.apiReceiveStatus.ok = true
      let status = result.apiResponse.ventilatorDataMonitor.status
      let v = response.parsedBody.ventilator[0]
      status.tidalVolume.value = v.tidalVolume.toString()
      status.respiratoryRate.value = v.respiratoryRate.toString(),
      status.peakInspiratoryPressure.value = v.peakInspiratoryPressure.toString(),
      status.ieRatio.value = `1:${v.ieRatio}`,
      status.peep.value = v.peep.toString()
      return result
    }

    return {
      apiReceiveStatus: {
        ok: false,
        alerts: {
          connection: true
        }
      }
    }
  }

  async pollNewAPI(): Promise<IDevicePollResult> {
    // console.log(`${this._device.name}: Getting from New API at: ${this._newUrl}`)

    let headers = {}
    if (this._device.apiKey) {
      headers[API_KEY_HEADER] = `${API_KEY_PREFIX} ${this._device.apiKey}`
    }

    let response = await get<IDeviceApiResponse>(this._newUrl, headers)
    console.log(`${this._device.name}: New API Response: ${JSON.stringify(response)}`)

    if (response.ok) {
      // todo: validate response: schema, roles/keys, timestamps, UOMs, etc.
      const result : IDevicePollResult = {
        apiReceiveStatus: { ok: true },
        apiResponse: response.parsedBody
      }
      return result
    }

    return {
      apiReceiveStatus: {
        ok: false,
        alerts: {
          connection: true
        }
      }
    }
  }
}