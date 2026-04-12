import React from "react";
import { camoHexData, camoOutlineData } from "./camoData";

export default function CamoPatternSnow() {
  return (
    <pattern id="camo-snow-bg" width="692.84" height="400.0" patternUnits="userSpaceOnUse" >
      <rect x="0" y="0" width="692.84" height="400.0" fill="#000" />
        { camoHexData.map((d,i) => <polygon key={i} className={`camo-snow${d[0]}`} points={d[1]} />) }
        { camoOutlineData.map((d,i) => <polygon key={i} className={`camo-snow-line${d[0]}`} points={d[1]} />) }
      </pattern>
  )
}