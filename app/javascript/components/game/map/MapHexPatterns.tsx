import React from "react";
import { nationalControlBackgrounds } from "../../../utilities/graphics";

export default function MapHexPatterns() {
  const clear = "rgba(0,0,0,0)"
  const darkStyle = { fill: "rgba(0,0,0,0.16)" }
  const darkerStyle = { fill: "rgba(0,0,0,0.33)" }
  const forestStyle = { fill: "#070" }
  const brushStyle = { stroke: "#7B7", fill: clear, strokeWidth: 0.2 }
  const jungleStyle = { fill: clear, stroke: "#282", strokeWidth: 0.16 }
  const marshStyle = { fill: clear, stroke: "#77C", strokeWidth: 0.33 }
  const frozenMarshStyle = { fill: clear, stroke: "#DDE", strokeWidth: 0.33 }
  const darkStrokeStyle = { fill: clear, stroke: "rgba(0,0,0,0.33)", strokewidth: 0.33 }

  const triangle = (cx: number, cy: number) => {
    let path: (number | string)[] = []
    let letter = "M"
    const size = 3
    for (let i = 0; i < 4; i++) {
      path = path.concat([
        letter, cx + size * Math.sin(2*i/3 * Math.PI), cy - size * Math.cos(2*i/3 * Math.PI)
      ])
      letter = "L"
    }
    return path.join(" ")
  }

  // const nationalPattern = (nation: string, size: number) => {
  //   return (
  //     <pattern id={`nation-${nation}-${size}`} x="0" y="0" patternUnits="objectBoundingBox"
  //              width={size*2} height={size*2}>
  //       <rect width={size*2} height={size*2} style={{ fill: nationalColors[nation] }}/>
  //       <image x="0" y="0" height={size*2} width={size*2} xlinkHref={`/assets/units/${nation}.svg`}/>
  //     </pattern>
  //   )
  // }

  const nationalControlPattern = (nation: string, size: number) => {
    return (
      <pattern id={`nation-${nation}-${size}`} x="0" y="0" patternUnits="objectBoundingBox"
               width={size*2} height={size*2}>
        <rect width={size*2} height={size*2} style={{ fill: nationalControlBackgrounds[nation] }}/>
        <image x="0" y="0" height={size*2} width={size*2} xlinkHref={`/assets/units/${nation}.svg`}/>
      </pattern>
    )
  }

  return (
    <defs>
      <pattern id="forest-pattern" x="0" y="0" patternUnits="userSpaceOnUse"
               width="12" height="20.8" viewBox="0 0 2 3.46">
        <circle cx="0" cy="-0.866" r="0.9" style={forestStyle} />
        <circle cx="2" cy="-0.866" r="0.9" style={forestStyle} />
        <circle cx="1" cy="0.866" r="0.9" style={forestStyle} />
        <circle cx="0" cy="2.598" r="0.9" style={forestStyle} />
        <circle cx="2" cy="2.598" r="0.9" style={forestStyle} />
        <circle cx="1" cy="4.330" r="0.9" style={forestStyle} />
      </pattern>
      <pattern id="brush-pattern" x="0" y="0" patternUnits="userSpaceOnUse"
               width="10" height="17.3" viewBox="0 0 2 3.46">
        <circle cx="0" cy="-0.866" r="0.75" style={brushStyle} />
        <circle cx="2" cy="-0.866" r="0.75" style={brushStyle} />
        <circle cx="1" cy="0.866" r="0.75" style={brushStyle} />
        <circle cx="0" cy="2.598" r="0.75" style={brushStyle} />
        <circle cx="2" cy="2.598" r="0.75" style={brushStyle} />
        <circle cx="1" cy="4.330" r="0.75" style={brushStyle} />
      </pattern>
      <pattern id="jungle-pattern" x="0" y="0" patternUnits="userSpaceOnUse"
               width="13.3" height="23.1" viewBox="0 0 2 3.46">
        <circle cx="0" cy="-0.866" r="0.75" style={jungleStyle} />
        <circle cx="2" cy="-0.866" r="0.75" style={jungleStyle} />
        <circle cx="1" cy="0.866" r="0.75" style={jungleStyle} />
        <circle cx="0" cy="2.598" r="0.75" style={jungleStyle} />
        <circle cx="2" cy="2.598" r="0.75" style={jungleStyle} />
        <circle cx="1" cy="4.330" r="0.75" style={jungleStyle} />
        <circle cx="0" cy="0.3" r="1" style={jungleStyle} />
        <circle cx="2" cy="0.3" r="1" style={jungleStyle} />
        <circle cx="1" cy="2.032" r="1" style={jungleStyle} />
        <circle cx="0" cy="3.764" r="1" style={jungleStyle} />
        <circle cx="2" cy="3.764" r="1" style={jungleStyle} />
      </pattern>
      <pattern id="sand-pattern" x="0" y="0" patternUnits="userSpaceOnUse"
               width="20" height="20" viewBox="0 0 16 16">
        <rect width="16" height="16" opacity="0.7" style={{ fill: "#DD8" }}/>
        <circle cx="1" cy="1" r="0.8" style={darkStyle} />
        <circle cx="4" cy="1" r="0.8" style={darkStyle} />
        <circle cx="7" cy="1" r="0.8" style={darkStyle} />
        <circle cx="9" cy="9" r="0.8" style={darkStyle} />
        <circle cx="12" cy="9" r="0.8" style={darkStyle} />
        <circle cx="15" cy="9" r="0.8" style={darkStyle} />
      </pattern>
      <pattern id="rough-pattern" x="0" y="0" patternUnits="userSpaceOnUse"
               width="24" height="24" viewBox="0 0 16 16">
        <path d={triangle(3, 3)} style={darkerStyle} />
        <path d={triangle(8, 3)} style={darkerStyle} />
        <path d={triangle(0, 11)} style={darkerStyle} />
        <path d={triangle(11, 11)} style={darkerStyle} />
        <path d={triangle(16, 11)} style={darkerStyle} />
      </pattern>
      <pattern id="marsh-pattern" x="0" y="0" patternUnits="userSpaceOnUse"
               width="24" height="24" viewBox="0 0 10 10">
        <rect width="10" height="10" opacity="0.5" style={{ fill: "#DFF" }}/>
        <path d="M 1 9 L 5 9 M 3 9 L 1.5 7.5 M 3 9 L 4.5 7.5 M 3 9 L 3 7" style={marshStyle} />
        <path d="M 5 4 L 9 4 M 7 4 L 5.5 2.5 M 7 4 L 8.5 2.5 M 7 4 L 7 2" style={marshStyle} />
      </pattern>
      <pattern id="frozen-marsh-pattern" x="0" y="0" patternUnits="userSpaceOnUse"
               width="24" height="24" viewBox="0 0 10 10">
        <rect width="10" height="10" opacity="0.5" style={{ fill: "#EFF" }}/>
        <path d="M 1 9 L 5 9 M 3 9 L 1.5 7.5 M 3 9 L 4.5 7.5 M 3 9 L 3 7" style={frozenMarshStyle} />
        <path d="M 5 4 L 9 4 M 7 4 L 5.5 2.5 M 7 4 L 8.5 2.5 M 7 4 L 7 2" style={frozenMarshStyle} />
      </pattern>
      <pattern id="grain-pattern" x="0" y="0" patternUnits="userSpaceOnUse"
               width="5.5" height="9.9" viewBox="0 0 10 18">
        <rect width="10" height="18" opacity="0.7" style={{ fill: "#FFA" }}/>
        <g id="grain-component">
          <path d="M0 0l5 3v5l-5 -3z" style={darkStyle} />
          <path d="M10 0l-5 3v5l5 -3" style={darkStyle} />
        </g>
        <use x="0" y="9" xlinkHref="#grain-component"></use>
      </pattern>
      <pattern id="soft-pattern" x="0" y="0" patternUnits="userSpaceOnUse"
               width="36" height="36" viewBox="0 0 16 16">
        <circle cx="1" cy="1" r="1" style={darkStyle} />
        <circle cx="4" cy="1" r="1" style={darkStyle} />
        <circle cx="9" cy="9" r="1" style={darkStyle} />
        <circle cx="12" cy="9" r="1" style={darkStyle} />
      </pattern>
      <pattern id="debris-pattern" x="0" y="0" patternUnits="userSpaceOnUse"
               width="40" height="40" viewBox="0 0 18 18">
        <path d={
            `M ${
              5 + 5 * Math.sin(15 * Math.PI / 180)} ${5 + 5 * Math.cos(15 * Math.PI / 180)
            } L ${
              5 - 5 * Math.sin(15 * Math.PI / 180)} ${5 - 5 * Math.cos(15 * Math.PI / 180)
            } M ${
              5 + 5 * Math.sin(75 * Math.PI / 180)} ${5 + 5 * Math.cos(75 * Math.PI / 180)
            } L ${
              5 - 5 * Math.sin(75 * Math.PI / 180)} ${5 - 5 * Math.cos(75 * Math.PI / 180)
            } M ${
              5 + 5 * Math.sin(135 * Math.PI / 180)} ${5 + 5 * Math.cos(135 * Math.PI / 180)
            } L ${
              5 - 5 * Math.sin(135 * Math.PI / 180)} ${5 - 5 * Math.cos(135 * Math.PI / 180)
            }`
          } style={darkStrokeStyle} />
        <path d={
            `M ${
              13 + 5 * Math.sin(15 * Math.PI / 180)} ${13 + 5 * Math.cos(15 * Math.PI / 180)
            } L ${
              13 - 5 * Math.sin(15 * Math.PI / 180)} ${13 - 5 * Math.cos(15 * Math.PI / 180)
            } M ${
              13 + 5 * Math.sin(75 * Math.PI / 180)} ${13 + 5 * Math.cos(75 * Math.PI / 180)
            } L ${
              13 - 5 * Math.sin(75 * Math.PI / 180)} ${13 - 5 * Math.cos(75 * Math.PI / 180)
            } M ${
              13 + 5 * Math.sin(135 * Math.PI / 180)} ${13 + 5 * Math.cos(135 * Math.PI / 180)
            } L ${
              13 - 5 * Math.sin(135 * Math.PI / 180)} ${13 - 5 * Math.cos(135 * Math.PI / 180)
            }`
          } style={darkStrokeStyle} />
      </pattern>

      {nationalControlPattern("ger", 12)}
      {nationalControlPattern("ita", 12)}
      {nationalControlPattern("jap", 12)}
      {nationalControlPattern("fin", 12)}
      {nationalControlPattern("uk", 12)}
      {nationalControlPattern("usa", 12)}
      {nationalControlPattern("ussr", 12)}
      {nationalControlPattern("chi", 12)}
      {nationalControlPattern("fra", 12)}
      {nationalControlPattern("frf", 12)}

      {nationalControlPattern("sa", 12)}
      {nationalControlPattern("can", 12)}
      {nationalControlPattern("aus", 12)}
      {nationalControlPattern("nz", 12)}
      {nationalControlPattern("ind", 12)}
      {nationalControlPattern("bra", 12)}
      {nationalControlPattern("pol", 12)}
      {nationalControlPattern("bel", 12)}
      {nationalControlPattern("dut", 12)}
      {nationalControlPattern("nor", 12)}
      {nationalControlPattern("yug", 12)}
      {nationalControlPattern("gre", 12)}
      {nationalControlPattern("bul", 12)}
      {nationalControlPattern("hun", 12)}
      {nationalControlPattern("rom", 12)}
      {nationalControlPattern("slv", 12)}
      {nationalControlPattern("cro", 12)}

      {nationalControlPattern("ger", 16)}
      {nationalControlPattern("ita", 16)}
      {nationalControlPattern("jap", 16)}
      {nationalControlPattern("fin", 16)}
      {nationalControlPattern("uk", 16)}
      {nationalControlPattern("usa", 16)}
      {nationalControlPattern("ussr", 16)}
      {nationalControlPattern("chi", 16)}
      {nationalControlPattern("fra", 16)}
      {nationalControlPattern("frf", 16)}

      {nationalControlPattern("sa", 16)}
      {nationalControlPattern("can", 16)}
      {nationalControlPattern("aus", 16)}
      {nationalControlPattern("nz", 16)}
      {nationalControlPattern("ind", 16)}
      {nationalControlPattern("bra", 16)}
      {nationalControlPattern("pol", 16)}
      {nationalControlPattern("bel", 16)}
      {nationalControlPattern("dut", 16)}
      {nationalControlPattern("nor", 16)}
      {nationalControlPattern("yug", 16)}
      {nationalControlPattern("gre", 16)}
      {nationalControlPattern("bul", 16)}
      {nationalControlPattern("hun", 16)}
      {nationalControlPattern("rom", 16)}
      {nationalControlPattern("slv", 16)}
      {nationalControlPattern("cro", 16)}
    </defs>
  )
}