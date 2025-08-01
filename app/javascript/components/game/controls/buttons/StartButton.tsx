import React, { FormEvent } from "react";
import { PlayCircle } from "react-bootstrap-icons";
import { postAPI } from "../../../../utilities/network";

interface StartButtonProps {
  gameId: number;
}

export default function StartButton({ gameId }: StartButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    postAPI(`/api/v1/games/${gameId}/start`, {}, {
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
