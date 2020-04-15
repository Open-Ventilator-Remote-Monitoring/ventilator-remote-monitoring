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
  hostname: string
}

export interface IVentilatorPollValues {
  tidalVolume: number
  respiratoryRate: number
  peakInspiratoryPressure: number
  // todo: Technically, this is the denominator of the ratio
  // The numerator is assumed to be 1. However, I think ratios
  // can exceed one. Suggest we collect both numerator and denominator
  ieRatio: number
  peep: number
}

export interface IVentilatorApiCallResponse {
  // todo: why is this an array? Can it ever have more than one value?
  ventilator: IVentilatorPollValues[]
}

export interface IVentilatorPollResult {
  connected: boolean
  result?: IVentilatorPollValues
}

