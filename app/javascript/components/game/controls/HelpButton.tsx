import React, { FormEvent } from "react";
import { QuestionCircle } from "react-bootstrap-icons";
import Game from "../../../engine/Game";

interface HelpButtonProps {
  game: Game;
}

export default function HelpButton({ game }: HelpButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    const url = `/help/${game.currentHelpSection}`
    window.open(url)
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button custom-button-balance nowrap"><QuestionCircle/></button>
      </div>
    </form>
  )
}