import React from "react";
import PropTypes from "prop-types"
import { PersonSlash } from "react-bootstrap-icons";
import { postAPI } from "../../../utilities/network";

export default function LeaveButton(props) {
  const onSubmit = (event) => {
    event.preventDefault()
    postAPI(`/api/v1/games/${props.gameId}/leave`, {}, {
      ok: () => {}
    })
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap"><PersonSlash/>leave game</button>
      </div>
    </form>
  )
}

LeaveButton.propTypes = {
  gameId: PropTypes.number.isRequired,
}
