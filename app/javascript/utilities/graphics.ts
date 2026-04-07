import Counter from "../engine/Counter";
import Game from "../engine/Game";
import Map from "../engine/Map"
import { Coordinate, Direction, Player, WeatherType } from "./commonTypes";
import { coordinateToLabel, DiceResult } from "./utilities";

export type SVGPathArray = (string | number)[]
export type SVGStyle = {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeLinecap?: string;
  strokeLinejoin?: string;
  strokeDasharray?: number[];
}
export type PathLayout = {
  path: string;
  style: SVGStyle;
}
export type CircleLayout = {
  x: number;
  y: number;
  r: number;
  style: SVGStyle;
}
export type TextLayout = {
  value: number | string, size: number, x: number, y: number, style: SVGStyle
}
export type TextArrayLayout = {
  value: string[], size: number, x: number, y: number[], style: SVGStyle
}
export type OverlayLayout = {
  path: string, x: number, y: number, y2: number, style: SVGStyle
}
export type BadgeLayout = {
  text: string, color: string, tColor: string, arrow?: Direction,
  x?: number, y?: number, size?: number, path?: string, dirpath?: string,
  dx?: number, dy?: number
}
export type CounterLayout = {
  name?: string, value?: number | string, x: number, y: number, size: number,
  style?: SVGStyle, tStyle?: SVGStyle, path?: string, icon?: string,
}
export type MarkerLayout = {
  path?: string, size: number, style?: SVGStyle, tStyle?: SVGStyle,
  text: { x: number, y: number, value: string }[]
}
export type StatusLayout = {
  value: string[], x: number, y: number, size: number, path: string,
  style: SVGStyle, fStyle: SVGStyle
}

export type HelpLayout = {
  path: string, style: SVGStyle, size: number, opacity: number;
  texts: { x: number, y: number, value: string }[]; tStyle: SVGStyle;
}
export type HelpButtonLayout = {
  path: string, x: number, y: number, size: number
}
export type facingLayout = {
  path: string, dash: string, style: SVGStyle, style2: SVGStyle
}

// TODO: figure out a way to keep in sync with CSS

export function colorblind(): boolean {
  if (typeof localStorage === "undefined") { return false }
  return localStorage.getItem("colorblind") === "true"
}

export function colorLookup(key: string): string {
  const rc = {
    actionOrange: "#BB0",

    counterRed: "#A0A", markerYellow: "#EE0", markerYellowText: "#BB0",
    selectColor: "#E00", targetSelectColor: "#E0E", dropSelectColor: "#E0E",
    loaderSelectColor: "#E0E", loadedSelectColor: "#E0E", lastSelectColor: "#55E",
    counterGreen: "#2F2", counterElite: "#070",

    failRed: "#E00", passBlue: "#00A", passGreen: "#A0A",
  }[key]
  return (!colorblind() || !rc) ? colorBaseLookup(key) : rc
}

export function colorBaseLookup(key: string): string {
  return {
    actionOrange: "#B80", diceColor: "#780", coordColor: "#888",

    counterRed: "#E00", markerYellow: "#FF7", markerYellowText: "#BB0",
    selectColor: "#E00", targetSelectColor: "#E70", dropSelectColor: "#999",
    loaderSelectColor: "#E70", loadedSelectColor: "#E70", lastSelectColor: "#55E",
    counterGreen: "#2F2", counterElite: "#070",

    failRed: "#A00", passBlue: "#00A", passGreen: "#070",

    calmColor: "#DDF", breezeColor: "#AAE", moderateColor: "#77B", strongColor: "#448",

    dryColor: "#DDF", fogColor: "#777", rainColor: "#44D", snowColor: "#DFDFDF",
    sandColor: "#DD8", dustColor: "#DB9",

    dryTextColor: "#99B", fogTextColor: "#999", rainTextColor: "#44D", snowTextColor: "#999",
    sandTextColor: "#AA7", dustTextColor: "#A97",
  }[key] ?? "#777"
}

export function failRedColorMarker(): string { return "===pr===" }
export function passBlueColorMarker(): string { return "===pb===" }
export function passGreenColorMarker(): string { return "===pg===" }

export function parseColorMarkers(input: string): string {
  return input
    .replace(failRedColorMarker(), failRed())
    .replace(passBlueColorMarker(), passBlue())
    .replace(passGreenColorMarker(), passGreen())
}

export function actionOrange(): string { return colorLookup("actionOrange") }
export function diceColor(): string { return colorLookup("diceColor") }
export function coordColor(): string { return colorLookup("coordColor") }

