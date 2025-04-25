import React, { FormEvent } from "react";
import { ArrowCounterclockwise } from "react-bootstrap-icons";
import { postAPI } from "../../../utilities/network";

interface UndoButtonProps {
  gameId: number;
}

export default function UndoButton({ gameId }: UndoButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    // TODO: implement undo
    postAPI(`/api/v1/games/${gameId}/join`, {}, {
      ok: () => {}
    })
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap"><ArrowCounterclockwise/>undo</button>
      </div>
    </form>
  )
}
