
/**
 * Sort an array of objects using the value at [key] in each object.
 * When numners are encountered within the string (such as Room10 and Room2),
 * sort by the number value of the numbers (so Room2 comes before Room10).
 * @param ary The array to sort
 * @param key The name of a key within the object to sort on
 */
export const sortObjects = (ary: {}[], key: string): void => {
  var collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base', ignorePunctuation: true});

  let compare = (objA: {}, objB: {}) => {
    var a = objA[key]
    var b = objB[key]
    return collator.compare(a, b)
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

/** Find a number of rows and columns that will contain count items,
   * ideally within the limits of width and height. It is OK to exceed
   * height, but not width.
   * */
export const getLayout = (count: number, width: number, height: number, itemWidth: number): {rows: number, cols: number}=> {
  console.log(`getLayout called with width: ${width} height: ${height} count: ${count}`)

  let rows, cols  = 0

  if (! count || ! width || ! height) {
    console.log('count or width or height is zero, returning [0, 0]')
    return {rows, cols}
  }

  cols = Math.floor(width / itemWidth) || 1

  rows = count % cols === 0
      ? count / cols
      : Math.floor(count / cols) + 1

  // We compute columns again. Consider this: We have 48 items
  // and width allows for 9 columns. This will result in rows = 6 (Math.floor(48/9) + 1)
  // Yet with rows of 6, we only need 8 columns.
  cols = count % rows === 0 ? count / rows : Math.floor(count / rows) + 1

  console.log(`cols is ${cols} and rows is ${rows}`)

  console.assert(rows * cols >= count, "Not enought rows and columns to hold all of the monitors")

  return {rows, cols}
}