export function counterRed(): string { return colorLookup("counterRed") }
export function markerYellow(): string { return colorLookup("markerYellow") }
export function markerYellowText(): string { return colorLookup("markerYellowText") }
export function selectColor(): string { return colorLookup("selectColor") }
export function targetSelectColor(): string { return colorLookup("targetSelectColor") }
export function dropSelectColor(): string { return colorLookup("dropSelectColor") }
export function loaderSelectColor(): string { return colorLookup("loaderSelectColor") }
export function loadedSelectColor(): string { return colorLookup("loadedSelectColor") }
export function lastSelectColor(): string { return colorLookup("lastSelectColor") }
export function counterGreen(): string { return colorLookup("counterGreen") }
export function counterElite(): string { return colorLookup("counterElite") }

export function failRed(): string { return colorLookup("failRed") }
export function passBlue(): string { return colorLookup("passBlue") }
export function passGreen(): string { return colorLookup("passGreen") }

export function calmColor(): string { return colorLookup("calmColor") }
export function breezeColor(): string { return colorLookup("breezeColor") }
export function moderateColor(): string { return colorLookup("moderateColor") }
export function strongColor(): string { return colorLookup("strongColor") }

export function dryColor(): string { return colorLookup("dryColor") }
export function fogColor(): string { return colorLookup("fogColor") }
export function rainColor(): string { return colorLookup("rainColor") }
export function snowColor(): string { return colorLookup("snowColor") }
export function sandColor(): string { return colorLookup("sandColor") }
export function dustColor(): string { return colorLookup("dustColor") }

export function dryTextColor(): string { return colorLookup("dryTextColor") }
export function fogTextColor(): string { return colorLookup("fogTextColor") }
export function rainTextColor(): string { return colorLookup("rainTextColor") }
export function snowTextColor(): string { return colorLookup("snowTextColor") }
export function sandTextColor(): string { return colorLookup("sandTextColor") }
export function dustTextColor(): string { return colorLookup("dustTextColor") }

export function nationalColorLookup(key: string): string {
  if (colorblind()) return {
    ussr: "#BBF", usa: "#BBF", uk: "#BBF", fra: "#BBF", frf: "#BBF", chi: "#BBF", alm: "#BBF",
    ger: "#E0D044", ita: "#E0D044", jap: "#E0D044", fin: "#E0D044", axm: "#E0D044",
    none: "white", fort: "white",

    sa: "#BBF", can: "#BBF", aus: "#BBF", nz: "#BBF", ind: "#BBF", bra: "#BBF",
    pol: "#BBF", bel: "#BBF", dut: "#BBF", nor: "#BBF", yug: "#BBF", gre: "#BBF",
    bul: "#E0D044", hun: "#E0D044", rom: "#E0D044", slv: "#E0D044", cro: "#E0D044"
  }[key] ?? "#777"
  return {
    ussr: "#DA7", usa: "#BC7", uk: "#DC9", fra: "#BBF", frf: "#BBF", chi: "#ECF", alm: "#FA9",
    ger: "#BBB", ita: "#9DC", jap: "#E0D044", fin: "#DDD", axm: "#8CD",
    none: "white", fort: "white",

    sa: "#DC9", can: "#DC9", aus: "#DC9", nz: "#DC9", ind: "#DC9", bra: "#BC7",
    pol: "#FA9", bel: "#FA9", dut: "#FA9", nor: "#FA9", yug: "#FA9", gre: "#FA9",
    bul: "#8CD", hun: "#8CD", rom: "#8CD", slv: "#8CD", cro: "#8CD"
  }[key] ?? "#777"
}

export function nationalControlLookup(key: string): string {
  if (colorblind()) return {
    ussr: "#BBF", usa: "#BBF", uk: "#BBF", fra: "#BBF", frf: "#BBF", chi: "#BBF", alm: "#BBF",
    ger: "#E0D044", ita: "#E0D044", jap: "#E0D044", fin: "#E0D044", axm: "#E0D044",
    none: "white", fort: "white",

    sa: "#BBF", can: "#BBF", aus: "#BBF", nz: "#BBF", ind: "#BBF", bra: "#BBF",
    pol: "#BBF", bel: "#BBF", dut: "#BBF", nor: "#BBF", yug: "#BBF", gre: "#BBF",
    bul: "#E0D044", hun: "#E0D044", rom: "#E0D044", slv: "#E0D044", cro: "#E0D044"
  }[key] ?? "#777"
  return {
    ussr: "#DA7", usa: "#570", uk: "#DC9", fra: "#EEE", frf: "#FFF", chi: "#EEE", alm: "#FA9",
    ger: "#BBB", ita: "#9DC", jap: "#FFF", fin: "#BBB", axm: "#8CD",
    none: "white", fort: "white",

    sa: "#DC9", can: "#DC9", aus: "#DC9", nz: "#DC9", ind: "#DC9", bra: "#570",
    pol: "#CCC", bel: "#EEE", dut: "#EEE", nor: "#EEE", yug: "#CCC", gre: "#EEE",
    bul: "#BBB", hun: "#BBB", rom: "#BBB", slv: "#BBB", cro: "#BBB"
  }[key] ?? "#777"
}

