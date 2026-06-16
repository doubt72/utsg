import React, { useEffect, useState } from "react";
import { gamePhaseType } from "../../engine/support/gamePhase";
import { serverVersion } from "../../utilities/utilities";
import Hex, { HexData } from "../../engine/Hex";
import Game from "../../engine/Game";
import { ScenarioData } from "../../engine/Scenario";
import Map, { MapData } from "../../engine/Map";
import { baseTerrainType, Coordinate, weatherType, windType } from "../../utilities/commonTypes";
import Unit, { UnitData } from "../../engine/Unit";
import Feature, { FeatureData } from "../../engine/Feature";
import Marker, { MarkerData } from "../../engine/Marker";
import { getAPI } from "../../utilities/network";
import { makeIndex } from "./CounterSection";
import MapHexPatterns from "../game/map/MapHexPatterns";
import { clearColor, roundedRectangle } from "../../utilities/graphics";
import MapHex from "../game/map/MapHex";
import MapHexDetail from "../game/map/MapHexDetail";
import MapCounter from "../game/map/MapCounter";
import FireTrackOverlay from "../game/map/FireTrackOverlay";
import FireHindranceOverlay from "../game/map/FireHindranceOverlay";
import FireState from "../../engine/control/state/FireState";
import MapTargetHexSelection from "../game/map/MapTargetHexSelection";

export default function FireExampleSection() {
  const [fireDiagram, setFireDiagram] = useState<JSX.Element | undefined>();

  const [units, setUnits] = useState<{ [index: string]: Unit | Feature | Marker }>({});
  const [map, setMap] = useState<Map | undefined>();

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
      id: "1", name: "test scenario", status: "b", version: "0.01",
      allies: ["ussr"], axis: ["ger"],
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

  const createTestGame = (x: number, y: number, hexes: HexData[][]): Game => {
    const game = new Game({
      id: 1, server_version: serverVersion,
      name: "test game", scenario: scenarioTestData(x, y, hexes),
      owner: "one", state: "ready", scenario_version: "0.01",
      player_one: "one", player_two: "", current_player: "",
      metadata: { turn: 0 },
      suppress_network: true
    });

    game.setTurn(1)
    game.phase = gamePhaseType.Main
    game.setCurrentPlayer(2)
    return game
  }

  useEffect(() => {
    const map = createTestGame(7, 4, [
      [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "f" }, { t: "f" }],
      [{ t: "o" }, { t: "o" }, { t: "d", d: 2 }, { t: "o" }, { t: "f" }, { t: "f" }, { t: "o" }],
      [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "d", d: 2 }, { t: "o" }, { t: "o" }, { t: "o" }],
      [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
    ]).scenario.map
    map.showCoords = false
    setMap(map)

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

    const fireLoc = new Coordinate(2, 2)
    const targetLoc = new Coordinate(4, 1)
    const fire = units["ger_StuG III-F/G_spg"].clone() as Unit
    if (map.units[fireLoc.y][fireLoc.x].length < 1) {
      fire.facing = 4
      fire.id = "firing"
      map.addCounter(fireLoc, fire)
    }
    const target = units["ussr_Rifle_sqd"].clone() as Unit
    if (map.units[targetLoc.y][targetLoc.x].length < 1) {
      target.id = "target"
      map.addCounter(targetLoc, target)
    }

    if (map.game && !map.game.gameState) {
      map.select(fire)
      map.game.setGameState(new FireState(map.game, false))
      map.game.fireState.select({
        target: { type: "map", xy: targetLoc }, counter: map.countersAt(targetLoc)[0]
      }, () => {})
    }

    setFireDiagram(
      <div className="ml1em" style={{ float: "right" }}>
        <svg width={475.5} height={262.5} viewBox="115 40 632 348" style={{ minWidth: 475.5, borderRadius: "8px" }}>
          <MapHexPatterns />
          <mask id="los-mask">
            <path d={roundedRectangle(116, 41, 632, 348, 8)} style={{ fill: "#FFF" }} />
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
            <FireTrackOverlay map={map} />
            <MapTargetHexSelection hex={map.hexAt(targetLoc) as Hex} target={true} active={true} />
            <MapCounter counter={map.countersAt(fireLoc)[0]} ovCallback={() => {}} />
            <MapCounter counter={map.countersAt(targetLoc)[0]} ovCallback={() => {}} />
            <FireHindranceOverlay map={map} />
          </g>
          <path d={roundedRectangle(116, 41, 632, 348, 8)}
                style={{ stroke: "#DDD", strokeWidth: 1, fill: clearColor }}
          />
        </svg>
      </div>
    );
  }, [map, units])

  return (
    <div>
      <div className="example">
        {fireDiagram}
        <p>
          In this example, a German StuG III-F/G is firing at a Soviet Rifle squad. The StuG has a
          firepower of 40 (anti-armor) and a range of 32 (i.e., more than enough) and is facing in
          the correct direction, so can fire at the infantry unit. The StuG has a targeted weapon,
          so the first step is determining if the weapon hits.
        </p>
        <p>
          First, we need to figure out the range modifier; in this case it&apos;s 4 (base of 4 with
          no modifiers). The effective distance is 4: 3 hexes plus 1 hindrance, so the range check
          is 16 (effective distance of 4 times range modifier of 4) &mdash; this is the number it
          has to beat with a roll. Let&apos;s say it rolls a 30 (5 times 6), and the StuG hits.
        </p>
        <p>
          The StuG then needs to fire for effect, it&apos;s firing at an infantry unit with an
          anti-tank weapon, so its firepower of 40 is halved, and so (checking the infantry fire
          table) it has to beat an 8 to hit, or get a 16 to make a critical hit. Let&apos;s say it
          rolls a 17 (8 plus 9), and makes a critical hit.
        </p>
        The Rifle squad would then have to make a morale check at a disadvantage. It would have to
        beat 14 (base of 15, minus 3 for morale, minus 2 for cover, plus 4 for a critical hit).
        Let&apos;s say it rolls a 14 even (10 plus 4), in that case it manages to avoid breaking,
        but it&apos;s pinned instead, and the fire action is complete.
      </div>
    </div>
  );
}
