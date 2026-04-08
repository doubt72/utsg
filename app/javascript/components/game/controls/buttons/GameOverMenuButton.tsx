import React, { FormEvent } from "react";
import { ArrowLeftCircle } from "react-bootstrap-icons";

export default function GameOverMenuButton() {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    const url = `/`
    window.open(url)
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button custom-button-balance nowrap"><ArrowLeftCircle /> leave game</button>
      </div>
    </form>
  )
}
