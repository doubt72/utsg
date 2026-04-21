import { Coordinate, Direction, markerType } from "../../utilities/commonTypes"
import {
  actionBlue,
  ActionButtonLayout,
  actionGreen,
  BadgeLayout, baseCounterPath, circlePath, clearColor, counterElite, counterGreen, CounterLayout,
  counterRed,
  dropSelectColor,
  lastSelectColor,
  loadedSelectColor,
  loaderSelectColor,
  markerYellow,
  nationalColorLookup, roundedRectangle, selectColor, StatusLayout, SVGStyle,
  targetSelectColor
} from "../../utilities/graphics"
import { canAssaultMove, canFire, canIntensiveFire, canMove, canReactionFire, canReactionIntensiveFire, canRout, canRush } from "../control/actionsAvailable"
import { showClearObstacles, showEntrench } from "../control/assault"
import { closeCombatCasualtyNeeded } from "../control/closeCombat"
import { movementPastCost } from "../control/movement"
import { stateType } from "../control/state/BaseState"
import Counter from "../Counter"
import Map from "../Map"
import { gamePhaseType } from "./gamePhase"

export function counterPath(counter: Counter, xOffset: number = 0, yOffset: number = 0): string {
  return baseCounterPath(counter.x + xOffset, counter.y + yOffset)
}

export function counterStyle(counter: Counter): SVGStyle {
  const color = counterColor(counter)
  if (counter.hasMarker && counter.marker.type === markerType.Turn) {
    return { fill: "#DFDFDF" }
  }
  return { fill: color }
}

export function counterOutlineStyle(counter: Counter): SVGStyle {
  const color = clearColor
  if (counter.hasMarker && counter.marker.type === markerType.Turn) {
    return { fill: color, stroke: "black", strokeWidth: 1 }
  }
  if (counter.hasMarker) {
    return { fill: color, stroke: "black", strokeWidth: 1 }
  }
  if (counter.targetUF.selected) {
    return { fill: color, stroke: selectColor(), strokeWidth: 4 }
  } else if (counter.targetUF.targetSelected) {
    return { fill: color, stroke: targetSelectColor(), strokeWidth: 4 }
  } else if (counter.unit.dropSelected) {
    return { fill: color, stroke: dropSelectColor(), strokeWidth: 4 }
  } else if (counter.unit.loaderSelected) {
    return { fill: color, stroke: loaderSelectColor(), strokeWidth: 4 }
  } else if (counter.unit.loadedSelected) {
    return { fill: color, stroke: loadedSelectColor(), strokeWidth: 4 }
  } else if (counter.targetUF.lastSelected) {
    return { fill: color, stroke: lastSelectColor(), strokeWidth: 4 }
  } else {
    return { fill: color, stroke: "black", strokeWidth: 1 }
  }
}

export function nameBackgroundPath(counter: Counter): string {
  const x = counter.x
  const y = counter.y
  const corner = 4
  return [
    "M", x+corner, y,
    "L", x+80-corner, y, "A", corner, corner, 0, 0, 1, x+80, y+corner,
    "L", x+80, y+12.8, "L", x, y+12.8, "L", x, y+corner,
    "A", corner, corner, 0, 0, 1, x+corner, y,
  ].join(" ")
}

export function nameBackgroundStyle(counter: Counter): SVGStyle {
  return { fill: reverseName(counter) ? counterRed() : clearColor }
}

export function shadowPath(counter: Counter): string | false {
  if (counter.hideShadow) { return false }
  const angle = counter.rotation ? counter.rotation.a : 0
  return counterPath(
    counter,
    -counter.stackOffset * Math.sqrt(2) * Math.cos((angle + 45)/ 180 * Math.PI),
    counter.stackOffset * Math.sqrt(2) * Math.sin((angle + 45) / 180 * Math.PI)
  )
}

export function nameLayout(counter: Counter): CounterLayout {
  let size = counter.hasFeature ? 11 : 9
  if (counter.unit.smallName > 0) { size = 8.25 }
  if (counter.unit.smallName > 1) { size = 7.825 }
  if (counter.unit.smallName > 2) { size = 7.4 }
  if (counter.unit.smallName > 3) { size = 6.85 }
  if (counter.unit.smallName > 3) { size = 6.4 }
  const y = (counter.hasFeature ? counter.y + 12 : counter.y + 10) + size/2 - 4.125
  return {
    x: counter.x + 5, y: y, size: size, name: counter.targetUF.name,
    style: { fill: reverseName(counter) ? "white" : "black" }
  }
}

