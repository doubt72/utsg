import Map from "../engine/Map"
import { Direction } from "./commonTypes";

export type SVGPathArray = (string | number)[]
export type SVGStyle = {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeLinecap?: string;
  strokeLinejoin?: string;
  strokeDasharray?: [number, number];
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
  path: string, style: SVGStyle, size: number,
  texts?: { x: number, y: number, value: string }[]
}
export type HelpButtonLayout = {
  path: string, x: number, y: number, size: number
}
export type facingLayout = {
  path: string, dash: string, style: SVGStyle, style2: SVGStyle
}

export const counterRed = "#E00"
export const markerYellow = "#EE0"

// TODO: figure out a way to keep in sync with CSS
export const nationalColors: { [index: string]: string } = {
  ussr: "#DA7", usa: "#BC7", uk: "#DC9", fra: "#AAF", chi: "#CCF", alm: "#EA9",
  ger: "#BBB", ita: "#9DC", jap: "#ED4", fin: "#CCC", axm: "#7CB",
  none: "white", fort: "white"
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

export function roundedRectangle(x: number, y: number, width: number, height: number): string {
  const corner = 10
  return [
    "M", x+corner, y,
    "L", x+width-corner, y, "A", corner, corner, 0, 0, 1, x+width, y+corner,
    "L", x+width, y+height-corner, "A", corner, corner, 0, 0, 1, x+width-corner, y+height,
    "L", x+corner, y+height, "A", corner, corner, 0, 0, 1, x, y+height-corner,
    "L", x, y+corner, "A", corner, corner, 0, 0, 1, x+corner, y,
  ].join(" ")
}

