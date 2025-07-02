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
import MapHexPatterns from "../game/map/MapHexPatterns";
import Hex from "../../engine/Hex";
import { helpIndexByName, redNumber } from "./helpData";

export default function LineOfSightSection() {
  const [facingDiagram, setFacingDiagram] = useState<JSX.Element | undefined>();

  const [units, setUnits] = useState<{ [index: string]: Unit | Feature | Marker }>({});
  const [map, setMap] = useState<Map | undefined>();
  
  const [showLines, setShowLines] = useState(true)
  const [showLOS, setShowLOS] = useState(true)

  useEffect(() => {
    const map = new Map({
      layout: [8, 8, "x"],
      axis_dir: 4,
      allied_dir: 1,
      start_weather: weatherType.Dry,
      base_weather: weatherType.Dry,
      precip: [0, weatherType.Rain],
      wind: [windType.Calm, 1, false],
      base_terrain: "g",
      hexes: [
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "g" }, { t: "o" }, { t: "f" }, { t: "f" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o", st: { sh: "l" } }, { t: "g" }, { t: "o" }, { t: "f" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [
          { t: "o" }, { t: "o" }, { t: "o", b: "w", be: [4] },
          { t: "o", b: "f", be: [3, 4] }, { t: "o" }, { t: "o", b: "w", be: [1, 6] },
          { t: "o", b: "f", be: [1] }, { t: "o" }
        ],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
      ],
    });
    map.showCoords = false;
    setMap(map);

    getAPI("/api/v1/scenarios/all_units", {
      ok: (response) =>
        response.json().then((json) => {
          const data: { [index: string]: Unit | Feature | Marker } = {};
          Object.values(json).forEach((u) => {
            let target = undefined;
            if ((u as FeatureData).ft) {
              target = new Feature(u as FeatureData);
            } else if ((u as MarkerData).mk) {
              target = new Marker(u as MarkerData);
            } else {
              target = new Unit(u as UnitData);
            }
            data[makeIndex(target)] = target;
          });
          setUnits(data);
        }),
    });
  }, []);

  useEffect(() => {
    if (!map || Object.keys(units).length < 1) {
      return;
    }
    if (map.units[4][6].length < 1) {
      map.addCounter(new Coordinate(4, 6), units["ger_Rifle_sqd"].clone() as Unit);
    }
    const hex = map.hexAt(new Coordinate(4, 6)) as Hex
    const x0 = hex.xOffset
    const y0 = hex.yOffset
    const hexes = [
      map.hexAt(new Coordinate(1, 6)) as Hex,
      map.hexAt(new Coordinate(1, 4)) as Hex,
      map.hexAt(new Coordinate(1, 0)) as Hex,
      map.hexAt(new Coordinate(4, 0)) as Hex,
      map.hexAt(new Coordinate(5, 3)) as Hex,
      map.hexAt(new Coordinate(6, 3)) as Hex,
      map.hexAt(new Coordinate(7, 6)) as Hex,
      map.hexAt(new Coordinate(5, 7)) as Hex,
      ]

    const lineSelect = showLines ? "counter-help-button-selected" : ""
    const losSelect = showLOS ? "counter-help-button-selected" : ""
    setFacingDiagram(
      <div className="ml1em" style={{ float: "right" }}>
        <svg width={604} height={562.5} viewBox="115 40 805 750" style={{ minWidth: 562.5 }}>
          <MapHexPatterns />
          <mask id="los-mask">
            <path d={roundedRectangle(116, 41, 803, 748, 8)} style={{ fill: "#FFF" }} />
          </mask>
          <g mask="url(#los-mask)">
            {map.mapHexes.map((row, y) =>
              row.map((hex, x) => <MapHex key={`h${x}-${y}`} hex={hex} />)
            )}
            {map.mapHexes.map((row, y) =>
              row.map((hex, x) => (
                <MapHexDetail key={`d${x}-${y}`} hex={hex} maxX={0} maxY={0} scale={1}
                  showTerrain={false} selectCallback={() => {}} terrainCallback={() => {}}
                  svgRef={null as unknown as React.MutableRefObject<HTMLElement>}
                />
              ))
            )}
            { showLOS ? <MapLosOverlay map={map} setOverlay={() => {}} xx={4} yy={6} /> : "" }
            { showLines ? hexes.map((h, i) => <g key={i}>
                <line x1={x0} y1={y0} x2={hexes[i].xOffset} y2={hexes[i].yOffset}
                      style={{ stroke: "#E00", strokeWidth: 2, strokeDasharray: "4 4" }} />
                <circle cx={hexes[i].xOffset} cy={hexes[i].yOffset} r={12}
                        style={{ fill: "#E00", stroke: "white", strokeWidth: 2 }} />
                <text x={hexes[i].xOffset} y={hexes[i].yOffset+6} textAnchor="middle" fontSize={16}
                        style={{ fill: "white" }}>{i + 1}</text>
              </g>) : "" }
            <MapCounter counter={map.countersAt(new Coordinate(4, 6))[0]} ovCallback={() => {}} />
          </g>
          <path d={roundedRectangle(116, 41, 803, 748, 8)}
                style={{ stroke: "#DDD", strokeWidth: 1, fill: "rgba(0,0,0,0)" }}
          />
        </svg>
        <div className="flex mb05em">
          <div className="flex-fill p05em align-end">toggle illustration:</div>
          <div className={`custom-button normal-button terrain-help-button ${lineSelect}`} onClick={
              () => setShowLines(s => !s) }>
            <span>sightlines</span>
          </div>
          <div className={`custom-button normal-button terrain-help-button ${losSelect}`} onClick={
              () => setShowLOS(s => !s) }>
            <span>LOS overlay</span>
          </div>
        </div>
      </div>
    );
  }, [map, units, showLines, showLOS]);

  return (
    <div>
      <h1>Line of Sight and Hindrance</h1>
      <p>
        Whenever a player would like one of their units to fire at the other player&apos;s units,
        that unit must have a clear <strong>line-of-sight</strong> (LOS) to the other unit for the attack to take
        place, and that line-of-sight may be blocked by various obstacles such as buildings, forest,
        or other terrain, as well as features like fire or rubble. Line-of-sight may also be blocked
        by elevated terrain, but that will be covered in the{" "}
        <a href={`/help/${helpIndexByName("Elevation").join(".")}`}>elevation</a> section of the
        documentation. Line-of-sight is determined by all of the hexes that are intersected by the
        sightline from the center of one hex to the center of the target hex.
      </p>
      <p>
        Fire attacks may also be increased in difficulty by a similar concept called{" "}
        <strong>hindrance</strong>. Hindrance is an inherent value of terrain that does not block
        line-of-sight entirely, it merely degrades it. Unlike line-of-sight, hindrance is not a
        binary yes or no, hindrance adds up for every hindering terrain or feature the line-of-sight
        line passes through.
      </p>
      <p>
        Unlike many other small unit tactics hex-and-counter wargames, hindrance and line-of-sight
        are not determined by the shape of the blocking or hindering terrain in hexes, but by the
        entire hex that contains those obstacles. In other words, if the hex contains a building,
        any line-of-sight that intersects any part of the hex, not just the building itself, is
        affected. A line-of-sight map overlay may be toggled on and off using the overlay button,
        when the button shows the eye icon, mousing over units will show the line-of-sight for those
        units:
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
      {facingDiagram}
      <p>Here are some example sightlines in the illustration to the right:</p>
      <p>
        {redNumber(1)}
        Fences normally have a hindrance of 1, but that hindrance is negated if firing from
        immediately behind the fence. There is, however a hindrance coming in from the other
        direction — hindrance is not symmetrical. Similarly, when a unit is in a hex that has
        terrain with an inherent hindrance (i.e., when in a field), there is a hindrance to incoming
        but not outgoing fire. LOS, on the other hand, is always symmetrical. The first hex behind a
        wall (as is shown here) is visible, but not any hexes farther back. However, if the wall was
        next to the unit, it would not block LOS at all (as is seen below).
      </p>
      <p>
        {redNumber(2)}
        Sightlines along a fence have the same hindrance as crossing a fence. Also, the building
        does not block LOS along the edge of its hex.
      </p>
      <p>
        {redNumber(3)}
        Each hex of the field add 1 to the total hindrance.
      </p>
      <p>
        {redNumber(4)}
        The forest does not block LOS along the edge of its hex.
      </p>
      <p>
        {redNumber(5)}
        The forest blocks LOS, but any units in the first blocking hex are always visible.
      </p>
      <p>
        {redNumber(6)}
        This sightline clips a forest hex, so LOS is blocked.
      </p>
      <p>
        {redNumber(7)}
        Unlike the fence on the other side, the fence father away from the player add a hindrance.
        Similarly, the wall next to the unit <em>does not</em> block LOS.
      </p>
      <p>
        {redNumber(8)}
        Sightlines along a wall block LOS to everything beyond them.
      </p>
      <h2>Additional Rules</h2>
      <p>
        Line-of-sight is symmetrical, so if (and only if) one unit one unit can see another unit,
        that unit can be seen in turn. Hindrance is mostly symmetrical, except (terrain) hindrance
        in the same hex (or fences bordering a hex) only affect fire in, not fire out (smoke is an
        exception, it affects both directions).
      </p>
    </div>
  );
}
