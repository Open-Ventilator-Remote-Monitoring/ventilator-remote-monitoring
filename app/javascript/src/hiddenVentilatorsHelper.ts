import { ICluster } from './types'
import { makeSetFromAry, setIntersect } from './utils'

export class HiddenVentilatorsHelper {
  _cluster: ICluster
  _key: string

  constructor(cluster: ICluster) {
    this._cluster = cluster
    this._key = `HiddenVentilators-${cluster.organization.id}-${cluster.id}`
  }

  /** Get the JSON-encoded list of hidden ventilators for the given cluster
   * from local storage and convert it to a Set and returns the set. Unless `clean`
   * has been called, numbers in the set could include IDs of ventilators that no longer
   * exist in the cluster.
   *
   * If the set is missing or corrupted, returns an empty set.
   */
  readHiddenSet = (): Set<number> => {
    var hiddenVentilatorIdsStr = localStorage.getItem(this._key)

    // parse the JSON-encoded array. If parse fails, we'll just use the empty list above
    let hiddenVentilatorIds = []
    if (hiddenVentilatorIdsStr) {
      try {
        hiddenVentilatorIds = JSON.parse(hiddenVentilatorIdsStr)
      } catch(ex) {
      }
    }

    // check to ensure all array members are numbers. If not, use an empty list
    let isAllNumbers = hiddenVentilatorIds.every((v) => typeof v === "number")
    if (! isAllNumbers) {
      hiddenVentilatorIds = []
    }

    let set: Set<number> = makeSetFromAry(hiddenVentilatorIds)

    return set
  }

  /** Update localstorage with the given set. Ids in the set are not validated against ids
   * within the current cluster.
  */
  persistHiddenSet = (set: Set<number>) => {
    let ary = [...set.values()]
    let json = JSON.stringify(ary)
    localStorage.setItem(this._key, json)
  }

  /** Get the JSON-encoded list of hidden ventilators for the given organization/cluster
   * from local storage and converts it to a Set. Removes any ventilator IDs that are no
   * longer in the cluster. Persist it to local storage. Returns the set.
   *
   * If the set is missing or corrupted, returns an empty set.
   */
  readCleanHiddenSet = (): Set<number> => {
    let set = this.readHiddenSet()

    let allVentIds: Set<number> = makeSetFromAry(this._cluster.ventilators.map(v => v.id))

    set = setIntersect(set, allVentIds)

    this.persistHiddenSet(set)

    return set
  }
}

