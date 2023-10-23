import React from "react";

export default function MapHexPatterns() {
  const dark = "rgba(0,0,0,0.16)"
  const forestGreen = "#070"
  const jungleGreen = "#292"
  const brushGreen = "#7B7"
  const marshBlue = "#229"
  const clear = "rgba(0,0,0,0)"

  return (
    <defs>
      <pattern id="forest-pattern" x="0" y="0" patternUnits="userSpaceOnUse"
               width="10" height="10" viewBox="0 0 4 4">
        <circle cx="2" cy="2" r="1.9" style={{fill: forestGreen}} />
      </pattern>
      <pattern id="brush-pattern" x="0" y="0" patternUnits="userSpaceOnUse"
               width="8" height="8" viewBox="0 0 8 8">
        <circle cx="4" cy="4" r="3" style={{stroke: brushGreen, fill: clear}} />
      </pattern>
      <pattern id="jungle-pattern" x="0" y="0" patternUnits="userSpaceOnUse"
               width="10" height="10" viewBox="0 0 4 4">
        <path d="M 4.0 2.0 L 3.38 2.57 L 3.41 3.41 L 2.57 3.38 L 2.0 4.0 L 1.42 3.38 L 0.58 3.41 L 0.61 2.57 L 0.0 2.0 L 0.61 1.42 L 0.58 0.58 L 1.42 0.61 L 1.99 0.0 L 2.57 0.61 L 3.41 0.58 L 3.38 1.42 L 4.0 1.99 L 3.38 2.57"
              style={{fill: jungleGreen}} />
      </pattern>
      <pattern id="sand-pattern" x="0" y="0" patternUnits="userSpaceOnUse"
               width="20" height="20" viewBox="0 0 16 16">
        <circle cx="1" cy="1" r="0.8" style={{fill: dark}} />
        <circle cx="4" cy="1" r="0.8" style={{fill: dark}} />
        <circle cx="7" cy="1" r="0.8" style={{fill: dark}} />
        <circle cx="9" cy="9" r="0.8" style={{fill: dark}} />
        <circle cx="12" cy="9" r="0.8" style={{fill: dark}} />
        <circle cx="15" cy="9" r="0.8" style={{fill: dark}} />
      </pattern>
      <pattern id="marsh-pattern" x="0" y="0" patternUnits="userSpaceOnUse"
               width="24" height="24" viewBox="0 0 12 12">
        <path d="M 1 11 L 5 11 M 3 11 L 1.5 9.5 M 3 11 L 4.5 9.5 M 3 11 L 3 9"
              style={{ fill: clear, stroke: marshBlue, strokeWidth: 0.33 }} />
        <path d="M 7 5 L 11 5 M 9 5 L 7.5 3.5 M 9 5 L 10.5 3.5 M 9 5 L 9 3"
              style={{ fill: clear, stroke: marshBlue, strokeWidth: 0.33 }} />
      </pattern>
      <pattern id="grain-pattern" x="0" y="0" patternUnits="userSpaceOnUse"
               width="5" height="9" viewBox="0 0 10 18">
        <g id="grain-component">
          <path d="M0 0l5 3v5l-5 -3z" style={{fill: dark }} />
          <path d="M10 0l-5 3v5l5 -3" style={{fill: dark }} />
        </g>
        <use x="0" y="9" xlinkHref="#grain-component"></use>
      </pattern>
    </defs>
  )
}