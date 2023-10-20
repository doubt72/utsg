import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types"
import { Circle, CircleFill, XCircle } from "react-bootstrap-icons";

export default function GameListRow(props) {
  const navigate = useNavigate()

  const onClick = (event) => {
    event.preventDefault()
    if (empty) { return false }
    navigate(`/game/${props.data.id}`, { replace: true })
  }

  const players = () => {
    const players = []
    if (props.data.player_one) { players.push(props.data.player_one) }
    if (props.data.player_two) { players.push(props.data.player_two) }
    const values = players.map((p, i) => <span key={i} className="bold green">{p}</span>)
    if (values.length === 1) {
      return ["started by: ", values[0]]
    } else {
      return ["players: ", values[0], ", ", values[1]]
    }
  }

  const status = () => {
    if (empty) { return <div className="red">no games</div> }
    const cn = "red mr1em main-page-list-row-status"
    const currentUser = localStorage.getItem("username")
    let icon = <Circle />
    switch(props.data.state) {
      case "needs_player": {
        if (currentUser !== props.data.owner) { icon = <CircleFill /> }
        if (props.data.player_one) {
          return <div className={cn}>{icon} waiting for axis player</div>
        } else {
          return <div className={cn}>{icon} waiting for allied player</div>
        }
      }
      case "ready":
        if (currentUser === props.data.owner) { icon = <CircleFill /> }
        return <div className={cn}>{icon} ready to start</div>
      case "in_progress": {
        if (currentUser === props.data.current_player) { icon = <CircleFill /> }
        let currentSide = "allied"
        if (props.data.player_two === props.data.current_player) {
          currentSide = "axis"
        }
        if (props.data.summary_metadata.turn === 0) {
          return <div className={cn}>{icon} {currentSide} initial setup</div>
        } else {
          return (
            <div className={cn}>
              {icon} {currentSide} turn {props.data.summary_metadata.turn}/
              {props.data.summary_metadata.scenario_turns}
            </div>
          )
        }
      }
      case "complete": {
        icon = <XCircle />
        if (props.data.winner) {
          return <div className={cn}>{icon} won by {props.data.winner}</div>
        } else {
          return <div className={cn}>{icon} game ended</div>
        }
      }
      default:
       return ""
    }
  }

  const empty = props.data.empty

  return (
    <div className="main-page-list-row" onClick={onClick}>
      {status()}
      {empty ? "" : <div className="main-page-list-row-names mr1em">{players()}</div>}
      {empty ? "" : <div className="green monospace mr05em">{props.data.scenario}:</div>}
      {empty ? "" : <div className="red mr1em">{props.data.summary_metadata.scenario_name}</div>}
      {empty ? "" : <div className="flex-fill align-end">{props.data.name}</div>}
    </div>
  )
}

GameListRow.propTypes = {
  data: PropTypes.object.isRequired,
}
