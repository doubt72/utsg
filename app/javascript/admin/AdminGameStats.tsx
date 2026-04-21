import React, { useEffect, useState } from "react";
import { getAPI } from "../utilities/network";
import { GameData } from "../engine/Game";
import { statAddOne, statIncrementAllOne, StatLookup } from "../debug/statHelpers";
import { displayStat } from "../debug/DebugScenarioStats";

export default function AdminGameStats() {
  const [games, setGames] = useState<GameData[]>([])

  const [countScenario, setCountScenario] = useState<StatLookup>({})
  const [countScenarioVersion, setCountScenarioVersion] = useState<StatLookup>({})
  const [countState, setCountState] = useState<StatLookup>({})
  const [countOwner, setCountOwner] = useState<StatLookup>({})
  const [countPlayerOne, setCountPlayerOne] = useState<StatLookup>({})
  const [countPlayerTwo, setCountPlayerTwo] = useState<StatLookup>({})
  const [countCurrentPlayer, setCountCurrentPlayer] = useState<StatLookup>({})
  const [countWinner, setCountWinner] = useState<StatLookup>({})

  const [countNPOwner, setCountNPOwner] = useState<StatLookup>({})
  const [countNPPlayerOne, setCountNPPlayerOne] = useState<StatLookup>({})
  const [countNPPlayerTwo, setCountNPPlayerTwo] = useState<StatLookup>({})

  const [countRTOwner, setCountRTOwner] = useState<StatLookup>({})
  const [countRTPlayerOne, setCountRTPlayerOne] = useState<StatLookup>({})
  const [countRTPlayerTwo, setCountRTPlayerTwo] = useState<StatLookup>({})

  const [countIPOwner, setCountIPOwner] = useState<StatLookup>({})
  const [countIPPlayerOne, setCountIPPlayerOne] = useState<StatLookup>({})
  const [countIPPlayerTwo, setCountIPPlayerTwo] = useState<StatLookup>({})
  const [countIPCurrentPlayer, setCountIPCurrentPlayer] = useState<StatLookup>({})

  const [countGCOwner, setCountGCOwner] = useState<StatLookup>({})
  const [countGCPlayerOne, setCountGCPlayerOne] = useState<StatLookup>({})
  const [countGCPlayerTwo, setCountGCPlayerTwo] = useState<StatLookup>({})
  const [countGCWinner, setCountGCWinner] = useState<StatLookup>({})

  useEffect(() => {
    const url = "/api/v1/games?page=0&scope=all"
    getAPI(url, {
      ok: response => {
        response.json().then(json => {
          setGames(json.data)
        })
      }
    })
  }, [])

  useEffect(() => {
    const csc: StatLookup = { all: 0 }
    const cscv: StatLookup = { all: 0 }
    const cst: StatLookup = { all: 0 }
    const co: StatLookup = { all: 0 }
    const cp1: StatLookup = { all: 0 }
    const cp2: StatLookup = { all: 0 }
    const ccp: StatLookup = { all: 0 }
    const cw: StatLookup = { all: 0 }

    const cnpo: StatLookup = { all: 0 }
    const cnpp1: StatLookup = { all: 0 }
    const cnpp2: StatLookup = { all: 0 }

    const crto: StatLookup = { all: 0 }
    const crtp1: StatLookup = { all: 0 }
    const crtp2: StatLookup = { all: 0 }

    const cipo: StatLookup = { all: 0 }
    const cipp1: StatLookup = { all: 0 }
    const cipp2: StatLookup = { all: 0 }
    const cipcp: StatLookup = { all: 0 }

    const cgco: StatLookup = { all: 0 }
    const cgcp1: StatLookup = { all: 0 }
    const cgcp2: StatLookup = { all: 0 }
    const cgcw: StatLookup = { all: 0 }
    for (const g of games) {
      statIncrementAllOne([csc, cscv, cst, co, cp1, cp2, ccp, cw])
      statAddOne(csc, `${g.scenario}`)
      statAddOne(cscv, `${g.scenario}-${g.scenario_version}`)
      statAddOne(cst, g.state ?? "")
      statAddOne(co, g.owner)
      statAddOne(cp1, g.player_one ?? "[none yet]")
      statAddOne(cp2, g.player_two ?? "[none yet]")
      statAddOne(ccp, g.current_player)
      statAddOne(cw, g.winner ? `${g.winner}` : "[none yet]")
      if (g.state === "needs_player") {
        statIncrementAllOne([cnpo, cnpp1, cnpp2])
        statAddOne(cnpo, g.owner)
        statAddOne(cnpp1, g.player_one ?? "[none yet]")
        statAddOne(cnpp2, g.player_two ?? "[none yet]")
      }
      if (g.state === "ready") {
        statIncrementAllOne([crto, crtp1, crtp2])
        statAddOne(crto, g.owner)
        statAddOne(crtp1, g.player_one ?? "[none yet]")
        statAddOne(crtp2, g.player_two ?? "[none yet]")
      }
      if (g.state === "in_progress") {
        statIncrementAllOne([cipo, cipp1, cipp2, cipcp])
        statAddOne(cipo, g.owner)
        statAddOne(cipp1, g.player_one ?? "[none yet]")
        statAddOne(cipp2, g.player_two ?? "[none yet]")
        statAddOne(cipcp, g.current_player)
      }
      if (g.state === "complete") {
        statIncrementAllOne([cgco, cgcp1, cgcp2, cgcw])
        statAddOne(cgco, g.owner)
        statAddOne(cgcp1, g.player_one ?? "[none yet]")
        statAddOne(cgcp2, g.player_two ?? "[none yet]")
        statAddOne(cgcw, g.winner ? `${g.winner}` : "[none yet]")
      }
    }
    setCountScenario(() => csc)
    setCountScenarioVersion(() => cscv)
    setCountState(() => cst)
    setCountOwner(() => co)
    setCountPlayerOne(() => cp1)
    setCountPlayerTwo(() => cp2)
    setCountCurrentPlayer(() => ccp)
    setCountWinner(() => cw)

    setCountNPOwner(() => cnpo)
    setCountNPPlayerOne(() => cnpp1)
    setCountNPPlayerTwo(() => cnpp2)

    setCountRTOwner(() => crto)
    setCountRTPlayerOne(() => crtp1)
    setCountRTPlayerTwo(() => crtp2)

    setCountIPOwner(() => cipo)
    setCountIPPlayerOne(() => cipp1)
    setCountIPPlayerTwo(() => cipp2)
    setCountIPCurrentPlayer(() => cipcp)

    setCountGCOwner(() => cgco)
    setCountGCPlayerOne(() => cgcp1)
    setCountGCPlayerTwo(() => cgcp2)
    setCountGCWinner(() => cgcw)
  }, [games])

  return (
    <div className="flex flex-wrap">
      <div className="p1em">
        Scenario:
        {displayStat(countScenario, {})}
      </div>
      <div className="p1em">
        Scenario Version:
        {displayStat(countScenarioVersion, {}, "key")}
      </div>
      <div className="p1em">
        State:
        {displayStat(countState, {
          needs_player: "needs player", ready: "ready to start", in_progress: "in progress", complete: "finished",
        })}
        Owner:
        {displayStat(countOwner, {})}
        Player One:
        {displayStat(countPlayerOne, {})}
        Player Two:
        {displayStat(countPlayerTwo, {})}
        Current Player:
        {displayStat(countCurrentPlayer, {})}
        Winner:
        {displayStat(countWinner, {})}
      </div>
      <div className="p1em">
        <p><strong>Needs Player</strong></p>
        Owner:
        {displayStat(countNPOwner, {})}
        Player One:
        {displayStat(countNPPlayerOne, {})}
        Player Two:
        {displayStat(countNPPlayerTwo, {})}
        <p className="mt1em"><strong>Ready to Start</strong></p>
        Owner:
        {displayStat(countRTOwner, {})}
        Player One:
        {displayStat(countRTPlayerOne, {})}
        Player Two:
        {displayStat(countRTPlayerTwo, {})}
      </div>
      <div className="p1em">
        <p><strong>In Progress</strong></p>
        Owner:
        {displayStat(countIPOwner, {})}
        Player One:
        {displayStat(countIPPlayerOne, {})}
        Player Two:
        {displayStat(countIPPlayerTwo, {})}
        Current Player:
        {displayStat(countIPCurrentPlayer, {})}
      </div>
      <div className="p1em">
        <p><strong>Finished</strong></p>
        Owner:
        {displayStat(countGCOwner, {})}
        Player One:
        {displayStat(countGCPlayerOne, {})}
        Player Two:
        {displayStat(countGCPlayerTwo, {})}
        Winner:
        {displayStat(countGCWinner, {})}
      </div>
    </div>
  )
}
