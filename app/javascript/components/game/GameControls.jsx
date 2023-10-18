import React, { useEffect, useState } from "react";
import PropTypes from "prop-types"
import { Game } from "../../engine/game";

export default function Gamecontrols(props) {
  const [controls, setControls] = useState([])

  useEffect(() => {
    if (!props.game.id) { return }
    displayActions()
  }, [props.game])

  const displayActions = () => {
    console.log(props.game)
    const user = localStorage.getItem("username")
    console.log(user)
    setControls(props.game.actionsAvailable(user).forEach((a, i) => {
      if (a.type === "none") {
        console.log(a.message)
        console.log(i)
        const foo = <div key={i}>{a.message}</div>
        console.log(foo)
        return foo
      } else {
        console.log(a.type)
        return <div key={i}>unknown action {a.type}</div>
      }
    }))
  }

  return (
    <div className="game-control ml05em mr05em">
      {controls.forEach(c => c)}
    </div>
  )
}

Gamecontrols.propTypes = {
  game: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.instanceOf(Game),
  ]).isRequired,
}
