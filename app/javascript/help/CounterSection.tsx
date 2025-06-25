import React, { useEffect, useState } from "react";
import { CircleFill, Square, SquareFill, Stack } from "react-bootstrap-icons";
import { getAPI } from "../utilities/network";
import Unit, { UnitData } from "../engine/Unit";
import Feature, { FeatureData } from "../engine/Feature";
import Marker, { MarkerData } from "../engine/Marker";
import { roundedRectangle } from "../utilities/graphics";
import MapCounter from "../components/game/map/MapCounter";
import Counter from "../engine/Counter";
import { markerType, unitStatus } from "../utilities/commonTypes";
  
export const makeIndex = (target: Unit | Feature | Marker) => {
  if (target.isFeature) {
    const feature = target as Feature
    if (feature.name === "Smoke") { return `f_Smoke_${feature.hindrance}`}
    if (feature.name === "Sniper") { return `f_Sniper_${feature.sniperRoll}`}
    return `f_${feature.name}`
  } else if (target.isMarker) {
    const marker = target as Marker
    if (marker.type === markerType.TrackedHull || marker.type === markerType.WheeledHull) {
      return `m_${marker.type}_${marker.nation}`
    }
    return `m_${marker.type}_${marker.subType}_${marker.value}_${marker.value2}`
  } else {
    const unit = target as Unit
    if (unit.name === "Leader") {
      return `${unit.nation}_Leader_ldr_${unit.baseMorale}_${unit.currentLeadership}`
    }
    if (unit.name === "Crew") {
      return `${unit.nation}_Crew_tm_${unit.currentGunHandling}`
    }
    return `${unit.nation}_${unit.name}_${unit.type}`
  }
}

