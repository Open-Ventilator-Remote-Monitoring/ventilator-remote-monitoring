export interface IOrganization {
  id: number
  name: string
  clusters: ICluster[]
}

export interface ICluster {
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
}

// Following types define the result of calling either /api/ventilator or /api/v1/device

export interface IDevicePollResult {
  connected: boolean
  apiResponse?: IDeviceApiResponse
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

// These are only to support the "old" API


export interface IVentilatorApiV0CallResponse {
  // todo: why is this an array? Can it ever have more than one value?
  ventilator: IVentilatorApiV0PollValues[]
}

export interface IVentilatorApiV0PollValues {
  tidalVolume: string
  respiratoryRate: string
  peakInspiratoryPressure: string
  ieRatio: string
  peep: string
}

