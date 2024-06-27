import React, { FormEvent } from "react";
import { PersonPlus } from "react-bootstrap-icons";
import { postAPI } from "../../../utilities/network";

interface JoinButtonProps {
  gameId: number;
}

export default function JoinButton({ gameId }: JoinButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    postAPI(`/api/v1/games/${gameId}/join`, {}, {
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
