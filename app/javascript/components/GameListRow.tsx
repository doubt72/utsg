import React from "react";
import { useNavigate } from "react-router-dom";
import { Circle, CircleFill, XCircle } from "react-bootstrap-icons";

interface GameListRowProps {
  data: {
    id: number;
    name: string;
    scenario: string;
    player_one?: string;
    player_two?: string;
    owner: string;
    current_player?: string;
    winner?: string;
    state: string;
    summary_metadata: {
      turn: number;
      scenario_turns: number;
      scenario_name: string;
    };
    empty: boolean;
  }
}

export default function GameListRow({ data }: GameListRowProps) {
  const navigate = useNavigate()

  const onClick = (event: React.MouseEvent) => {
    event.preventDefault()
    if (empty) { return false }
    navigate(`/game/${data.id}`, { replace: true })
  }

  const players = () => {
    const players = []
    if (data.player_one) { players.push(data.player_one) }
    if (data.player_two) { players.push(data.player_two) }
    const values = players.map((p, i) => <span key={i} className="bold green">{p}</span>)
    if (values.length === 1) {
      return ["started by: ", values[0]]
    } else if (players[0] === players[1]) {
      return ["players: ", values[0], " (solo)"]
    } else {
      return ["players: ", values[0], ", ", values[1]]
    }
  }

  const status = () => {
    if (empty) { return <div className="red">no games</div> }
    const cn = "red mr1em main-page-list-row-status"
    const currentUser = localStorage.getItem("username")
    let icon = <Circle />
    switch(data.state) {
      case "needs_player": {
        if (currentUser !== data.owner) { icon = <CircleFill /> }
        if (data.player_one) {
          return <div className={cn}>{icon} waiting for player two</div>
        } else {
          return <div className={cn}>{icon} waiting for player one</div>
        }
      }
      case "ready":
        if (currentUser === data.owner) { icon = <CircleFill /> }
        return <div className={cn}>{icon} ready to start</div>
      case "in_progress": {
        if (currentUser === data.current_player) { icon = <CircleFill /> }
        if (data.summary_metadata.turn === 0) {
          return <div className={cn}>{icon} {data.current_player} initial setup</div>
        } else {
          return (
            <div className={cn}>
              {icon} {data.current_player} turn {data.summary_metadata.turn}/
              {data.summary_metadata.scenario_turns}
            </div>
          )
        }
      }
      case "complete": {
        icon = <XCircle />
        if (data.winner) {
          return <div className={cn}>{icon} won by {data.winner}</div>
        } else {
          return <div className={cn}>{icon} game ended</div>
        }
      }
      default:
       return ""
    }
  }

  const empty = data.empty

  return (
    <div className="main-page-list-row" onClick={onClick}>
      {status()}
      {empty ? "" : <div className="main-page-list-row-names mr1em">{players()}</div>}
      {empty ? "" : <div className="green monospace mr05em">{data.scenario}:</div>}
      {empty ? "" : <div className="red mr1em">{data.summary_metadata.scenario_name}</div>}
      {empty ? "" : <div className="flex-fill align-end">{data.name}</div>}
    </div>
  )
}
