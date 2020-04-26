
// sort an array if objects by one of the members which must be a string

export const sortObjects = (ary: {}[], key: string): void => {
  // Instead of converting every key to upper case for every compare,
  // we just do it once by making an object where the key is the original
  // value for key, and the value is the upperCase value for key
  // (obviously this assumes it is cheaper to do the object lookup than
  // to convert every letter to uppercase - TBD)

  let cased = {}
  ary.forEach(obj => {
    let value : string = obj[key]
    cased[value] = value.toUpperCase()
  })

  let compare = (objA: {}, objB: {}) => {
    var a = cased[objA[key]]
    var b = cased[objB[key]]
    return (a < b) ? -1 : (a > b) ? 1 : 0
  }

  ary.sort(compare)
}

export const generateRandomValueBetween = (lower: number, upper: number) : number => {
  return Math.round(Math.random()*(upper-lower)+lower)
}

export const clamp = (num: number, min: number, max: number) : number => {
  return Math.min(Math.max(num, min), max)
}

export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const hasAlerts = (obj: {}): boolean => {
  if (! obj) {
    return false
  }
  return Object.keys(obj).some((k) => obj[k] === true)
}

export const getFirstAlert = (obj: {}): string => {
  if (! obj) {
    return null
  }
  return Object.keys(obj).find((k) => obj[k] === true)
}

export const camelCaseToWords = (cc: string) => {
  if (! cc) {
    return ''
  }
  let result = cc.replace( /([A-Z])/g, " $1" )
  result = result.charAt(0).toUpperCase() + result.slice(1)
}

export const makeSetFromAry = <T>(ary: Array<T>): Set<T> => {
  let set: Set<T> = new Set()
  ary.forEach((v) => set.add(v))
  return set
}

export const makeSetFromObjMember = <O, T>(ary: O[], fn: (O) => T): Set<T> => {
  let set: Set<T> = new Set()
  ary.forEach((v) => {
    let tmp: T = fn(v)
    set.add(tmp)
  })
  return set
}

export const setIntersect = <T>(setA: Set<T>, setB: Set<T>): Set<T> => {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set

  let result: Set<T> = new Set()
    for (let elem of setB) {
        if (setA.has(elem)) {
            result.add(elem)
        }
    }
    return result
}

