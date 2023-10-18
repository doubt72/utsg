import React from "react";
import PropTypes from "prop-types"
import { PlayCircle } from "react-bootstrap-icons";
import { postAPI } from "../../../utilities/network";

export default function StartButton(props) {
  const onSubmit = (event) => {
    event.preventDefault()
    postAPI(`/api/v1/games/${props.gameId}/start`, {}, {
      ok: () => {}
    })
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap"><PlayCircle/>start game</button>
      </div>
    </form>
  )
}

StartButton.propTypes = {
  gameId: PropTypes.number.isRequired,
}