export function counterStatusLayout(counter: Counter): StatusLayout | boolean {
  if (!counter.hasUnit) { return false }
  const showAllCounters = counter.onMap ? counter.map?.showAllCounters : counter.showAllCounters
  if (counter.unit.isWreck || showAllCounters) { return false }
  const loc = new Coordinate(counter.x + 40, counter.y + 46)
  let size = 20
  const path = circlePath(loc.yDelta(-6), 22)
  const style = { fill: markerYellow(), stroke: "black", strokeWidth: 2 }
  const fStyle = { fill: "black" }
  if (counter.unit.pinned || counter.unit.immobilized || counter.unit.turretJammed ||
      (counter.unit.jammed && counter.unit.isVehicle) || counter.unit.weaponDestroyed ||
      counter.unit.sponsonJammed || counter.unit.sponsonDestroyed || counter.unit.routed) {
    style.fill = counterRed()
    style.stroke = "white"
    fStyle.fill = "white"
  }
  let text = []
  if (counter.unit.isActivated) { text.push("ACT") }
  if (counter.unit.isExhausted) { text.push("EXH") }
  if (counter.unit.pinned) { text.push("PIN") }
  if (counter.unit.isTired) { text.push("TRD") }
  if (counter.unit.immobilized) { text.push("IMM") }
  if (counter.unit.turretJammed) { text.push("TRT") }
  if (counter.unit.jammed && counter.unit.isVehicle) { text.push("WPB") }
  if (counter.unit.weaponDestroyed) { text.push("WPD") }
  if (counter.unit.sponsonJammed) { text.push("HWB") }
  if (counter.unit.sponsonDestroyed) { text.push("HWD") }
  if (counter.unit.routed) { text.push("RTD") }
  if (text.length === 0) { return false }
  if (text.length === 2) {
    size = 15
    loc.yShift(-9)
  } else if (text.length === 3) {
    size = 12
    loc.yShift(-14.5)
  } else if (text.length === 4) {
    size = 9
    loc.yShift(-17)
  } else if (text.length > 4) {
    size = 8.5
    loc.yShift(-8)
    text = [text.slice(0,2).join(" "), text.slice(2,4).join(" "), text.slice(4,6).join(" ")]
  }
  return {
    value: text, x: loc.x, y: loc.y, size: size, path: path,
    style: style, fStyle: fStyle
  }
}

