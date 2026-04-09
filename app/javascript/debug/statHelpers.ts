export type StatLookup = { [index: string]: number }

export type StatUserData = {
  username: string,
  email: string,
  proto: string,
  mcp: string,
  cc: string,
  rc: string,
  rc_valid: string,
  verified: string,
  banned: string,
}

export function statIncrementAllOne(arrays: StatLookup[]) {
  for (const a of arrays) {
    a["all"]++
  }
}

export function statAddOne(array: StatLookup, key: string) {
  array[key] !== undefined ? array[key]++ : array[key] = 1
}

export function statAddMany(array: StatLookup, key: string, count: number) {
  array[key] !== undefined ? array[key] += count : array[key] = count
}
