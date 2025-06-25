import React, { useEffect, useState } from "react";
import { roundedRectangle } from "../utilities/graphics";
import { makeIndex } from "./CounterSection";
import Unit, { UnitData } from "../engine/Unit";
import Feature, { FeatureData } from "../engine/Feature";
import Marker, { MarkerData } from "../engine/Marker";
import { getAPI } from "../utilities/network";
import Map from "../engine/Map";
import { Coordinate, weatherType, windType } from "../utilities/commonTypes";
import organizeStacks from "../engine/support/organizeStacks";
import MapCounterOverlay from "../components/game/map/MapCounterOverlay";

export default function CounterStackingSection() {
  const [stack1, setStack1] = useState<JSX.Element | undefined>()
  const [stack2, setStack2] = useState<JSX.Element | undefined>()
  
  const [units, setUnits] = useState<{ [index: string]: Unit | Feature | Marker }>({})
  const [map, setMap] = useState<Map | undefined>()
    
  useEffect(() => {
    const map = new Map({
      layout: [2, 2, "x"], axis_dir: 4, allied_dir: 1,
      start_weather: weatherType.Dry, base_weather: weatherType.Dry, precip: [0, weatherType.Rain],
      wind: [windType.Calm, 1, false],
      base_terrain: "g",
      hexes: [[{ t: "o" }, { t: "o" }], [{ t: "o" }, { t: "o" }]]
    })
    setMap(map)

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

  useEffect(() => {
    if (!map || Object.keys(units).length < 1) { return }
    const units1 = [
      units["ussr_Rifle_sqd"].clone() as Unit,
      units["ussr_Rifle_tm"].clone() as Unit,
      units["ussr_DP-27_sw"].clone() as Unit,
      units["ussr_Leader_ldr_4_1"].clone() as Unit,
    ]
    map.units[0][0] = units1
    const units2 = [
      units["ger_SdKfz 250/1_ht"].clone() as Unit,
      units["ger_3.7cm Pak 36_gun"].clone() as Unit,
      units["ger_Crew_tm_1"].clone() as Unit,
      units["ger_Leader_ldr_5_2"].clone() as Unit,
      units["ger_Radio 15cm_sw"].clone() as Unit,
    ]
    map.units[0][0] = units1
    map.units[1][1] = units2
    organizeStacks(map)

    setStack1(
      <div className="help-section-image" >
        <svg width={576} height={154} viewBox='0 0 720 192' style={{ minWidth: 576 }}>
          <MapCounterOverlay map={map} setOverlay={() => {}} selectionCallback={() => {}}
                             xx={0} yy={0} mapScale={1} shiftX={0} shiftY={44} maxX={0} maxY={0}
                             counters={map.countersAt(new Coordinate(0,0))}  />
          <path d={roundedRectangle(0,0,736,192,0)}
                style={{ stroke: "rgba(0,0,0,0)", strokeWidth: 0.5, fill: "rgba(0,0,0,0)" }}/>
        </svg>
        <div className="help-section-image-caption">
          two infantry units and a leader, one of which is carrying a leader
        </div>
      </div>
    )
    setStack2(
      <div className="help-section-image" >
        <svg width={717} height={154} viewBox='0 0 896 192' style={{ minWidth: 717 }}>
          <MapCounterOverlay map={map} setOverlay={() => {}} selectionCallback={() => {}}
                             xx={0} yy={0} mapScale={1} shiftX={0} shiftY={44} maxX={0} maxY={0}
                             counters={map.countersAt(new Coordinate(1,1))}  />
          <path d={roundedRectangle(0,0,896,192,0)}
                style={{ stroke: "rgba(0,0,0,0)", strokeWidth: 0.5, fill: "rgba(0,0,0,0)" }}/>
        </svg>
        <div className="help-section-image-caption">
          a vehicle carrying several units
        </div>
      </div>
    )
  }, [units, map])

  return (
    <div>
      <h1>Stacking Counters</h1>
      <p>
        Counter stacking order is used to represent the relationship between counters. This is
        generally handled by the server once units are placed — the game preserves the relationships
        between units and the things they carry as units move around the map, and it handles showing
        status markers in the right order if unit status markers are shown — but it&apos;s important
        to know how stacking works when first deploying units to the map so that weapons and units
        are operated or carried by the units the player actually intends.
      </p>
      <p>
        In general, a unit (typically a weapon) is carried or operated by the unit under it. For
        instance, a machine gun may be carried by an infantry unit, and this means that if the
        player wants a particular machine gun (say) to be carried by a particular squad (say), the
        machine gun should be placed immediately on top of the squad. Once the deployment is
        finished, the relationship will formally be established by the server, this is indicated by
        boxes surrounding the units in question, for instance:
      </p>
      { stack1 }
      <div style={{ clear: "both" }}></div>
      <p>
        Units being towed and/or carried by vehicles work essentially the same way. Towed units
        should be placed immediately on top of a vehicle, and any infantry units placed on top of
        that, with infantry weapons being placed on those infantry units. For instance:
      </p>
      { stack2 }
      <div style={{ clear: "both" }}></div>
      <p>
        Once the game starts, units can be picked up or dropped via the move interface, and the game
        will take care of re-arranging and re-sorting the stacks. In addition, leaders will
        automatically be placed on top of stacks, which means that when attacks affect all the units
        in the stack, leaders will be affected last (results will be evaluated from bottom-to-top of
        stacks) so that the leadership bonus won&apos;t be lost until after the entire attack is
        evaluated.
      </p>
    </div>
  );
}