export const clearColor = "rgba(0,0,0,0)"

export function nationalTextColor(nation: string): string {
  const base = nationalColorLookup(nation)
  const length = base.length + 1
  return `#${base.slice(1, length).split("").map(c => {
    return Math.floor(parseInt(c, 16) * 0.8).toString(16).toUpperCase()
  }).join("")}`
}

export function formatNation(game: Game, player: Player, text?: string): string {
  const name = player === 1 ? game.alliedName : game.axisName
  const nation = player === 1 ? game.playerOneNation : game.playerTwoNation
  return `<span style="color: ${nationalTextColor(nation)};">${text ?? name}</span>`
}

export function formatCoordinate(loc: Coordinate): string {
  return `<span style="color: ${coordColor()};font-family: 'Courier Prime', monospace;">${coordinateToLabel(loc)}</span>`
}

export function formatTarget(target: number): string {
  return `<span style="color: ${coordColor()};font-family: 'Courier Prime', monospace;">${target}</span>`
}

export function formatDieResult(roll: DiceResult): string {
  if (roll.type === "d6") {
    return `<span style="color: ${diceColor()};font-family: 'Courier Prime', monospace;">${roll.result}</span> ` +
      `[<span style="color: ${diceColor()};">d6</span>]`
  } else if (roll.type === "d10") {
    return `<span style="color: ${diceColor()};font-family: 'Courier Prime', monospace;">${roll.result}</span> ` +
      `[<span style="color: ${diceColor()};">d10</span>]`
  } else if (roll.type === "2d10") {
    return `<span style="color: ${diceColor()};font-family: 'Courier Prime', monospace;">${roll.result}</span> ` +
      `[<span style="color: ${diceColor()};">2d10</span>: ` +
      `<span style="color: ${diceColor()};font-family: 'Courier Prime', monospace;">${roll.components[0]}</span> + ` +
      `<span style="color: ${diceColor()};font-family: 'Courier Prime', monospace;">${roll.components[1]}</span>]`
  } else if (roll.type === "d10x10") {
    return `<span style="color: ${diceColor()};font-family: 'Courier Prime', monospace;">${roll.result}</span> ` +
      `[<span style="color: ${diceColor()};">d10x10</span>: ` +
      `<span style="color: ${diceColor()};font-family: 'Courier Prime', monospace;">${roll.components[0]}</span> x ` +
      `<span style="color: ${diceColor()};font-family: 'Courier Prime', monospace;">${roll.components[1]}</span>]`
  } else if (roll.type === "CC") {
    return `<span style="color: ${diceColor()};font-family: 'Courier Prime', monospace;">${roll.result}</span> ` +
      `[<span style="color: ${diceColor()};">CC</span>: (2 x ` +
      `<span style="color: ${diceColor()};font-family: 'Courier Prime', monospace;">${roll.components[0]}</span> + ` +
      `<span style="color: ${diceColor()};font-family: 'Courier Prime', monospace;">${roll.components[1]}</span>) x ` +
      `<span style="color: ${diceColor()};font-family: 'Courier Prime', monospace;">${roll.components[2]}</span>]`
  }
  return ""
}

export function weatherDescription(weather: WeatherType): string {
  const lookup = {
    "dry": `<span style="color: ${dryTextColor()};">clear</span>`,
    "fog": `<span style="color: ${fogTextColor()};">foggy</span>`,
    "rain": `<span style="color: ${rainTextColor()};">raining</span>`,
    "snow": `<span style="color: ${snowTextColor()};">snowing</span>`,
    "sand": `<span style="color: ${sandTextColor()};">blowing sand</span>`,
    "dust": `<span style="color: ${dustTextColor()};">blowing dust</span>`,
  }

  return lookup[weather] ?? "unknown"
}

export function deHTML(text: string): string {
  return text.replace(/(<([^>]+)>)/ig,"")
}

export function xCorner(map: Map, x: number, i: number): number {
  return x - map.radius * Math.cos((i-0.5)/3 * Math.PI)
}

export function yCorner(map: Map, y: number, i: number): number {
  return y - map.radius * Math.sin((i-0.5)/3 * Math.PI)
}

export function baseHexCoords(map: Map, x: number, y: number): string {
  return [0, 1, 2, 3, 4, 5, 6].map(i => {
    return `${xCorner(map, x, i)},${yCorner(map, y, i)}`
  }).join(" ")
}

