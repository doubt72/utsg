import React, { useEffect, useState } from "react";
import PropTypes from "prop-types"
import { Game } from "../../engine/game";
import JoinButton from "./Controls/JoinButton";
import StartButton from "./Controls/StartButton";
import LeaveButton from "./Controls/LeaveButton";

export default function Gamecontrols(props) {
  const [controls, setControls] = useState([])

  useEffect(() => {
    if (!props.game.id) { return }
    displayActions()
  }, [props.game, props.update])

  const displayActions = () => {
    const user = localStorage.getItem("username")
    setControls(props.game.actionsAvailable(user).map((a, i) => {
      if (a.type === "none") {
        return <div key={i}>{a.message}</div>
      } else if (a.type === "join") {
        return <JoinButton gameId={props.game.id} key={i} />
      } else if (a.type === "leave") {
        return <LeaveButton gameId={props.game.id} key={i} />
      } else if (a.type === "start") {
        return <StartButton gameId={props.game.id} key={i} />
      } else {
        return <div key={i}>unknown action {a.type}</div>
      }
    }))
  }

  return (
    <div className="game-control ml05em mr05em">
      {controls}
    </div>
  )
}

Gamecontrols.propTypes = {
  game: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.instanceOf(Game),
  ]).isRequired,
  update: PropTypes.number,
}
