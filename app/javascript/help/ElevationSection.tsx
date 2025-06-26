import React, { useEffect, useState } from "react";
import Map from "../engine/Map";
import { Coordinate, weatherType, windType } from "../utilities/commonTypes";
import { roundedRectangle } from "../utilities/graphics";
import MapHex from "../components/game/map/MapHex";
import MapHexDetail from "../components/game/map/MapHexDetail";
import { getAPI } from "../utilities/network";
import Unit, { UnitData } from "../engine/Unit";
import Feature, { FeatureData } from "../engine/Feature";
import Marker, { MarkerData } from "../engine/Marker";
import { makeIndex } from "./CounterSection";
import MapCounter from "../components/game/map/MapCounter";
import MapLosOverlay from "../components/game/map/MapLosOverlay";
import MapHexPatterns from "../components/game/map/MapHexPatterns";
import Hex from "../engine/Hex";
import { Hexagon, HexagonFill } from "react-bootstrap-icons";

export default function ElevationSection() {
  const [facingDiagram, setFacingDiagram] = useState<JSX.Element | undefined>();

  const [units, setUnits] = useState<{ [index: string]: Unit | Feature | Marker }>({});
  const [map, setMap] = useState<Map | undefined>();

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
        [
          { t: "o" },
          { t: "o", h: 1 },
          { t: "o", h: 1 },
          { t: "o" },
          { t: "o" },
          { t: "o", h: 1 },
          { t: "o", h: 1 },
          { t: "o", h: 1 },
        ],
        [
          { t: "o", h: 1 },
          { t: "o", h: 2 },
          { t: "o", h: 1 },
          { t: "o" },
          { t: "o", h: 1 },
          { t: "o", h: 2 },
          { t: "o", h: 2 },
          { t: "o", h: 1 },
        ],
        [
          { t: "o" },
          { t: "o", h: 1 },
          { t: "o", h: 1 },
          { t: "o" },
          { t: "o" },
          { t: "o", h: 1 },
          { t: "o", h: 2 },
          { t: "o", h: 2 },
        ],
        [
          { t: "o" },
          { t: "o" },
          { t: "b" },
          { t: "o" },
          { t: "o", h: 1 },
          { t: "o", h: 1 },
          { t: "b", h: 1 },
          { t: "o", h: 1 },
        ],
        [
          { t: "o" },
          { t: "o" },
          { t: "o" },
          { t: "o", h: 1 },
          { t: "o" },
          { t: "o" },
          { t: "b" },
          { t: "o" },
        ],
        [
          { t: "o" },
          { t: "o" },
          { t: "o" },
          { t: "o", st: { sh: "l" } },
          { t: "b" },
          { t: "o", h: 1 },
          { t: "o", b: "f", be: [5] },
          { t: "o" },
        ],
        [
          { t: "o" },
          { t: "o" },
          { t: "o" },
          { t: "o" },
          { t: "o" },
          { t: "o" },
          { t: "o" },
          { t: "o" },
        ],
        [
          { t: "o" },
          { t: "o" },
          { t: "o" },
          { t: "o" },
          { t: "o" },
          { t: "o" },
          { t: "o" },
          { t: "o" },
        ],
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
    if (map.units[2][6].length < 1) {
      map.addCounter(new Coordinate(6, 2), units["ger_Rifle_sqd"].clone() as Unit);
    }
    const hex = map.hexAt(new Coordinate(6, 2)) as Hex
    const x0 = hex.xOffset
    const y0 = hex.yOffset
    const hexes = [
      map.hexAt(new Coordinate(7, 0)) as Hex,
      map.hexAt(new Coordinate(0, 1)) as Hex,
      map.hexAt(new Coordinate(1, 5)) as Hex,
      map.hexAt(new Coordinate(2, 6)) as Hex,
      map.hexAt(new Coordinate(4, 6)) as Hex,
      map.hexAt(new Coordinate(5, 6)) as Hex,
      map.hexAt(new Coordinate(7, 6)) as Hex,
      map.hexAt(new Coordinate(7, 4)) as Hex,
      ]

    setFacingDiagram(
      <div className="ml1em" style={{ float: "right" }}>
        <svg width={644} height={560} viewBox="57 40 862 750" style={{ minWidth: 644 }}>
          <MapHexPatterns />
          <mask id="facing-mask">
            <path d={roundedRectangle(58, 41, 860, 748, 8)} style={{ fill: "#FFF" }} />
          </mask>
          <g mask="url(#facing-mask)">
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
            <MapLosOverlay map={map} setOverlay={() => {}} xx={6} yy={2} />
            { hexes.map((h, i) => <g key={i}>
              <line x1={x0} y1={y0} x2={hexes[i].xOffset} y2={hexes[i].yOffset}
                    style={{ stroke: "#E00", strokeWidth: 2, strokeDasharray: "4 4" }} />
              <circle cx={hexes[i].xOffset} cy={hexes[i].yOffset} r={12}
                      style={{ fill: "#E00", stroke: "white", strokeWidth: 2 }} />
              <text x={hexes[i].xOffset} y={hexes[i].yOffset+6} textAnchor="middle" fontSize={16}
                      style={{ fill: "white" }}>{i + 1}</text>
            </g>) }
            <MapCounter counter={map.countersAt(new Coordinate(6, 2))[0]} ovCallback={() => {}} />
          </g>
          <path d={roundedRectangle(58, 41, 860, 748, 8)}
                style={{ stroke: "#DDD", strokeWidth: 1, fill: "rgba(0,0,0,0)" }}
          />
        </svg>
      </div>
    );
  }, [map, units]);

  const redNumber = (n: number) => {
    return (
      <svg width={20} height={20} viewBox="0 0 26 26" className="mr025em" style={{ verticalAlign: "-4px" }}>
        <circle cx={13} cy={13} r={12} style={{ fill: "#E00", stroke: "white", strokeWidth: 2 }} />
        <text x={13} y={19} textAnchor="middle" fontSize={16} style={{ fill: "white" }}>{n}</text>
      </svg>
    )
  }

  return (
    <div>
      <h1>Elevation</h1>
      <p>
        Elevation is indicated on the map by hex color (with higher elevations having darker
        brown colors).  Depressions (i.e., elevations below the rest of the map) and indicated
        with a dark green hex color.  Elevation is also shown on the terrain help tooltip
        when toggled on with the terrain info button:
      </p>
      <div className="flex mb1em">
        <div className="ml1em"></div>
        <div className="custom-button normal-button">
          <Hexagon /> <span>terrain info</span>
        </div>
        <div className="mt05em">/</div>
        <div className="custom-button normal-button">
          <HexagonFill /> <span>terrain info</span>
        </div>
        <div className="flex-fill"></div>
      </div>
      <p>
        Elevation affects several things, including movement, firing, and line-of-sight and
        hindrance. There is a +1 movement cost penalty for moving uphill (there is no matching bonus
        for moving downhill). There are penalties for firing uphill and bonuses for firing downhill.
        Finally, elevated hexes can block the line-of-sight for targets on the other side of a hill
        (or below the edge of a plateau for units in the middle of it). Elevation has the most
        complicated effects on line-of-sight, as show by the illustration below.
      </p>
      {facingDiagram}
      <p>Here are some example sightlines in the illustration:</p>
      <p>
        {redNumber(1)}
        Any hex at the same elevation as the hex a unit is in blocks views of hexes at lower
        elevations beyond it. In other words, to see below a plateau, the unit must be on the edge
        of it.
      </p>
      <p>
        {redNumber(2)}
        Again, hexes at the same elevation block the view of hexes at lower elevations behind them.
      </p>
      <p>
        {redNumber(3)}
        Hexes at lower elevations cast &quot;shadows&quot; behind them. The length of the shadow can
        be calculated as so: first take the distance between the source and the hex casting the
        shadow, then divide by the difference in elevation plus one. In this case, the shadow has a
        length of two: the distance of 4 divided by 2 (i.e., the difference in altitudes or 1, plus
        another 1) results in a shadow distance of 2:
      </p>
      <p>
        <strong>4 ÷ (1 + 1) = 2</strong>
      </p>
      <p>
        {redNumber(4)}
        Terrain that blocks line of sight is treated exactly as if it was an altitude one higher
        than the base terrain beneath it.
      </p>
      <p>
        {redNumber(5)}
        Terrain with hindrance casts &quot;hindrance&quot; shadows in exactly the same way. In this
        case the distance to the terrain casting the shadow is 3, and the difference in altitude is
        2, so one hex has hindrance behind it:
      </p>
      <p>
        <strong>3 ÷ (2 + 1) = 1</strong>
      </p>
      <p>
        {redNumber(6)}
        The hex casting this shadow is one hex closer to the unit (shadow lengths are rounded down)
        than the two previous highlighted elevation hexes:
      </p>
      <p>
        <strong>3 ÷ (1 + 1) = 1.5, rounded to 1</strong>
      </p>
      <p>
        {redNumber(7)}
        Fences cast hindrance shadows, same as other hexes containg terrain with inherent hindrance;
        use the hex in front of the fence to calculate the distance, so in this case:
      </p>
      <p>
        <strong>3 ÷ (2 + 1) = 1</strong>
      </p>
      <p>
        {redNumber(8)}
        Hindrances are also cast downhill.
      </p>
      <h2>Additional Rules</h2>
      <p>
        Smoke is considered to have unlimited height, so always causes hindrance. Fire also always
        blocks line-of-sight, regardless of elevation difference.
      </p>
      <p>
        Remember that line-of-sight is symmetrical, so if (and only if) the unit at the top of the
        hill can see a hex, a unit in that hex can see the unit at the top of the hill. Hindrance is
        mostly symmetrical, except hindrance in the same hex (or fences bordering a hex) only affect
        fire in, not fire out.
      </p>
    </div>
  );
}
