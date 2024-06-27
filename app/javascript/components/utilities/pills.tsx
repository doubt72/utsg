import React from "react";
import { alliedCodeToName, axisCodeToName } from "../../utilities/utilities";

export function alliedCodeToPill(code: string) {
  const name = alliedCodeToName(code)
  const className = `nation-${code} nation-pill`

  return <span key={code} className={className}>{name}</span>
}

export function axisCodeToPill(code: string) {
  const name = axisCodeToName(code)
  const className = `nation-${code} nation-pill`

  return <span key={code} className={className}>{name}</span>
}
