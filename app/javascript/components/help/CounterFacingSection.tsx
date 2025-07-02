import React, { useEffect, useState } from "react";
import { EyeFill, Stack } from "react-bootstrap-icons";
import Map from "../../engine/Map";
import { Coordinate, weatherType, windType } from "../../utilities/commonTypes";
import { roundedRectangle } from "../../utilities/graphics";
import MapHex from "../game/map/MapHex";
import MapHexDetail from "../game/map/MapHexDetail";
import { getAPI } from "../../utilities/network";
import Unit, { UnitData } from "../../engine/Unit";
import Feature, { FeatureData } from "../../engine/Feature";
import Marker, { MarkerData } from "../../engine/Marker";
import { makeIndex } from "./CounterSection";
import MapCounter from "../game/map/MapCounter";
import MapLosOverlay from "../game/map/MapLosOverlay";
import { helpIndexByName } from "./helpData";

export default function CounterFacingSection() {
  const [facingDiagram, setFacingDiagram] = useState<JSX.Element | undefined>()

  const [units, setUnits] = useState<{ [index: string]: Unit | Feature | Marker }>({})
  const [map, setMap] = useState<Map | undefined>()
  const [map2, setMap2] = useState<Map | undefined>()
  
  useEffect(() => {
    const map = new Map({
      layout: [5, 5, "x"], axis_dir: 4, allied_dir: 1,
      start_weather: weatherType.Dry, base_weather: weatherType.Dry, precip: [0, weatherType.Rain],
      wind: [windType.Calm, 1, false],
      base_terrain: "g",
      hexes: [
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
      ]
    })
    map.showCoords = false
    setMap(map)
    const map2 = new Map({
      layout: [5, 5, "x"], axis_dir: 4, allied_dir: 1,
      start_weather: weatherType.Dry, base_weather: weatherType.Dry, precip: [0, weatherType.Rain],
      wind: [windType.Calm, 1, false],
      base_terrain: "d",
      hexes: [
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
      ]
    })
    map2.showCoords = false
    setMap2(map2)

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
    if (!map || !map2 || Object.keys(units).length < 1) { return }
    if (map.units[2][4].length < 1) {
      map.addCounter(new Coordinate(4, 2),  units["ger_Tiger II_tank"].clone() as Unit)
    }

    map.mapHexes.forEach(row => row.forEach(hex => {
      if (4 - hex.coord.x > Math.abs(2 - hex.coord.y)) { hex.map = map2}
    }))

    setFacingDiagram(
      <div className="help-section-image">
        <svg width={414} height={360} viewBox='58 40 517.5 450' style={{ minWidth: 414 }}>
          <mask id="facing-mask">
            <path d={roundedRectangle(59,41,516,448,8)} style={{ fill: "#FFF" }}/>
          </mask>
          <g mask="url(#facing-mask)">
            { map.mapHexes.map((row, y) => row.map((hex, x) => <MapHex key={`h${x}-${y}`} hex={hex} />)) }
            { map.mapHexes.map((row, y) => row.map((hex, x) =>
                <MapHexDetail key={`d${x}-${y}`} hex={hex} maxX={0} maxY={0} scale={1} showTerrain={false}
                              selectCallback={() => {}} terrainCallback={() => {}}
                              svgRef={null as unknown as React.MutableRefObject<HTMLElement>} />)) }
            <MapCounter counter={map.countersAt(new Coordinate(4, 2))[0]} ovCallback={() => {}} />
            <MapLosOverlay map={map} setOverlay={() => {}} xx={4} yy={2} />
          </g>
          <path d={roundedRectangle(59,41,516,448,8)}
                style={{ stroke: "#DDD", strokeWidth: 1, fill: "rgba(0,0,0,0)" }}/>
        </svg>
        <div className="help-section-image-caption">
          forward facing arc, with included hexes highlighted
        </div>
      </div>
    )
  }, [map, map2, units])

  return (
    <div>
      <h1>Counter Facing</h1>
      <p>
        Some units have <strong>facing</strong>, i.e., they are always pointed in some particular
        direction. This applies to vehicles and guns, not infantry or infantry weapons. The forward
        direction (or facing) of any unit is indicated by the direction the top of the counter,
        i.e., if the top of the counter points left, the unit&apos;s facing and forward arc is to
        the left. Some armored units have armored turrets, in which case the facing of the turret
        and the hull can be oriented independently; in this case the hull facing is indicated with a
        hull marker, and the facing of the turret is indicated with the counter itself, placed on
        top of the hull.
      </p>
      {facingDiagram}
      <p>
        Whenever the weapons with facing are firing, they must fire in the direction of the forward
        arc, as shown on the image here. The forward arc includes all the hexes that are between the
        lines, even if only partially (i.e., it includes all of the hexes that the lines pass
        through). If a unit is not in the forward arc of the hull of an un-turreted vehicle (or the
        forward arc of the hull if a sponsoned weapon), it cannot be targeted. The same applies to
        the forward arc of the turrets of turreted vehicles.
      </p>
      <p>
        Units without facing (i.e., infantry unit or infantry weapons) are unrestricted by firing
        arcs and can fire in any direction.
      </p>
      <p>
        Facing also applies to armored protection. If an attack comes from a unit in the forward arc
        of the targeted vehicle (or the targeted vehicle&apos;s turret if it hits the turret), it is
        considered to be hitting the forward armor and the forward armor factor is applied. To
        determine if it hits the rear of the vehicle, apply the same arc but in the opposite
        direction, i.e., project the arc from the rear of the vehicle (or turret). In the case where
        the firing unit is not in either of those arcs, it would be considered to be hitting the
        side, and side armor applies.
      </p>
      <p>
        Forward firing arcs can be seen on the map at any time by toggling the overlay button to
        show line-of-sight and mousing over unit counters — assuming the unit has a facing (see the{" "}
        <a href={`/help/${helpIndexByName("Line of Sight").join(".")}`}>line-of-sight</a> section
        for more):
      </p>
      <div className="flex mb1em">
        <div className="ml1em"></div>
        <div className="custom-button normal-button">
          <Stack /> <span>overlay</span>
        </div>
        <div className="mt05em">/</div>
        <div className="custom-button normal-button">
          <EyeFill /> <span>overlay</span>
        </div>
        <div className="flex-fill"></div>
      </div>
    </div>
  );
}