export default function CounterSection() {
  const [units, setUnits] = useState<{ [index: string]: Unit | Feature | Marker }>({})

  const [unitFeature, setUnitFeature] = useState<{ key: string, broken: boolean }>(
    { key: "ger_Pionier_sqd", broken: false }
  )

  const [updateSection, setUpdateSection] = useState<JSX.Element | undefined>()

  useEffect(() => {
    getAPI("/api/v1/scenarios/all_units", {
      ok: response => response.json().then(json => {
        const data: { [index: string]: Unit | Feature | Marker } = {}
        Object.values(json).forEach(u => {
          let target = undefined
          if ((u as FeatureData).ft) {
            target = new Feature(u as FeatureData)
          } else if ((u as MarkerData).mk) {
            target = new Marker(u as MarkerData)
          } else {
            target = new Unit(u as UnitData)
          }
          data[makeIndex(target)] = target
        })
        setUnits(data)
      })
    })
  }, [])

  const labelLine = (x1: number, y1: number, x2: number, y2: number) => {
    return (
      <line x1={x1} x2={x2} y1={y1} y2={y2} style={{ stroke: "#333", strokeWidth: 0.5 }}/>
    )
  }

  const nameOverlay = (target: Unit | Feature | Marker) => {
    if (target.isMarker) { return }
    return (
      <g>
        <text x={64} y={19} fontSize={9} textAnchor="end">Name</text>
        { labelLine(65,20,85,44) }
      </g>
    )
  }

  const moraleOverlay = (target: Unit | Feature | Marker) => {
    if (target.isFeature || target.isMarker) { return }
    if (!(target as Unit).baseMorale) { return }
    return (
      <g>
        <text x={56} y={33} fontSize={9} textAnchor="end">Morale</text>
        { labelLine(57,34,89,61) }
      </g>
    )
  }

  const breakdownOverlay = (target: Unit | Feature | Marker) => {
    if (target.isFeature || target.isMarker) { return }
    const unit = target as Unit
    if (!unit.breakWeaponRoll || unit.isWreck) { return }
    const name = unit.breakDestroysWeapon || unit.jammed ? "Break Roll" : "Jam Roll"
    const extra = unit.breakDestroysWeapon || unit.jammed ?
      <text x={56} y={39} fontSize={5} textAnchor="end">(destroys weapon)</text> : undefined
    const extra2 = unit.jammed ?
      <g>
        <text x={56} y={100} fontSize={9} textAnchor="end">Repair Roll</text>
        { labelLine(57,97,88,80) }
      </g> : undefined
    const extra3 = unit.breakdownRoll ?
      <g>
        <text x={72} y={94} fontSize={9} textAnchor="end">Breakdown Roll</text>
        { labelLine(73,91,86,82) }
      </g> : undefined
    return (
      <g>
        <text x={56} y={33} fontSize={9} textAnchor="end">{name}</text>
        { extra } { extra2 } { extra3 }
        { labelLine(57,34,87, unit.breakdownRoll ? 56 : 58) }
      </g>
    )
  }

  const iconOverlay = (target: Unit | Feature | Marker) => {
    if (target.isFeature || target.isMarker) { return }
    const unit = target as Unit
    const offset = unit.breakWeaponRoll && !unit.breakdownRoll ? 3 : 0
    const swOffset = ["sw", "gun"].includes(unit.type) ? 5 : 0
    return (
      <g>
        <text x={40} y={66 + offset*2} fontSize={9} textAnchor="end">Icon</text>
        <text x={40} y={72 + offset*2} fontSize={5} textAnchor="end">{unit.isWreck ? "" : "(unit type)"}</text>
        { labelLine(41,66 + offset*2,(unit.canCarrySupport || unit.type === "cav" ? 103 : 105) + swOffset,
                71 + offset) }
      </g>
    )
  }

  const sponsonOverlay = (target: Unit | Feature | Marker) => {
    if (target.isFeature || target.isMarker) { return }
    const unit = target as Unit
    if (!unit.sponson) { return }
    return (
      <g>
        <text x={60} y={96} fontSize={9} textAnchor="end">Sponson</text>
        <text x={60} y={102} fontSize={5} textAnchor="end">(firepower - range)</text>
        { labelLine(61,94,105,89) }
      </g>
    )
  }

  const leadershipHandlingOverlay = (target: Unit | Feature | Marker) => {
    if (target.isFeature || target.isMarker) { return }
    const unit = target as Unit
    if ((!unit.leadership && !unit.gunHandling) || unit.isBroken) { return }
    const name = unit.leadership ? "Leadership" : "Gun Handling"
    return (
      <g>
        <text x={64} y={96} fontSize={9} textAnchor="end">{name}</text>
        { labelLine(65,93,84,83) }
      </g>
    )
  }

  const firepowerOverlay = (target: Unit | Feature | Marker) => {
    if (target.isMarker) { return }
    const unit = target as Unit
    const add: string[] = []
    const y = 130
    let x = 90
    if (target.isFeature) {
      const feature = target as Feature
      if (!["Hedgehog", "Wire", "Minefield", "AP Minefield", "AT Minefield", "Sniper"].includes(feature.name)) {
        return
      }
      if (feature.antiTank) { add.push("(anti-tank)"); x = 85 }
      if (feature.fieldGun) { add.push("(anti-tank capable)"); x = 85 }
    } else if (!unit.isWreck && !unit.isBroken && !unit.jammed) {
      if (unit.assault) { add.push("(assault bonus)"); x = 85 }
      if (unit.smokeCapable) { add.push("(smoke capable)") }
      if (unit.antiTank) { add.push("(anti-tank)"); x = 85 }
      if (unit.fieldGun) { add.push("(field gun)"); x = 85 }
      if (unit.areaFire) { add.push("(area fire)"); x = 85 }
      if (unit.ignoreTerrain) { add.push("(negates cover)"); x = 85 }
      if (unit.singleFire) { add.push("(single fire)"); x = 85 }
      if (unit.offBoard) { add.push("(off board)"); x = 84 }
      if (unit.minimumRange) { x -= 2 }
    }
    return (
      <g>
        <text x={64} y={y} fontSize={9} textAnchor="end">Firepower</text>
        { add.map((t, i) => <text x={64} y={y + 6 + i*6} fontSize={5} textAnchor="end" key={i}>{t}</text>)}
        { labelLine(65,y - 3,x,109) }
      </g>
    )
  }

  const rangeOverlay = (target: Unit | Feature | Marker) => {
    if (target.isMarker) { return }
    const unit = target as Unit
    const add: string[] = []
    let y1 = 136
    let y2 = 113
    if (target.isFeature) {
      const feature = target as Feature
      if (!["Hedgehog", "Wire", "Minefield", "AP Minefield", "AT Minefield"].includes(feature.name)) {
        return
      }
    } else if (!unit.isWreck && !unit.isBroken && !unit.jammed) {
      if (unit.rapidFire) { add.push("(rapid fire)"); y2 = 117 }
      if (unit.targetedRange) { add.push("(targeted range)"); y2 = 117 }
      if (unit.type === "sw" && unit.targetedRange) { add.push("(no crew bonus)") }
      if (unit.turreted) { add.push("(turret mounted)") }
      if (unit.rotatingVehicleMount) { add.push("(unarmored rotating mount)") }
      if (unit.backwardsMount) { add.push("(backwards firing)") }
      if (unit.minimumRange) { add.push("(minimum range)"); y2 = 114 }
    }
    if (add.length > 2) { y1 -= 5 }
    return (
      <g>
        <text x={121} y={y1} fontSize={9} textAnchor="middle">Range</text>
        { add.map((t, i) => <text x={121} y={y1 + 6 + i*6} fontSize={5} textAnchor="middle" key={i}>{t}</text>)}
        { labelLine(121,y1 - 7,121,y2) }
      </g>
    )
  }

  const movementOverlay = (target: Unit | Feature | Marker) => {
    if (target.isMarker) { return }
    const unit = target as Unit
    const add: string[] = []
    const y = 130
    let x = 151
    let name = "Movement"
    if (target.isFeature) {
      const feature = target as Feature
      if (!["Hedgehog", "Wire", "Minefield", "AP Minefield", "AT Minefield"].includes(feature.name)) {
        return
      }
      if (feature.impassableToVehicles) { add.push("(impassable to vehicles)"); x = 157 }
      if (feature.currentMovement === "A") { add.push("(uses all movement)"); x = 153 }
    } else if (!unit.isWreck && !unit.isBroken) {
      if (unit.type === "sw") { name = "Encumbrance" }
      if (unit.engineer) { add.push("(engineer)") }
      if (unit.baseMovement < 0) { x = 155 }
      if (unit.isTracked) { add.push("(tracked)"); x = 157 }
      if (unit.isWheeled) { add.push("(wheeled)"); x = 157 }
      if (unit.crewed) { add.push("(crewed weapon)"); x = 157 }
      if (unit.amphibious) { add.push("(amphibious)") }
      if (unit.minimumRange) { x += 2 }
    }
    return (
      <g>
        <text x={172} y={y} fontSize={9} textAnchor="start">{name}</text>
        { add.map((t, i) => <text x={172} y={y + 6 + i*6} fontSize={5} textAnchor="start" key={i}>{t}</text>)}
        { labelLine(171,y - 3,x,109) }
      </g>
    )
  }

  const armorOverlay = (target: Unit | Feature | Marker) => {
    if (target.isFeature || target.isMarker) { return }
    const unit = target as Unit
    if (!unit.hullArmor || unit.isWreck) { return }
    const extra = unit.turretArmor ?
      <g>
        <text x={176} y={74} fontSize={9} textAnchor="start">Turret Armor</text>
        { labelLine(175,74,158,79) }
      </g> : undefined
    const extra2 = unit.turretArmor ?
      <text x={176} y={80} fontSize={5} textAnchor="start">(front, side, rear)</text> : undefined
    const extra3 = unit.hullArmor && unit.hullArmor[2] === -1 ?
      <text x={176} y={106} fontSize={5} textAnchor="start">(rear open)</text> : undefined
    return (
      <g>
        <text x={176} y={94} fontSize={9} textAnchor="start">Hull Armor</text>
        <text x={176} y={100} fontSize={5} textAnchor="start">(front, side, rear)</text>
        { extra } { extra2 } { extra3 }
        { labelLine(175,91,158,89) }
      </g>
    )
  }

  const sizeOverlay = (target: Unit | Feature | Marker) => {
    if (target.isFeature || target.isMarker) { return }
    const unit = target as Unit
    const add: string[] = []
    const y = 33
    let x = 152
    if (!unit.isWreck) {
      if (unit.armored) {
        add.push("(armored)"); x = 157
      } else if (!["sw", "gun"].includes(unit.type)) {
        add.push("(unarmored)")
      }
      if (unit.towSize) { add.push("(towable)"); x = 157 }
      if (unit.topOpen) { add.push("(incomplete armor)"); x = 159 }
      if (unit.canTow) { add.push("(can tow)") }
      if (unit.transport > 2) {
        add.push("(can transport squad)")
      } else if (unit.transport > 1) {
        add.push("(can transport team)")
      } else if (unit.transport) {
        add.push("(can transport leader)")
      }
    }
    return (
      <g>
        <text x={176} y={y} fontSize={9} textAnchor="start">Size</text>
        { add.map((t, i) => <text x={176} y={y + 6 + i*6} fontSize={5} textAnchor="start" key={i}>{t}</text>)}
        { labelLine(176,34,x,unit.type === "cav" ? 53 : 56) }
      </g>
    )
  }

  const facingOverlay = (target: Unit | Feature | Marker) => {
    if (!target) { return }
    if (!target.rotates &&
        !(target.isMarker && (target.type === markerType.TrackedHull ||
                              target.type === markerType.WheeledHull ||
                              target.type === markerType.Wind))) {
      return
    }
    const name = target.type === markerType.Wind ? "This Direction" : "Faces This Edge"
    return (
      <g>
        <text x={121} y={36} fontSize={7} textAnchor="middle">{name}</text>
      </g>
    )
  }

  const sniperOverlay = (target: Unit | Feature | Marker) => {
    if (!target.isFeature) { return }
    const feature = target as Feature
    if (!feature.sniperRoll) { return }
    return (
      <g>
        <text x={150} y={22} fontSize={9} textAnchor="start">Activation Roll</text>
        { labelLine(172,24,129,65) }
      </g>
    )
  }

  const coverOverlay = (target: Unit | Feature | Marker) => {
    if (!target.isFeature) { return }
    const feature = target as Feature
    if (!feature.cover && !feature.coverSides) { return }
    const sub = feature.cover ? "(any direction)" : "(front, side, rear)"
    return (
      <g>
        <text x={160} y={141} fontSize={9} textAnchor="start">Cover</text>
        <text x={160} y={147} fontSize={5} textAnchor="start">{sub}</text>
        { labelLine(159,134,146,115) }
      </g>
    )
  }

  const weatherOverlay = (target: Unit | Feature | Marker) => {
    if (!target.isMarker) { return }
    const marker = target as Marker
    if (marker.type !== markerType.Wind && marker.type !== markerType.Weather) { return }
    const fe = marker.type === markerType.Weather ?
      <g>
        <text x={150} y={22} fontSize={9} textAnchor="start">Fire Extinguished</text>
        { labelLine(172,24,141,54) }
      </g> : undefined
    const fs = marker.type === markerType.Wind ?
      <g>
        <text x={70} y={110} fontSize={9} textAnchor="end">Fire Spread</text>
        { labelLine(71,108,99,100) }
      </g> : undefined
    const sd = marker.type === markerType.Wind ?
      <g>
        <text x={155} y={141} fontSize={9} textAnchor="start">Smoke Dispersed</text>
        { labelLine(154,136,139,116) }
      </g> : undefined
    return (
      <g>
        { fe }{ fs }{ sd }
      </g>
    )
  }

  const counter = (broken: boolean) => {
    const unit = units[unitFeature.key]
    if (!unit) { return }
    const counter = new Counter(undefined, unit)
    counter.hideShadow = true
    if (["tank", "spg", "ht", "ac", "truck"].includes(counter.unit.type)) {
      counter.unit.status = broken ? unitStatus.Wreck : unitStatus.Normal
    } else if (["gun", "sw"].includes(counter.unit.type)) {
      counter.unit.jammed = broken
    } else {
      counter.unit.status = broken ? unitStatus.Broken : unitStatus.Normal
    }
    return <MapCounter counter={counter} ovCallback={() => {}} />
  }

  const counterDisplay = (target: Unit | Feature | Marker, broken: boolean): JSX.Element | undefined => {
    if (!target) { return }
    return (
      <g>
        <g transform="translate(78 38)">
          {counter(broken)}
        </g>
        { nameOverlay(target) }
        { moraleOverlay(target) }
        { breakdownOverlay(target) }
        { iconOverlay(target) }
        { sponsonOverlay(target) }
        { leadershipHandlingOverlay(target) }
        { firepowerOverlay(target) }
        { rangeOverlay(target) }
        { movementOverlay(target) }
        { armorOverlay(target) }
        { sizeOverlay(target) }
        { facingOverlay(target) }
        { coverOverlay(target) }
        { sniperOverlay(target) }
        { weatherOverlay(target) }
      </g>
    )
  }

  const counterButton = (name: string, unit: string) => {
    const selected = unitFeature.key === unit ? "counter-help-button-selected" : ""
    return (
      <div className={`custom-button normal-button counter-help-button ${selected}`} onClick={
           () => setCounterKeyStatus(unit) }>
        <span>{name}</span>
      </div>
    )
  }

  const setCounterKeyStatus = (key: string) => {
    setUnitFeature({ key, broken: false })
  }

  const counterHelp = (target: Unit | Feature | Marker): JSX.Element[] => {
    if (!target) { return [] }
    const sections: JSX.Element[] = []
    let index = 0
    const unit = target as Unit
    if (target.isMarker) {
      const marker = target as Marker
      if (marker.type === markerType.TrackedHull || marker.type === markerType.WheeledHull) {
        sections.push(<p key={index++}>
          <strong>Hull facing</strong> is the direction the vehicle itself is facing.
        </p>)
        sections.push(<p key={index++}>
          <strong>Turret facing</strong> is indicated with the unit counter itself.
        </p>)
      }
      if (marker.type === markerType.Weather) {
        sections.push(<p key={index++}>
          <strong>Fire extinguished</strong> is the chance fires will go out during the cleanup phase.
        </p>)
        sections.push(<p key={index++}>
          <strong>Chance</strong> is the odds that there will be precipitation any given turn.
        </p>)
      }
      if (marker.type === markerType.Wind) {
        sections.push(<p key={index++}>
          <strong>Variable</strong> wind is more likely to change direction or strength.
        </p>)
        sections.push(<p key={index++}>
          <strong>Fire spread</strong> is the chance fires will spread during the cleanup phase.
        </p>)
        sections.push(<p key={index++}>
          <strong>Smoke dispersed</strong> is the chance smoke markers will be removed during
          the cleanup phase.
        </p>)
      }
    } else if (target.isFeature) {
      const feature = target as Feature
      if (feature.cover) {
        sections.push(<p key={index++}>
          <strong>Cover</strong> protects all units in the hex from fire.
        </p>)
      }
      if (feature.coverSides) {
        sections.push(<p key={index++}>
          <strong>Cover</strong> protects all units in the hex from fire from that direction.
        </p>)
      }
      if (feature.sniperRoll) {
        sections.push(<p key={index++}>
          <strong>Activation roll</strong> is the chance a sniper will hit the unit after it takes
          an action.
        </p>)
      }
      if (feature.currentMovement === "A") {
        sections.push(<p key={index++}>
          <strong>All movement</strong>: uses all remaining movement to enter hex with this
          feature.  Uses all movement to leave hex with this feature.
        </p>)
      }
      if (feature.baseFirepower) {
        if (feature.baseFirepower === "½") {
          sections.push(<p key={index++}>
            <strong>Half firepower</strong>: units fire at half power from wire.
          </p>)
        } else {
          sections.push(<p key={index++}>
            <strong>Firepower</strong> is the strength of the attack.
          </p>)
        }          
      }
      if (feature.antiTank) {
        sections.push(<p key={index++}>
          <strong>Circled firepower</strong> has full effect on armored targets and has no effect
          on soft targets.
        </p>)
      }
      if (feature.fieldGun) {
        sections.push(<p key={index++}>
          <strong>White circled firepower</strong> has full effect on soft or armored targets.
        </p>)
      }
      if (feature.baseFirepower && !feature.fieldGun && !feature.antiTank && feature.baseFirepower !== "½") {
        sections.push(<p key={index++}>
          <strong>Uncircled firepower</strong> has full effect on soft targets and has no effect
          on armored targets.
        </p>)
      }
      if (feature.impassableToVehicles) {
        sections.push(<p key={index++}>
          <strong>Circled zero movement</strong> indicates impassible to vehicles.
        </p>)
      }
    } else if (unit.isWreck) {
      sections.push(<p key={index++}>Clockwise from top:</p>)
      if (unit.size) {
        sections.push(<p key={index++}>
          <strong>Size</strong> is the stacking size of the unit.
        </p>)
      }
    } else {
      sections.push(<p key={index++}>Clockwise from top:</p>)
      if (unit.turreted) {
        sections.push(<p key={index++}>
          <strong>Facing</strong> indicates direction turret is facing; a hull marker is used
          for the vehicle itself.
        </p>)
      } else if (unit.rotates) {
        sections.push(<p key={index++}>
          <strong>Facing</strong> indicates direction unit is facing.
        </p>)
      }
      if (unit.size) {
        sections.push(<p key={index++}>
          <strong>Size</strong> is the stacking size of the unit.
        </p>)
      }
      if (unit.armored && unit.topOpen) {
        sections.push(<p key={index++}>
          <strong>Boxed size</strong> indicates the unit is not completely armored, and vulnerable
          to area fire (i.e., mortars or off-board artillery).
        </p>)
      } else if (unit.armored) {
        sections.push(<p key={index++}>
          <strong>Circled size</strong> indicates the unit is armored.
        </p>)
      } else if (!unit.crewed && !unit.uncrewedSW) {
        sections.push(<p key={index++}>
          <strong>Uncircled, unboxed size</strong> indicates the unit is soft (unarmored).
        </p>)
      }
      if (unit.towSize) {
        sections.push(<p key={index++}>
          <strong>Size superscript</strong> is the minimum size of the vehicle needed to tow this unit.
        </p>)
      }
      if (unit.canTow) {
        sections.push(<p key={index++}>
          <strong>Underlined size</strong> indicates that the vehicle can tow crewed weapons.
        </p>)
      }
      if (unit.transport > 2) {
        sections.push(<p key={index++}>
          <strong>Two dots next to size</strong> indicates that the unit can carry a squad or a team,
          as well as a leader and their infantry weapons.
        </p>)
      } else if (unit.transport > 1) {
        sections.push(<p key={index++}>
          <strong>A right dot next to size</strong> indicates that the unit can carry a team (not a full
          squad), as well as a leader and their infantry weapons.
        </p>)
      } else if (unit.transport) {
        sections.push(<p key={index++}>
          <strong>A left dot next to size</strong> indicates that the unit can carry a leader and
          their infantry weapon.  This may be useful for transporting artillery spotters.
        </p>)
      }
      if (unit.turretArmor) {
        sections.push(<p key={index++}>
          <strong>Turret armor</strong> is used for hits on the front, side, or rear.  The weakest armor
          is used for hits by area fire.
        </p>)
      }
      if (unit.hullArmor) {
        sections.push(<p key={index++}>
          <strong>Hull armor</strong> is used for hits on the front, side, or rear.  The weakest armor
          is used for hits by mines (treating unarmored as 0) or area fire.
        </p>)
      }
      if (unit.uncrewedSW) {
        sections.push(<p key={index++}>
          <strong>Negative movement</strong> (if any) indicates the encumbrance, or how much to reduce the
          movement of the unit carrying this infantry weapon.
        </p>)
      } else if (unit.isTracked) {
        sections.push(<p key={index++}>
          <strong>Circled movement</strong> indicates that this is a tracked vehicle.
        </p>)
      } else if (unit.isWheeled) {
        sections.push(<p key={index++}>
          <strong>White circled movement</strong> indicates that this is a wheeled vehicle.
        </p>)
      } else if (unit.crewed) {
        sections.push(<p key={index++}>
          <strong>Black circled movement</strong> indicates that this is a crewed weapon and
          can&apos;t move by itself but must be maneuvered by its crew.
        </p>)
      } else if (unit.currentMovement) {
        sections.push(<p key={index++}>
          <strong>Uncircled, unboxed movement</strong> indicates that is this unit moves by foot.
        </p>)
      }
      if (unit.engineer && !unit.isBroken) {
        sections.push(<p key={index++}>
          <strong>A dot above movement</strong> indicates that this unit is an engineer and may
          be able to remove obstacles or build limited defensive features more quickly.
        </p>)
      }
      if (unit.amphibious && !unit.isWreck) {
        sections.push(<p key={index++}>
          <strong>Underlined movement</strong> indicates that this vehicle is amphibious.
        </p>)
      }
      if (!unit.isBroken && !unit.jammed) {
        if (unit.rapidFire && unit.currentRange) {
          sections.push(<p key={index++}>
            <strong>Boxed range</strong> indicates this unit has rapid fire.  Rapid fire weapons can shoot
            at multiple hexes in one firing action.  Non-vehicle rapid firing weapons an be combined with
            other rapid firing units when a leader is present, or with other infantry units if carried or
            a leader is present but without being able to target multiple hexes.
          </p>)
        } else if (unit.targetedRange) {
          sections.push(<p key={index++}>
            <strong>Circled range</strong> indicates this unit requires an additional targeting roll and
            (unless an area fire weapon) can only target one unit.
          </p>)
        } else if (unit.currentRange) {
          sections.push(<p key={index++}>
            <strong>Uncircled, unboxed range</strong> indicates this unit targets all units in a single
            hex, but can be combined with other like units, or rapid firing (non-vehicle) units if
            carried or a leader is present.
          </p>)
        }
        if (unit.minimumRange) {
          sections.push(<p key={index++}>
            <strong>Two ranges</strong> indicates minimum and maximum range.
          </p>)
        }
        if (unit.turreted) {
          sections.push(<p key={index++}>
            <strong>White filled range</strong> indicates this vehicle has an armored turret that can be
            oriented independently of the rest of the vehicle.  The unit counter is used to indicate
            the direction of the turret, with a hull marker indicating the direction of the vehicle itself.
          </p>)
        }
        if (unit.rotatingVehicleMount && !unit.isWreck) {
          sections.push(<p key={index++}>
            <strong>A line above range</strong> indicates that this vehicle has a weapon that can be
            freely trained in any direction.
          </p>)
        }
        if (unit.backwardsMount && !unit.isWreck) {
          sections.push(<p key={index++}>
            <strong>A dot below range</strong> indicates that this vehicle has its weapon mounted backwards.
          </p>)
        }
        if (unit.type === "sw" && unit.targetedRange) {
          sections.push(<p key={index++}>
            <strong>Black filled range</strong> indicates that this weapon gets no crew bonus.
          </p>)
        }
        if (unit.assault) {
          sections.push(<p key={index++}>
            <strong>Boxed firepower</strong> indicates that this unit gets a +2 bonus in close combat.
            While only infantry units&apos; base firepower is used for close combat, infantry weapons&apos;
            assault bonus can be included.  However, if the infantry weapons are single shot, they are
            removed after combat.  This weapon has no effect on armored targets.
          </p>)
        } else if (unit.antiTank) {
          sections.push(<p key={index++}>
            <strong>White circled firepower</strong> indicates high-velocity anti-tank weapons.  These weapons
            get full effect on armored targets but only get half effect on soft targets.
          </p>)
        } else if (unit.fieldGun) {
          sections.push(<p key={index++}>
            <strong>Circled firepower</strong> indicates low-velocity, primarily anti-infantry weapons.
            These weapons get full effect on soft targets but only get half effect on
            armored targets.
          </p>)
        } else if (unit.offBoard) {
          sections.push(<p key={index++}>
            <strong>Hexed firepower</strong> indicates that this is an off-board artillery unit with
            special firing rules.  (This is also primarily an anti-infantry area weapon, so only has
            half effect on fully armored targets.)
          </p>)
        } else if (unit.areaFire) {
          sections.push(<p key={index++}>
            <strong>Circled firepower with a line above</strong> indicates that this unit uses
            area fire, with full effect on soft targts and half effect on fully armored targets.
          </p>)
        } else if (unit.currentFirepower && !unit.ignoreTerrain) {
          sections.push(<p key={index++}>
            <strong>Uncircled, unboxed firepower</strong> indicates that this
            weapons has no effect on armored targets.
          </p>)
        }
        if (unit.smokeCapable) {
          sections.push(<p key={index++}>
            <strong>A dot above firepower</strong> indicates that this unit can use smoke grenades
            or fire smoke rounds.
          </p>)
        }
        if (unit.ignoreTerrain && unit.singleFire) {
          sections.push(<p key={index++}>
            <strong>Red filled firepower</strong> indicates that this weapon ignores terrain or
            defensive feature effects <strong>and</strong> this weapon can only be fired once before
            it is removed, regardless of whether or not a hit is achieved.  Despite the lack of circle,
            this unit may attack armored units with no penalty.
          </p>)
        } else if (unit.ignoreTerrain) {
          sections.push(<p key={index++}>
            <strong>Yellow filled firepower</strong> indicates that this weapon ignores terrain or
            defensive feature effects. With or without a circle,
            this unit may attack armored units with no penalty.
          </p>)
        } else if (unit.singleFire) {
          sections.push(<p key={index++}>
            <strong>Black filled firepower</strong> indicates that this weapon can only be fired once
            before it is removed, regardless of whether or not a hit is achieved.  Despite the lack of circle,
            this unit may attack armored units with no penalty.
          </p>)
        }
      }
      if (unit.breakdownRoll) {
        sections.push(<p key={index++}>
          <strong>A bottom yellow circle</strong> indicates that this vehicle has a chance of breaking
          down.
        </p>)
      }
      if (unit.breakWeaponRoll && (unit.breakDestroysWeapon || unit.jammed)) {
        sections.push(<p key={index++}>
          <strong>A red circle</strong> indicates that this weapon may break.
        </p>)
      } else if (unit.breakWeaponRoll) {
        sections.push(<p key={index++}>
          <strong>A yellow circle</strong> indicates that this weapon may jam.
        </p>)
      }
      if (!unit.isBroken) {
        if (unit.gunHandling) {
          sections.push(<p key={index++}>
            <strong>A circled number</strong> indicates that this unit has a bonus for operating
            crewed guns.
          </p>)
        }
        if (unit.leadership) {
          sections.push(<p key={index++}>
            <strong>A hexed nmber</strong> indicates that this unit has a leadership bonus that can
            be applied to stacked units.  Also, units in that range can be combined in infantry arms attacks.
          </p>)
        }
      }
      if (unit.baseMorale) {
        sections.push(<p key={index++}>
          <strong>Morale</strong> affects the chance of the unit breaking when hit.
        </p>)
      }
      if (unit.sponson) {
        sections.push(<p key={index++}>
          <strong>Numbers across</strong> the bottom of the icon indicate a sponson weapon.
        </p>)
      }
      if (unit.type === "sqd") {
        sections.push(<p key={index++}>
          <strong>This icon</strong> (the filled circle on top, specifically) indicates this unit is a squad.
        </p>)
      }
      if (unit.type === "tm") {
        sections.push(<p key={index++}>
          <strong>This icon</strong> (the open circle on top, specifically) indicates this unit is a team.
        </p>)
      }
    }
    return sections
  }

  useEffect(() => {
    const ufm = units[unitFeature.key]
    if (!ufm) { return }
    const unit = ufm as Unit
    const svg = counterDisplay(ufm, unitFeature.broken)
    const help = counterHelp(ufm)
    const brokenSelect = unitFeature.broken ? " counter-help-button-selected": ""
    const showBreak = (!ufm.isFeature && !ufm.isMarker && !unit.breakDestroysWeapon && !unit.singleFire &&
      unit.type !== "cav") || unit.type === "spg" || unit.type === "ht"
    let breakName = "wreck unit"
    if (showBreak) {
      if (unit.canCarrySupport) { breakName = "break unit" }
      if (["gun", "sw"].includes(unit.type)) { breakName = "jam weapon" }
      if (unit.offBoard) { breakName = "break radio" }
    }
    setUpdateSection(
      <div className="flex mb05em flex-align-start">
        <div>
          <svg width={600} height={400} viewBox='0 0 240 160' style={{ minWidth: 600 }}>
            <path d={roundedRectangle(2,2,236,156,3)}
                  style={{ stroke: "#DDD", strokeWidth: 0.5, fill: "#FFF" }}/>
            { svg }
          </svg>
          <div className="mr05em mt05em">
            { help }
          </div>
        </div>
        <div>
          <div className="flex flex-wrap">
            { counterButton("infantry", "ger_Pionier_sqd") }
            { counterButton("tank", "ger_Tiger II_tank") }
            { counterButton("machine gun", "uk_Vickers MG_sw") }
            { counterButton("gun", "uk_QF 25-Pounder_gun") }
            { counterButton("mortar", "fra_Brandt M1935_sw") }
            { counterButton("leader", "ussr_Leader_ldr_6_2") }
            { counterButton("crew", "ita_Crew_tm_2") }
            { counterButton("flamethrower", "usa_Flamethrower_sw") }
            { counterButton("satchel charge", "usa_Satchel Charge_sw") }
            { counterButton("molotov coctail", "fin_Molotov Cocktail_sw") }
            { counterButton("radio", "ussr_Radio 122mm_sw") }
            { counterButton("anti-tank gun", "ger_8.8cm Pak 43/41_gun") }
            { counterButton("sponsoned tank", "uk_M3 Grant_tank") }
            { counterButton("flame tank", "usa_M3A1 Stuart FT_spg") }
            { counterButton("self-propelled gun", "ger_Marder III_spg") }
            { counterButton("armored car", "usa_M3A1 Scout Car_ac") }
            { counterButton("armored half-track", "ger_SdKfz 250/1_ht") }
            { counterButton("amtrac", "usa_LVT-1_ht") }
            { counterButton("mortar carrier", "usa_T19/M21 MMC_ht") }
            { counterButton("truck", "usa_GMC CCKW_truck") }
            { counterButton("duck", "usa_GMC DUKW_truck") }
            { counterButton("jeep", "usa_Jeep_truck") }
            { counterButton("technical", "uk_Chevy C30 AT_truck") }
            { counterButton("cavalry", "alm_Horse_cav") }
            { counterButton("bicycle", "jap_Bicycle_cav") }
            { counterButton("hedgehog", "f_Hedgehog") }
            { counterButton("wire", "f_Wire") }
            { counterButton("foxhole", "f_Foxhole") }
            { counterButton("pillbox", "f_Pillbox") }
            { counterButton("minefield", "f_Minefield") }
            { counterButton("ap minefield", "f_AP Minefield") }
            { counterButton("at minefield", "f_AT Minefield") }
            { counterButton("sniper", "f_Sniper_3") }
            { counterButton("tracked hull", "m_0_ger") }
            { counterButton("wheeled hull", "m_1_ussr") }
            { counterButton("breeze", "m_9_1_true_undefined") }
            { counterButton("rain", "m_10_2_4_undefined") }
          </div>
          { showBreak ?
            <div className="mt2em">
              <div className={
                  `custom-button normal-button counter-help-button${brokenSelect}`
                } onClick={
                  () => setUnitFeature(s => { return { ...s, broken: !s.broken } }) }>
                <span>{breakName}</span>
              </div>
            </div> : "" }
        </div>
      </div>
    )
  }, [units, unitFeature.key, unitFeature.broken])

  return (
    <div>
      <h1>Game Counters</h1>
      <p>
        There are three kinds of on-map counters in the game: units, features,
        and markers.  In addition there are a few additional off-map status markers.
        Counter display (i.e., whether to show counters or the underlying map terrain)
        can be toggled using the counters button:
      </p>
      <div className="flex mb1em">
        <div className="ml1em"></div>
        <div className="custom-button normal-button">
          <SquareFill /> <span>counters</span>
        </div>
        <div className="mt05em">/</div>
        <div className="custom-button normal-button">
          <Square /> <span>counters</span>
        </div>
        <div className="flex-fill"></div>
      </div>
      <p>
        Unit counters represent squads or teams, leaders, vehicles, and various guns or
        other infantry equipment, and can be moved, fired, or otherwise
        ordered.  Unit counters&apos; background color matches the color of the
        faction they belong to.
      </p>
      <p>
        Feature counters represent various on-map obstacles of various sorts such as
        wire, mines, smoke, fires and such, as well as defensive fortifications.  Features
        can&apos;t be ordered or moved (although they can be placed or removed under certain
        circumstances).  Features generally have a white background.
      </p>
      <p>
        Markers represent unit status on-map (such as fatigue, jammed weapons and such), or
        game status off-map (e.g., marking the current turn, initiative, or indicating weather
        conditions).  Markers are also used to indicate facing of tank or vehicle hulls if a
        vehicle has a turret (in which case the unit counter indicates turret facing).  On-map
        status markers can also be displayed via a badge over the unit instead of as separate
        markers, which can be toggled with the status button:
      </p>
      <div className="flex mb1em">
        <div className="ml1em"></div>
        <div className="custom-button normal-button">
          <CircleFill /> <span>status</span>
        </div>
        <div className="mt05em">/</div>
        <div className="custom-button normal-button">
          <Stack /> <span>status</span>
        </div>
        <div className="flex-fill"></div>
      </div>
      <h2 className="mt05em">Counter Layout</h2>
      <p>
        Select the buttons on the right to see examples of various counter layouts.
        Additionally, a help tooltip is available in-game by mousing over the
        question mark icon in the upper right corner of game counters.
      </p>
      { updateSection }
    </div>
  )
}
