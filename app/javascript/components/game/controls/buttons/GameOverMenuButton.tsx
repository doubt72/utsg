import React, { FormEvent } from "react";
import { ArrowLeftCircle } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

export default function GameOverMenuButton() {
  const navigate = useNavigate()

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    navigate("/", { replace: true })
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button custom-button-balance nowrap"><ArrowLeftCircle /> leave game</button>
      </div>
    </form>
  )
}
