import React from "react";
import PropTypes from "prop-types"
import { Game } from "../../engine/game";

export default function Gamecontrols(props) {
  const displayActions = () => {
    const user = localStorage.getItem("username")
    console.log(props.game)
    if (!props.game.id || !user) { return [] }
    const actions = props.game.actionsAvailable(user)
    const actionDipslay = []
    for (const a of actions) {
      if (a.type === "none") {
        actionDipslay.push(<div>{a.message}</div>)
      } else {
        actionDipslay.push(<div>unknown action {a.type}</div>)
      }
    }
    return actionDipslay
  }

  return (
    <div className="game-control ml05em mr05em">
      {displayActions()}
    </div>
  )
}

Gamecontrols.propTypes = {
  game: PropTypes.instanceOf(Game).isRequired,
}
