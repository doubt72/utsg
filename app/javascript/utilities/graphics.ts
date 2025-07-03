import Counter from "../engine/Counter";
import Map from "../engine/Map"
import { Coordinate, Direction } from "./commonTypes";

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

export const counterRed = "#E00"
export const markerYellow = "#EE0"
export const selectColor = "#E00"
export const dropSelectColor = "#999"
export const loaderSelectColor = "#EE0"
export const loadedSelectColor = "#EE0"
export const lastSelectColor = "#55E"
export const counterGreen = "#2F2"
export const counterElite = "#070"

// TODO: figure out a way to keep in sync with CSS
export const nationalColors: { [index: string]: string } = {
  ussr: "#DA7", usa: "#BC7", uk: "#DC9", fra: "#BBF", frf: "#BBF", chi: "#ECF", alm: "#FA9",
  ger: "#BBB", ita: "#9DC", jap: "#E0D044", fin: "#DDD", axm: "#8CD",
  none: "white", fort: "white",

  sa: "#DC9", can: "#DC9", aus: "#DC9", nz: "#DC9", ind: "#DC9", bra: "#BC7",
  pol: "#FA9", bel: "#FA9", dut: "#FA9", nor: "#FA9", yug: "#FA9", gre: "#FA9",
  bul: "#8CD", hun: "#8CD", rom: "#8CD", slv: "#8CD", cro: "#8CD"
}
export const nationalControlBackgrounds: { [index: string]: string } = {
  ussr: "#DA7", usa: "#570", uk: "#DC9", fra: "#EEE", frf: "#FFF", chi: "#EEE", alm: "#FA9",
  ger: "#BBB", ita: "#9DC", jap: "#FFF", fin: "#BBB", axm: "#8CD",
  none: "white", fort: "white",

  sa: "#DC9", can: "#DC9", aus: "#DC9", nz: "#DC9", ind: "#DC9", bra: "#570",
  pol: "#CCC", bel: "#EEE", dut: "#EEE", nor: "#EEE", yug: "#CCC", gre: "#EEE",
  bul: "#BBB", hun: "#BBB", rom: "#BBB", slv: "#BBB", cro: "#BBB"
}
export const clearColor = "rgba(0,0,0,0)"

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
