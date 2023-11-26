import React from "react";
import PropTypes from "prop-types"
import { PersonPlus } from "react-bootstrap-icons";
import { postAPI } from "../../../utilities/network";

export default function JoinButton(props) {
  const onSubmit = (event) => {
    event.preventDefault()
    postAPI(`/api/v1/games/${props.gameId}/join`, {}, {
      ok: () => {}
    })
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap"><PersonPlus/>join game</button>
      </div>
    </form>
  )
}

JoinButton.propTypes = {
  gameId: PropTypes.number.isRequired,
}
