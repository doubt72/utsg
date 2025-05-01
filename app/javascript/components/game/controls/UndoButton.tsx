import React, { FormEvent } from "react";
import { ArrowCounterclockwise } from "react-bootstrap-icons";
import { postAPI } from "../../../utilities/network";

interface UndoButtonProps {
  moveId: number;
}

export default function UndoButton({ moveId }: UndoButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    postAPI(`/api/v1/game_moves/${moveId}/undo`, {}, {
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
