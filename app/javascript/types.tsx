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
  ieRatio: string
  peep: number
}

export interface IVentilatorPollResult {
  connected: boolean
  result?: IVentilatorPollValues
}