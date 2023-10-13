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
    return section(display, "unit-counter-name")
  }

  const topLeft = () => {
    const display = unit.displayTopLeft
    return section(display, "unit-counter-top-left unit-counter-sec unit-counter-box")
  }

  const subtitle = () => {
    const display = unit.displaySubtitle
    return section(display, "unit-counter-subtitle")
  }

  const size = () => {
    const display = unit.displaySize
    return section(display, "unit-counter-size unit-counter-sec")
  }

  const left = () => {
    const display = unit.displayLeft
    return section(display, "unit-counter-left unit-counter-sec")
  }

  const jam = () => {
    const display = unit.displayJam
    return section(display,
      "unit-counter-jam unit-counter-sec-small-circle unit-counter-small-circle unit-counter-red"
    )
  }

  const breakdown = () => {
    const display = unit.displayBreakdown
    return section(display,
      "unit-counter-breakdown unit-counter-sec-small-circle " +
      "unit-counter-small-circle unit-counter-red-white"
    )
  }

  const icon = () => {
    const display = unit.displayIcon
    if (display.value === null) { return "" }
    return (
      <div className={`unit-counter-icon${display.display}`}>
        <img src={`/assets/units/${display.value}.svg`} />
      </div>
    )
  }

  const right = () => {
    const display = unit.displayRight
    return section(display, "unit-counter-sec unit-counter-right unit-counter-box")
  }

  const hullArmor = () => {
    const display = unit.displayHullArmor
    return section(display, "unit-counter-hull-armor unit-counter-sec-armor unit-counter-armor")
  }

  const turretArmor = () => {
    const display = unit.displayTurretArmor
    return section(display, "unit-counter-turret-armor unit-counter-sec-armor unit-counter-armor")
  }

  const firepower = () => {
    const display = unit.displayFirepower
    return section(display, "unit-counter-sec")
  }

  const range = () => {
    const display = unit.displayRange
    return section(display, "")
  }

  const movement = () => {
    const display = unit.displayMovement
    return section(display, "unit-counter-sec")
  }

  const status = () => {
    const display = unit.displayBadge
    return section(display, "unit-counter-status")
  }

  return (
    <div className={unitClasses}>
      {name()}
      {subtitle()}{topLeft()}{breakdown()}{size()}
      {left()}{jam()}{icon()}{right()}
      {hullArmor()}{turretArmor()}
      {firepower()}{range()}{movement()}
      {status()}
    </div>
  )
}

export { unitCounter }