import React from "react";
import { alliedCodeToName, axisCodeToName } from "../../utilities/utilities";
import { colorblind } from "../../utilities/graphics";

export function alliedCodeToPill(code: string) {
  const name = alliedCodeToName(code)
  const className = `nation-${colorblind() ? "cb-allies" : code} nation-pill`

  return <span key={code} className={className}>{name}</span>
}

export function axisCodeToPill(code: string) {
  const name = axisCodeToName(code)
  const className = `nation-${colorblind() ? "cb-axis" : code} nation-pill`

  return <span key={code} className={className}>{name}</span>
}
