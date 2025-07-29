import React, { useEffect, useState } from "react";
import { helpIndexByName } from "./helpData";
import { Link } from "react-router-dom";
import Unit, { UnitData } from "../../engine/Unit";
import Feature, { FeatureData } from "../../engine/Feature";
import Marker, { MarkerData } from "../../engine/Marker";
import Map, { MapData } from "../../engine/Map";
import { baseTerrainType, Coordinate, unitStatus, weatherType, windType } from "../../utilities/commonTypes";
import { getAPI } from "../../utilities/network";
import { makeIndex } from "./CounterSection";
import MapHexPatterns from "../game/map/MapHexPatterns";
import { clearColor, roundedRectangle } from "../../utilities/graphics";
import MapHex from "../game/map/MapHex";
import MapHexDetail from "../game/map/MapHexDetail";
import MapCounter from "../game/map/MapCounter";
import { findRoutPathTree, routPaths } from "../../engine/control/rout";
import Game, { gamePhaseType } from "../../engine/Game";
import { HexData } from "../../engine/Hex";
import { ScenarioData } from "../../engine/Scenario";
import { RoutPathTree } from "../../engine/control/actionState";

export default function RoutSection() {
  const [routDiagram, setRoutDiagram] = useState<JSX.Element | undefined>();
  const [routDiagram2, setRoutDiagram2] = useState<JSX.Element | undefined>();

  const [units, setUnits] = useState<{ [index: string]: Unit | Feature | Marker }>({});
  const [map, setMap] = useState<Map | undefined>();
  const [map2, setMap2] = useState<Map | undefined>();
  
  const createTestGame = (x: number, y: number, hexes: HexData[][]): Game => {
    const game = new Game({
      id: 1,
      name: "test game", scenario: scenarioTestData(x, y, hexes),
      owner: "one", state: "ready", player_one: "one", player_two: "", current_player: "",
      metadata: { turn: 0 },
      suppress_network: true
    });
  
    game.setTurn(1)
    game.phase = gamePhaseType.Main
    game.setCurrentPlayer(2)
    return game
  }
  
  const mapTestData = (x: number, y: number, hexes: HexData[][]): MapData => {
    return {
      layout: [ x, y, "x" ],
      allied_dir: 4, axis_dir: 1,
      victory_hexes: [],
      allied_setup: { 0: [[0, "*"]] },
      axis_setup: { 0: [[4, "*"]] },
      base_terrain: baseTerrainType.Grass,
      night: false,
      start_weather: weatherType.Dry,
      base_weather: weatherType.Dry,
      precip: [0, weatherType.Rain],
      wind: [windType.Calm, 3, false],
      hexes: hexes,
    }
  }
  
  const scenarioTestData = (x: number, y: number, hexes: HexData[][]): ScenarioData => {
    return {
      id: "1", name: "test scenario", status: "b", allies: ["ussr"], axis: ["ger"],
      metadata: {
        author: "The Establishment",
        description: ["This is a test scenario"],
        date: [1944, 6, 5],
        location: "anywhere",
        turns: 5,
        first_deploy: 2,
        first_action: 1,
        allied_units: {
          0: { list: []}
        },
        axis_units: {
          0: { list: []}
        },
        map_data: mapTestData(x, y, hexes),
      }
    }
  }

  const arrow = (x: number, y: number, angle: number) => {
    const radius = 21
    const size = 6
    return (
      <g>
        <g transform={`rotate(${angle} ${x} ${y})`}>
          <path d={`M ${x - radius + size} ${y - size} L ${x - radius} ${y} ` +
                   `L ${x - radius + size} ${y + size} M ${x - radius} ${y} L ${x} ${y}`}
                style={{ fill: clearColor, stroke: "#444", strokeWidth: 2 }}/>
        </g>
        <circle cx={x} cy={y} r={12} style={{ fill: `url(#nation-ger-12`, strokeWidth: 1, stroke: "#000"}}/>
      </g>
    )
  }

  useEffect(() => {
    const map = createTestGame(7, 4, [
      [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "f" }, { t: "f" }],
      [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "f" }, { t: "o" }],
      [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
      [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
    ]).scenario.map
    map.showCoords = false
    setMap(map)

    const map2 = createTestGame(7, 7, [
      [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
      [{ t: "o", h: 1 }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
      [{ t: "o", h: 1 }, { t: "o", h: 1 }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "w" }, { t: "o" }],
      [{ t: "o", h: 2 }, { t: "o", h: 1 }, { t: "o" }, { t: "m" }, { t: "w" }, { t: "o" }, { t: "o" }],
      [{ t: "o", h: 2 }, { t: "o", h: 2 }, { t: "o", h: 1 }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
      [{ t: "o", h: 2 }, { t: "o", h: 1 }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
      [{ t: "o", h: 2 }, { t: "o", h: 1 }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
    ]).scenario.map
    map2.showCoords = false
    setMap2(map2)

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
  }, [])

  useEffect(() => {
    if (!map || Object.keys(units).length < 1) { return }
    map.axisDir = 1
    const unit = units["ger_Rifle_sqd"].clone() as Unit
    if (map.units[1][1].length < 1) {
      map.addCounter(new Coordinate(1, 1), unit);
      unit.status = unitStatus.Broken
    }
    const paths = routPaths(findRoutPathTree(map.game as Game, new Coordinate(1, 1), 4, 2, unit) as RoutPathTree)

    setRoutDiagram(
      <div className="ml1em" style={{ float: "right" }}>
        <svg width={516.75} height={262.5} viewBox="115 40 689 350" style={{ minWidth: 516.75 }}>
          <MapHexPatterns />
          <mask id="los-mask">
            <path d={roundedRectangle(116, 41, 687, 348, 8)} style={{ fill: "#FFF" }} />
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
            { paths.map((path, i) => {
              const last = path[path.length - 1]
              const zx = map.xOffset(last.x, last.y)
              const zy = map.yOffset(last.y)
              let index = 0
              const dpath = path.map(p => {
                return `${ index++ ? "L" : "M" } ${map.xOffset(p.x, p.y)} ${map.yOffset(p.y)}`
              }).join(" ")
              return (
                <g key={`${i}-path`}>
                  <path d={dpath} style={{ stroke: "#E00", strokeWidth: 2, strokeDasharray: "4 4", fill: clearColor }} />
                  <circle cx={zx} cy={zy} r={12} style={{ fill: "#E00", stroke: "white", strokeWidth: 2 }} />
                </g>
              )
            })}
            <MapCounter counter={map.countersAt(new Coordinate(1, 1))[0]} ovCallback={() => {}} />
            { arrow(175, 80, 0) }
          </g>
          <path d={roundedRectangle(116, 41, 687, 348, 8)}
                style={{ stroke: "#DDD", strokeWidth: 1, fill: clearColor }}
          />
        </svg>
      </div>
    );
  }, [map, units])

  useEffect(() => {
    if (!map2 || Object.keys(units).length < 1) { return }
    map2.axisDir = 2.5
    const unit = units["ger_Rifle_sqd"].clone() as Unit
    if (map2.units[1][3].length < 1) {
      map2.addCounter(new Coordinate(3, 1), unit);
      unit.status = unitStatus.Broken
    }
    const paths = routPaths(findRoutPathTree(map2.game as Game, new Coordinate(3, 1), 4, 2, unit) as RoutPathTree)

    setRoutDiagram2(
      <div className="ml1em mt1em" style={{ float: "right" }}>
        <svg width={516.75} height={487.5} viewBox="115 40 689 650" style={{ minWidth: 516.75 }}>
          <MapHexPatterns />
          <mask id="los-mask2">
            <path d={roundedRectangle(116, 41, 687, 648, 8)} style={{ fill: "#FFF" }} />
          </mask>
          <g mask="url(#los-mask2)">
            {map2.mapHexes.map((row, y) =>
              row.map((hex, x) => <MapHex key={`h${x}-${y}`} hex={hex} />)
            )}
            {map2.mapHexes.map((row, y) =>
              row.map((hex, x) => (
                <MapHexDetail key={`d${x}-${y}`} hex={hex} maxX={0} maxY={0} scale={1}
                  showTerrain={false} selectCallback={() => {}} terrainCallback={() => {}}
                  svgRef={null as unknown as React.MutableRefObject<HTMLElement>}
                />
              ))
            )}
            { paths.map((path, i) => {
              const last = path[path.length - 1]
              const zx = map2.xOffset(last.x, last.y)
              const zy = map2.yOffset(last.y)
              let index = 0
              const dpath = path.map(p => {
                return `${ index++ ? "L" : "M" } ${map2.xOffset(p.x, p.y)} ${map2.yOffset(p.y)}`
              }).join(" ")
              return (
                <g key={`${i}-path`}>
                  <path d={dpath} style={{ stroke: "#E00", strokeWidth: 2, strokeDasharray: "4 4", fill: clearColor }} />
                  <circle cx={zx} cy={zy} r={12} style={{ fill: "#E00", stroke: "white", strokeWidth: 2 }} />
                </g>
              )
            })}
            <MapCounter counter={map2.countersAt(new Coordinate(3, 1))[0]} ovCallback={() => {}} />
            { arrow(175, 80, 90) }
          </g>
          <path d={roundedRectangle(116, 41, 687, 648, 8)}
                style={{ stroke: "#DDD", strokeWidth: 1, fill: clearColor }}
          />
        </svg>
      </div>
    );
  }, [map2, units])

  return (
    <div>
      <h1>Routing Units</h1>
      <p>
        There are two kinds of routing actions: routing a single one of a player&apos;s own units,
        or attempting to rout all of an opponent&apos;s units.
      </p>
      <p>
        Routing one&apos;s own units is automatic. If the unit can be routed, it will be routed.
      </p>
      <p>
        Attempting to rout all of an opponent&apos;s units is not automatic. Each broken unit makes
        a standard morale check (using all the normal morale check modifiers), except: ties result
        in no rout (see &quot;Morale Checks&quot; in the{" "}
        <Link to={`/help/${helpIndexByName("Fire").join(".")}`}>fire section</Link> of the
        documents). If the unit fails that morale check, it will rout.
      </p>
      {routDiagram}
      {routDiagram2}
      <p>
        A unit that routs must use all of their movement and must move backwards. The cost of
        movement through each hex is the same as normal movement, and any terrain that blocks
        movement blocks routs as well. When the advance direction is between two of the six
        &quot;cardinal&quot; directions, movement to the hex on either side of the opposite of that
        direction is legal. When the advance direction is one of those six cardinal directions, only
        movement direction in the opposite direction is legal. However, in that case, if the direct
        direction is blocked, a unit may rout one hex to either side. The only exception to needing
        to use all movement is if all possible further movement directions cost more movement than
        the unit has left and the hexes are not otherwise blocked.
      </p>
      <p>
        Units may not rout into a hex where it would exceed the stacking limit with friendly units,
        or hexes containing any opponent units. Units also may not rout into hexes containing mines
        or wires (though they may rout out of a hex containing wire or mines, using all of their
        movement). Units that can&apos;t use all of their movement (with the exception from the
        previous paragraph) without being blocked or going off the map are eliminated.
      </p>
      <p>
        Only broken units may rout, and a unit may only rout once per turn; after it routs it is
        marked with a &quot;routed&quot; marker.
      </p>
      <p>
        If the last action a player took was to rout all enemy units, a player may not attempt to
        rout all enemy units again, they must make some other action (passing included). I.e., if no
        other actions are available and the other player passes, only one rout enemy will be
        possible before the main phase ends.
      </p>
    </div>
  );
}