export function counterActionButtons(
  map: Map, x: number, y: number, maxY: number, counter: Counter,
): ActionButtonLayout[] {
  if (!map.game) { return [] }
  const rc: { x: number, color: string, text: string, tColor: string, action: string }[] = []
  const size = 24
  const boxHeight = 30
  const boxWidth = 40
  let start = y
  if (y + boxHeight > maxY) {
    start = y - 176 - boxHeight
  }
  if (map.game?.phase === gamePhaseType.Deploy) {
    if (counter.unit.selected) {
      rc.push({ x, color: markerYellow(), text: "U", tColor: "#000", action: "undeploy" })
    }
  } else if (map.game.phase === gamePhaseType.PrepRally) {
    if (map.game.gameState?.type === stateType.Rally) {
      if (counter.unit.selected) {
        if (counter.unit.isBroken) {
          rc.push({ x, color: actionGreen(), text: "R", tColor: "#FFF", action: "rally" })
        } else {
          rc.push({ x, color: actionGreen(), text: "R", tColor: "#FFF", action: "repair" })
        }
      }
    }
  } else if (map.game.phase === gamePhaseType.Main) {
    if (map.game.gameState?.type === stateType.Fire) {
      if (counter.unit.targetSelected && map.game?.gameState?.type === stateType.Fire) {
        rc.push({ x, color: actionGreen(), text: "Y", tColor: "#FFF", action: "fire_finish" })
        rc.push({ x: x + boxWidth, color: counterRed(), text: "N", tColor: "#FFF", action: "cancel_action" })
      }
    } else if (map.game.gameState?.type === stateType.Move) {
      if (counter.unit.selected && counter.unit.canCarrySupport && counter.unit.smokeCapable &&
          movementPastCost(map, counter.unit) < counter.unit.currentMovement) {
        rc.push({ x, color: markerYellow(), text: "S", tColor: "#000", action: "move_smoke_toggle" })
      }
    } else if (map.game.gameState?.type === stateType.Assault) {
      if (counter.unit.selected) {
        if (showClearObstacles(map.game)) {
          rc.push({ x, color: markerYellow(), text: "C", tColor: "#000", action: "assault_move_clear" })
        }
        const x2 = x + rc.length * boxWidth
        if (showEntrench(map.game)) {
          rc.push({ x: x2, color: markerYellow(), text: "D", tColor: "#000", action: "assault_move_entrench" })
        }
      }
    } else if (map.game.gameState?.type === stateType.Rout) {
      if (counter.unit.selected) {
        rc.push({ x, color: counterRed(), text: "N", tColor: "#FFF", action: "cancel_action" })
      }
    } else if (map.game.gameState?.type === stateType.Reaction) {
      if (counter.unit.selected) {
        if (canReactionFire(counter.unit, map)) {
          rc.push({ x, color: counterRed(), text: "F", tColor: "#FFF", action: "reaction_fire" })
        } else if (canReactionIntensiveFire(counter.unit, map)) {
          rc.push({ x, color: counterRed(), text: "F", tColor: "#FFF", action: "reaction_intensive_fire" })
        }
      }
    } else if (map.game.gameState?.type === stateType.MoraleCheck) {
      if (counter.unit.selected) {
        rc.push({ x, color: markerYellow(), text: "M", tColor: "#000", action: "morale_check" })
      }
    } else if (map.game.gameState?.type === stateType.Breakdown) {
      if (counter.unit.selected) {
        rc.push({ x, color: markerYellow(), text: "B", tColor: "#000", action: "breakdown" })
      }
    } else if (map.game.gameState?.type === stateType.RoutCheck) {
      if (counter.unit.selected) {
        rc.push({ x, color: markerYellow(), text: "R", tColor: "#000", action: "rout_check" })
      }
    } else if (map.game.gameState === undefined) {
      if (counter.unit.selected) {
        if (canFire(counter.unit, map)) {
          rc.push({ x, color: counterRed(), text: "F", tColor: "#FFF", action: "fire" })
        } else if (canIntensiveFire(counter.unit, map)) {
          rc.push({ x, color: counterRed(), text: "F", tColor: "#FFF", action: "intensive_fire" })
        }
        const x2 = x + rc.length * boxWidth
        if (canMove(counter.unit, map)) {
          rc.push({ x: x2, color: actionGreen(), text: "M", tColor: "#FFF", action: "move" })
        } else if (canRush(counter.unit, map)) {
          rc.push({ x: x2, color: actionGreen(), text: "M", tColor: "#FFF", action: "rush" })
        }
        const x3 = x + rc.length * boxWidth
        if (canAssaultMove(counter.unit)) {
          rc.push({ x: x3, color: actionBlue(), text: "A", tColor: "#FFF", action: "assault_move" })
        }
        const x4 = x + rc.length * boxWidth
        if (canRout(counter.unit)) {
          rc.push({ x: x4, color: markerYellow(), text: "R", tColor: "#000", action: "rout" })
        }
      }
    }
  } else if (map.game.phase === gamePhaseType.CleanupCloseCombat) {
    if (counter.unit.selected && closeCombatCasualtyNeeded(map.game)) {
      rc.push({ x, color: counterRed(), text: "H", tColor: "#FFF", action: "close_combat_reduce" })
    }
  } else if (map.game.phase === gamePhaseType.CleanupOverstack) {
    if (counter.unit.selected) {
      rc.push({ x, color: counterRed(), text: "E", tColor: "#FFF", action: "overstack_reduce" })
    }
  }
  return rc.map(t => {
    return {
      path: roundedRectangle(t.x, start, boxWidth, boxHeight, 0), color: t.color, text: t.text,
      tColor: t.tColor, size, tX: t.x + boxWidth/2, tY: start + boxHeight/2 + 6, action: t.action,
    }
  })
}

