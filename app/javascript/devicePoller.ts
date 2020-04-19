import {
  IVentilator,
  IDevicePollResult,
  IDeviceApiResponse,
} from './types'
import { get } from './api'
import { BaseDevicePoller } from './baseDevicePoller'

const API_KEY_HEADER = "Authorization"
const API_KEY_PREFIX = 'OpenVentApiKeyV1' // followed by 1 space followed by apiKey

const getUrl = (hostname) => {
  return `https://${hostname}/api/v1/status`
}

export class DevicePoller extends BaseDevicePoller {
  _url: string = null

  constructor(device: IVentilator, callback: BaseDevicePoller.Callback) {
    super(device, callback)

    this._url = getUrl(this._device.hostname)

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

    // console.log(`${this._device.name}: Getting from New API at: ${this._newUrl}`)

    let headers = {}
    if (this._device.apiKey) {
      headers[API_KEY_HEADER] = `${API_KEY_PREFIX} ${this._device.apiKey}`
    }

    let response = await get<IDeviceApiResponse>(this._url, headers)
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