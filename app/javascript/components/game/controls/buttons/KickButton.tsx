import React, { FormEvent } from "react";
import { PersonSlash } from "react-bootstrap-icons";
import { postAPI } from "../../../../utilities/network";

interface KickButtonProps {
  gameId: number;
}

export default function KickButton({ gameId }: KickButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    postAPI(`/api/v1/games/${gameId}/kick`, {}, {
      ok: () => {}
    })
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap"><PersonSlash/>kick player</button>
      </div>
    </form>
  )
}
