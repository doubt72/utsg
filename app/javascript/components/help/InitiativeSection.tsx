import React, { useEffect, useState } from "react";
import Map from "../../engine/Map";
import { Player, weatherType, windType } from "../../utilities/commonTypes";
import { roundedRectangle } from "../../utilities/graphics";
import InitiativeDisplay from "../game/map/InitiativeDisplay";
import Game from "../../engine/Game";
import MapHexPatterns from "../game/map/MapHexPatterns";
import { alliedCodeToName, axisCodeToName } from "../../utilities/utilities";

export default function InitiativeSection() {
  const [showInitiative, setShowInitiative] = useState<JSX.Element | undefined>()

  const [player, setPlayer] = useState<Player>(1)
  const [initiative, setInitiative] = useState<number>(0)

  const [map, setMap] = useState<Map | undefined>()
  
  useEffect(() => {
    const game = new Game({
      id: 0, name: "test", owner: "one", player_one: "one", player_two: "two",
      current_player: "one", metadata: { turn: 0 },
      scenario: {
        id: "999", name: "test", allies: ["ussr"], axis: ["ger"], status: "p",
        metadata: {
          author: "", description: [""], first_deploy: 1, date: [1940, 1, 1], location: "here",
          turns: 8,
          first_action: 1,
          allied_units: { 0: { list: [] }},
          axis_units: { 0: { list: [] }},
          map_data: {
            layout: [2, 2, "x"], axis_dir: 4, allied_dir: 1,
            start_weather: weatherType.Dry, base_weather: weatherType.Dry, precip: [0, weatherType.Rain],
            wind: [windType.Calm, 1, false],
            base_terrain: "g",
            hexes: [
              [{ t: "o" }, { t: "o" }],
              [{ t: "o" }, { t: "o" }],
            ]
          },
        },
      }
    })
    game.scenario.map.showCoords = false
    setMap(game.scenario.map)
  }, [])

  useEffect(() => {
    if (!map) { return }
    const game = map.game
    if (!game) { return }

    setShowInitiative(
      <div className="help-section-image">
        <svg width={203} height={653} viewBox='0 0 254 816' style={{ minWidth: 203 }}>
          <MapHexPatterns />
          <path d={roundedRectangle(1,1,252,814,8)} style={{ stroke: "#DDD", strokeWidth: 1, fill: "#FFF" }}/>
          <InitiativeDisplay map={map} xx={32} yy={32} hideCounters={false} ovCallback={() => {}} />
        </svg>
        <div className="flex">
          <div className="flex-fill"></div>
          <div className="custom-button normal-button" onClick={
            () => {
              if (game.initiative > -7) { game.initiative -= 1 }
              setInitiative(game.initiative)
            }}>
            <span>-</span>
          </div>
          <div className="custom-button normal-button" onClick={
            () => {
              game.initiativePlayer = (3 - player) as Player
              setPlayer(game.initiativePlayer)
            }}>
            <span>{ game.initiativePlayer === 1 ? alliedCodeToName(game.scenario.alliedFactions[0]) :
                                                  axisCodeToName(game.scenario.axisFactions[0]) }</span>
          </div>
          <div className="custom-button normal-button" onClick={
            () => {
              if (game.initiative < 7) { game.initiative += 1 }
              setInitiative(game.initiative)
            }}>
            <span>+</span>
          </div>
          <div className="flex-fill"></div>
        </div>
      </div>
    )
  }, [map, player, initiative])

  return (
    <div>
      <h1>Initiative</h1>
      {showInitiative}
      <p>
        Initiative refers to two closely connected concepts: first, whichever player currently has
        the initiative is the player allowed to take the next action. Actions also cost a certain
        amount of initiative, which moves the initiative marker along the initiative track, which is
        shown to the right here.
      </p>
      <p>
        After each action spends initiative and the marker is moved along the initiative track, the
        acting player must make an initiative check to maintain initiative. If they initiative is
        maintained, the player may continue taking additional actions, otherwise initiative passes
        to the other player who may then take their own actions. To make an initiative check, the
        player rolls two ten-sided dice, adding the total together (2d10). If the number is equal or
        higher than the current number on the track, the check passes. If the marker is in the
        center or on the player&apos;s side of the track, the check automatically passes.
      </p>
      <p>
        Most actions cost two initiative points, or move the marker two spaces on the track.  Some
        cost one or three.  Passing moves the initiative one space in the other direction towards
        the player&apos;s side but flips the marker to the other player.
      </p>
    </div>
  );
}
