import React from "react";
// import { Unit } from "../../engine/unit";

const unitCounter = (unit) => {
  const unitClasses = `nation-${unit.nation} unit-counter`

  const section = (display, classes) => {
    if (display.value === null) { return "" }
    return (
      <div className={`${classes}${display.display}`}>
        <span>{display.value}</span>
      </div>
    )
  }

  const name = () => {
    const display = unit.displayName
    return section(display, "unit-name")
  }

  const morale = () => {
    const display = unit.displayMorale
    return section(display, "unit-morale unit-disp")
  }

  const size = () => {
    const display = unit.displaySize
    return section(display, "unit-size unit-disp")
  }

  const specialLeft = () => {
    const display = unit.displaySpecialLeft
    return section(display, "unit-disp")
  }

  const icon = () => {
    const display = unit.displayIcon
    if (display.value === null) { return "" }
    return (
      <div className={`unit-icon${display.display}`}>
        <img src={`/assets/units/${display.value}.svg`} />
      </div>
    )
  }

  const specialRight = () => {
    const display = unit.displaySpecialRight
    return section(display, "unit-disp")
  }

  const firepower = () => {
    const display = unit.displayFirepower
    return section(display, "unit-firepower unit-disp")
  }

  const range = () => {
    const display = unit.displayRange
    return section(display, "")
  }

  const movement = () => {
    const display = unit.displayMovement
    return section(display, "unit-disp")
  }

  const status = () => {
    const display = unit.displayBadge
    return section(display, "unit-status")
  }

  return (
    <div className={unitClasses}>
      {name()}{status()}
      {morale()}{size()}
      {specialLeft()}{icon()}{specialRight()}
      {firepower()}{range()}{movement()}
    </div>
  )
}

export { unitCounter }