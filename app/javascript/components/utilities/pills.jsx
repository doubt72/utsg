import React from "react";
import { alliedCodeToName, axisCodeToName } from "../../engine/utilities"

const alliedCodeToPill = (code) => {
  const name = alliedCodeToName(code)
  const className = `nation-${code} nation-pill`

  return <span key={code} className={className}>{name}</span>
}

const axisCodeToPill = (code) => {
  const name = axisCodeToName(code)
  const className = `nation-${code} nation-pill`

  return <span key={code} className={className}>{name}</span>
}

export { alliedCodeToPill, axisCodeToPill }