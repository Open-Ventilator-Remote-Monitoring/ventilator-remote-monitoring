export interface IOrganization {
  id: number
  name: string
  clusterTermSingular: string
  clusterTermPlural: string
  ventilatorLocationTermSingular: string
  ventilatorLocationTermPlural: string
  clusters: ICluster[]
}

export interface ICluster {
  organization?: IOrganization
  id: number
  name: string
  ventilators: IVentilator[]
}

export interface IVentilator {
  // from API call
  id: number
  name: string
  hostname?: string
  apiKey?: string
  status?: number   // added for ClusterC option, so we can sort the vents based on status
}

// Following types define the result of calling either /api/ventilator or /api/v1/device

export interface IDevicePollResult {
  apiReceiveStatus: IApiReceiveStatus
  apiResponse?: IDeviceApiResponse
}

/** This information is only used on the bowser end to communicate
 *  success or failure of the data. The failures all represent failures
 *  that could happen on the receving end.
 */
export interface IApiReceiveStatus {
  ok: boolean,
  // if good is false, then at least one of the failure keys should be set
  alerts?: {
    noHostName?: boolean
    noApiKey?: boolean
    connection?: boolean
    schemaValidation?: boolean
    uomMismatch?: boolean
    staleTimeStamp?: boolean
    notAnAlarmSoundMonitor?: boolean
  }
}

export interface IDeviceApiResponse {
  device: IDevice
  ventilatorAlarmSoundMonitor?: IVentilatorAlarmSoundMonitor
  ventilatorDataMonitor?: IVentilatorDataMonitor
}

export interface IDevice {
  id: string
  currentTime: Date
  roles: {
    ventilatorAlarmSoundMonitor: boolean
    ventilatorDataMonitor: boolean
  }
}

export interface IVentilatorAlarmSoundMonitor {
  timestamp: Date
  status: {}
  alerts: {
    audioAlarm: boolean
  }
}

export interface IMeasurementValue {
  value: string,
  uom: string
}

export interface IVentilatorDataMonitor {
  timestamp: Date
  status: {
    ieRatio: IMeasurementValue
    peakInspiratoryPressure: IMeasurementValue
    peep: IMeasurementValue
    respiratoryRate: IMeasurementValue
    tidalVolume: IMeasurementValue
  }
  alerts: {}
}

export interface IMeasurementFieldMeta {
  min: number,
  max: number,
  uom: string
}

export type DevicePollerCallback = (device: IVentilator, result: IDevicePollResult) => void

