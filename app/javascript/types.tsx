
// todo: consider splitting into 2
// One for data from DB
// One for data from monitor device
export interface IVentilator {
  // from database
  id?: number
  name?: string
  hostname?: string
  created_at?: string
  updated_at?: string

  // from device
  connected?: boolean
  tidalVolume?: number
  respiratoryRate?: number
  peakInspiratoryPressure?: number
  ieRatio?: string
  peep?: number
}