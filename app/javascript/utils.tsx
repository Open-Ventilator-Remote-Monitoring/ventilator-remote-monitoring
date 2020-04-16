
// sort an array if objects by one of the members which must be a string

export function sortObjects(ary: {}[], key: string) {

  // instead of converting every key to upper case for every compare
  // we just do it once by making an object where the key is the original
  // value for key, and the value is the upperCase value for key
  // (obviously this assume it is cheaper to do the object lookup than
  // to convert every letter to uppercase)

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