export function counterInfoBadges(
  map: Map, x: number, y: number, maxY: number, counter: Counter, shift: number
): BadgeLayout[] {
  if (map.game && counter.hasUnit) {
    for (const c of map.game.eliminatedUnits) {
      if (!c.isFeature && counter.unit.id === c.id) { return [] }
    }
  }
  const badges: { text: string, color: string, tColor: string, arrow?: Direction}[] = []
  if (counter.targetUF.rotates && !(counter.hasUnit && counter.unit.isWreck) &&
      !(counter.hasMarker && counter.marker.hideOverlayRotation) && !counter.reinforcement) {
    const turret = counter.hasUnit && counter.unit.turreted && !counter.unit.isWreck
    const dir = turret ? counter.unit.turretFacing : counter.targetUF.facing
    badges.push({ text: `direction: ${dir}`, arrow: dir, color: "white", tColor: "black" })
  }
  if (counter.hasUnit && !counter.unit.isWreck) {
    const u = counter.unit
    const s = !map.showAllCounters
    if (u.eliteCrew > 0 && s) {
      badges.push({ text: "elite crew +1", color: counterElite(), tColor: "white" })
    }
    if (u.eliteCrew < 0 && s) {
      badges.push({ text: "green crew -1", color: counterGreen(), tColor: "black" })
    }
    if (u.isBroken) {
      badges.push({ text: "broken", color: counterRed(), tColor: "white" })
    }
    if (u.isWreck) {
      badges.push({ text: "destroyed", color: counterRed(), tColor: "white" })
    }
    if (u.immobilized && s) {
      badges.push({ text: "immobilized", color: counterRed(), tColor: "white" })
    }
    if (u.turretJammed && s) {
      badges.push({ text: "turret jammed", color: counterRed(), tColor: "white" })
    }
    if (u.jammed && u.isVehicle && s) {
      badges.push({ text: "weapon broken", color: counterRed(), tColor: "white" })
    } else if (u.jammed && s) {
      badges.push({ text: "broken", color: counterRed(), tColor: "white" })
    }
    if (u.weaponDestroyed && s) {
      badges.push({ text: "weapon destr", color: counterRed(), tColor: "white" })
    }
    if (u.sponsonJammed && s) {
      badges.push({ text: "hull wpn brok", color: counterRed(), tColor: "white" })
    }
    if (u.sponsonDestroyed && s) {
      badges.push({ text: "hull wpn dest", color: counterRed(), tColor: "white" })
    }
    if (u.routed && s) {
      badges.push({ text: "routed", color: counterRed(), tColor: "white" })
    }
    if (u.isTired && s) {
      badges.push({ text: "tired", color: markerYellow(), tColor: "black" })
    }
    if (u.pinned && s) {
      badges.push({ text: "pinned", color: counterRed(), tColor: "white" })
    }
    if (u.isExhausted && s) {
      badges.push({ text: "exhausted", color: markerYellow(), tColor: "black" })
    }
    if (u.isActivated && s) {
      badges.push({ text: "activated", color: markerYellow(), tColor: "black" })
    }
  }
  const size = 24
  let diff = size+4
  let start = y
  if (y + diff * badges.length > maxY) {
    diff = -diff
    start = y - 201 - shift*2
  }
  return badges.map((raw, i): BadgeLayout => {
    const b: BadgeLayout = raw
    b.x = x+5
    b.y = start + diff*i
    b.size = size-8
    b.path = [
      "M", x, b.y-size/2, "L", x+137.5, b.y-size/2, "L", x+137.5, b.y+size/2 ,
      "L", x, b.y+size/2, "L", x, b.y-size/2
    ].join(" ")
    if (b.arrow) {
      const c = x-size*0.6
      b.dirpath = [
        "M", c-size/2, b.y, "A", size/2, size/2, 0, 0, 1, c+size/2, b.y,
        "A", size/2, size/2, 0, 0, 1, c-size/2, b.y
      ].join(" ")
      b.dx = c
      b.dy = b.y
    }
    b.y = b.y + 5
    return b
  })
}

export function counterColor(counter: Counter): string {
  return nationalColorLookup(counter.targetUF.nation)
}

function reverseName(counter: Counter): boolean {
  if(!counter.hasUnit) { return false }
  return counter.unit.isBroken || counter.unit.isWreck ||
    (counter.unit.jammed && !counter.unit.hullArmor)
}
