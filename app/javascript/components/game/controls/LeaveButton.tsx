import React, { FormEvent } from "react";
import { PersonSlash } from "react-bootstrap-icons";
import { postAPI } from "../../../utilities/network";

interface LeaveButtonProps {
  gameId: number;
}

export default function LeaveButton({ gameId }: LeaveButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    postAPI(`/api/v1/games/${gameId}/leave`, {}, {
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