export function baseCounterPath(x: number, y: number): string {
  const corner = 4
  return [
    "M", x+corner, y,
    "L", x+80-corner, y, "A", corner, corner, 0, 0, 1, x+80, y+corner,
    "L", x+80, y+80-corner, "A", corner, corner, 0, 0, 1, x+80-corner, y+80,
    "L", x+corner, y+80, "A", corner, corner, 0, 0, 1, x, y+80-corner,
    "L", x, y+corner, "A", corner, corner, 0, 0, 1, x+corner, y,
  ].join(" ")
}

export function roundedRectangle(
  x: number, y: number, width: number, height: number, corner: number = 10
): string {
  return [
    "M", x+corner, y,
    "L", x+width-corner, y, "A", corner, corner, 0, 0, 1, x+width, y+corner,
    "L", x+width, y+height-corner, "A", corner, corner, 0, 0, 1, x+width-corner, y+height,
    "L", x+corner, y+height, "A", corner, corner, 0, 0, 1, x, y+height-corner,
    "L", x, y+corner, "A", corner, corner, 0, 0, 1, x+corner, y, "z"
  ].join(" ")
}

export function roundedRectangleHole(
  x: number, y: number, width: number, height: number,
  x2: number, y2: number, width2: number, height2: number,
  corner: number = 10
): string {
  return [
    "M", x+corner, y,
    "L", x+width-corner, y, "A", corner, corner, 0, 0, 1, x+width, y+corner,
    "L", x+width, y+height-corner, "A", corner, corner, 0, 0, 1, x+width-corner, y+height,
    "L", x+corner, y+height, "A", corner, corner, 0, 0, 1, x, y+height-corner,
    "L", x, y+corner, "A", corner, corner, 0, 0, 1, x+corner, y, "z",
    "M", x2+width2-corner, y2,
    "L", x2+corner, y2, "A", corner, corner, 0, 0, 0, x2, y2+corner,
    "L", x2, y2+height2-corner, "A", corner, corner, 0, 0, 0, x2+corner, y2+height2,
    "L", x2+width2-corner, y2+height2, "A", corner, corner, 0, 0, 0, x2+width2, y2+height2-corner,
    "L", x2+width2, y2+corner, "A", corner, corner, 0, 0, 0, x2+width2-corner, y2, "z"
  ].join(" ")
}

export function circlePath(loc: Coordinate, r: number): string {
  return [
    "M", loc.x, loc.y-r, "A", r, r, 0, 0, 1, loc.x, loc.y+r,
    "A", r, r, 0, 0, 1, loc.x, loc.y-r].join(" ")
}

export function squarePath(loc: Coordinate): string {
  return [
    "M", loc.x-10, loc.y-10, "L", loc.x+10, loc.y-10, "L", loc.x+10, loc.y+10,
    "L", loc.x-10, loc.y+10, "L", loc.x-10, loc.y-10].join(" ")
}

export function hexPath(loc: Coordinate, r: number, rotated: boolean): string {
  let a = (rotated ? -0.5 : -1)/3 * Math.PI
  let path = ["M", loc.x + r * Math.cos(a), loc.y + r * Math.sin(a)]
  for (let i = 0; i < 6; i++) {
    a = (i + (rotated ? 0.5 : 0))/3 * Math.PI
    path = path.concat(["L", loc.x + r * Math.cos(a), loc.y + r * Math.sin(a)])
  }
  return path.join(" ")
}

export function counterOutline(counter: Counter, width: number, outline: number): string {
  const x = counter.x
  const y = counter.y
  const xWidth = width * 88 - 8
  const corner = 4 + outline
  return [
    "M", x+xWidth-corner+outline, y-outline,
    "A", corner, corner, 0, 0, 1, x+xWidth+outline, y+corner-outline,
    "L", x+xWidth+outline, y+80-corner+outline,
    "A", corner, corner, 0, 0, 1, x+xWidth-corner+outline, y+80+outline,
    "L", x+corner-outline, y+80+outline,
    "A", corner, corner, 0, 0, 1, x-outline, y+80-corner+outline,
    "L", x-outline, y+corner-outline,
    "A", corner, corner, 0, 0, 1, x+corner-outline, y-outline,
    "L", x+xWidth-corner+outline, y-outline,
  ].join(" ")
}

export function starPath(loc: Coordinate, r: number): string {
  const path: (string | number)[] = []
  for (let i = 0; i < 5; i++) {
    path.push(i === 0 ? "M" : "L")
    path.push(Math.sin(i * 72 / 180 * Math.PI) * r + loc.x)
    path.push(-Math.cos(i * 72 / 180 * Math.PI) * r + loc.y)
    path.push("L")
    path.push(Math.sin((i * 72 + 36) / 180 * Math.PI) * r*0.382 + loc.x)
    path.push(-Math.cos((i * 72 + 36) / 180 * Math.PI) * r*0.382 + loc.y)
  }
  path.push("z")
  return path.join(" ")
}

export const yMapOffset = 160
