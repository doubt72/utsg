import React, { useEffect, useState } from "react";
import { Player, weatherType, windType } from "../../utilities/commonTypes";
import Game from "../../engine/Game";
import Map from "../../engine/Map";
import MapHexPatterns from "../game/map/MapHexPatterns";
import InitiativeDisplay from "../game/map/InitiativeDisplay";
import { roundedRectangle } from "../../utilities/graphics";
import { Link } from "react-router-dom";
import { helpIndexByName } from "./helpData";

export default function MainPhaseSection() {
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
              game.updateInitiative(-1)
              setInitiative(game.initiative)
            }}>
            <span>-</span>
          </div>
          <div className="custom-button normal-button" onClick={
            () => {
              game.togglePlayer()
              setPlayer(game.currentPlayer)
            }}>
            <span>flip</span>
          </div>
          <div className="custom-button normal-button" onClick={
            () => {
              game.updateInitiative(1)
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
      <h1>Main Phase</h1>
      <p>
        During the main phase of each turn, the player with initiative can take various actions with
        their units (see the list below). Each action moves the marker on the initiative track, and
        after every action the acting player must make an initiative check, and if it fails, the
        initiative passes to the other player who may make their own actions in turn. Otherwise, the
        player can continue to order their units until no other orders are possible (or they
        otherwise choose to pass). Once both players pass back-to-back, the turn is over.
      </p>
      <p>
        If there is a sniper in play (i.e., the opposing player has a sniper), sniper checks are
        made immediately after actions but before the initiative check. Breakdown checks are also
        made immediately after moves but before the initiative check.
      </p>
      {showInitiative}
      <p>These are all of the actions that can be performed by the player with initiative:</p>
      <ol>
        <li>
          <strong>Pass</strong> (-1): a player may choose (or be forced to choose if no other
          options are available) to pass and take no action. Initiative is passed to the other
          player. Two passes in a row (one by each player) ends the Main Phase. This is the only
          &quot;action&quot; that is not followed by an initiative check.
        </li>
        <li>
          <strong>Fire</strong> (2): a ranged attack from one or more of a player&apos;s units on
          one or more enemy units.
        </li>
        <li>
          <strong>Intensive Fire</strong> (2): a unit may (sometimes) take another fire action even
          if they already have taken an action.
        </li>
        <li>
          <strong>Move</strong> (2): a normal move of one or more units moving from one hex to
          another.
        </li>
        <li>
          <strong>Rush</strong> (2): a unit may (sometimes) take another limited move action even if
          they have already taken an action.
        </li>
        <li>
          <strong>Assault Move</strong> (3): a special kind of move of a single hex that may move
          units into an enemy hex and does not give an opponent the chance to take reaction fire.
        </li>
        <li>
          <strong>Rout</strong> (1): a retreat move by one of a player&apos;s broken units. May be
          used to get a unit out of danger.
        </li>
        <li>
          <strong>Rout Enemy</strong> (3): an attempt to force all of an enemy player&apos;s broken
          units to retreat. Units can only be (successfully) routed once per turn.
        </li>
        <li>
          <strong>Reaction Fire</strong> (2): the opposing player may choose to take a firing (or
          intensive firing action) in response to any enemy action except routing or assault moves.
          There is no reaction fire if the acting player fails their initiative check, in that case
          the player may make a normal firing action instead.
        </li>
      </ol>
      <h2>Initiative</h2>
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
        Initiative checks are not undoable, regardless of whether or not the result was automatic.
      </p>
      <p>
        Most actions cost two initiative points, or move the marker two spaces on the track. A few
        cost one or three. Passing moves the initiative one space in the other direction towards the
        player&apos;s side but flips the marker to the other player.
      </p>
      <h2>Snipers</h2>
      <p>
        If either player has a sniper, and the other player moves or fires an infantry unit, there
        will be a sniper check after the action (assualt and rout actions don&apos;t trigger snipers). The
        player rolls two ten-sided dice, adding the total together (2d10), and if the number is
        equal or below the sniper roll on the marker, the player must make a morale check for any of
        their infantry units involved in the action (see Morale Checks in the{" "}
        <Link to={`/help/${helpIndexByName("Fire").join(".")}`}>fire section</Link> of the
        docs).
      </p>
    </div>
  );
}
