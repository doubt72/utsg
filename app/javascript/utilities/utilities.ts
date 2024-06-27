import { Direction } from "./commonTypes"

export function alliedCodeToName(code: string): string {
  const lookup = [
    { name: "Soviet", code: "ussr" },
    { name: "American", code: "usa" },
    { name: "British", code: "uk" },
    { name: "French", code: "fra" },
    { name: "Allied", code: "alm" },
  ]

  for (const rec of lookup) {
    if (rec.code === code) {
      return rec.name
    }
  }

  return "Unknown"
}

export function axisCodeToName(code: string): string {
  const lookup = [
    { name: "German", code: "ger" },
    { name: "Italian", code: "ita" },
    { name: "Japanese", code: "jap" },
    { name: "Finnish", code: "fin" },
    { name: "Axis", code: "axm" },
  ]

  for (const rec of lookup) {
    if (rec.code === code) {
      return rec.name
    }
  }

  return "Unknown"
}

export function getFormattedDate(date: Date): string {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"    
  ]
  
  return `${months[date.getMonth() - 1]} ${date.getDate()}, ${date.getFullYear()}`
}

export function normalDir(dir: number): Direction {
  if (dir > 6) { return dir - 6 as Direction }
  if (dir < 1) { return dir + 6 as Direction }
  return dir as Direction
}
