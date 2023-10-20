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

  const topLeftSmall = () => {
    const display = unit.displayTopLeftSmall
    return section(display,
      "unit-counter-top-left-small unit-counter-sec-small-circle " +
      "unit-counter-small-circle unit-counter-yellow"
    )
  }

  const size = () => {
    const display = unit.displaySize
    return section(display, "unit-counter-size unit-counter-sec")
  }

  const left = () => {
    const display = unit.displayLeft
    return section(display, "unit-counter-left unit-counter-sec")
  }

  const leftSmall = () => {
    const display = unit.displayLeftSmall
    return section(display,
      "unit-counter-left-small unit-counter-sec-small-circle unit-counter-small-circle"
    )
  }

  const sponson = () => {
    const display = unit.displaySponson
    return section(display, "unit-counter-sponson unit-counter-sec-sponson")
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

  const smoke = () => {
    const display = unit.displaySmoke
    return section(display, "unit-counter-sec unit-counter-smoke unit-counter-box")
  }

  const vehicleSmoke = () => {
    const display = unit.displayVehicleSmoke
    return section(display, "unit-counter-vehicle-smoke unit-counter-sec-vehicle-smoke")
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
      {topLeft()}{topLeftSmall()}{size()}
      {left()}{leftSmall()}{icon()}{sponson()}{smoke()}{vehicleSmoke()}
      {hullArmor()}{turretArmor()}
      {firepower()}{range()}{movement()}
      {status()}
    </div>
  )
}

export { unitCounter }