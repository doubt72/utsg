import React, { FormEvent } from "react";
import { QuestionCircle } from "react-bootstrap-icons";
import Game from "../../../../engine/Game";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface HelpButtonProps {
  game: Game;
}

export default function HelpButton({ game }: HelpButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    const url = `/help/${game.currentHelpSection}`
    window.open(url)
  }

  const helpTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      game documentation opens in new window/tab
    </Tooltip>
  )

  return (
    <form onSubmit={onSubmit}>
      <OverlayTrigger placement="bottom" overlay={helpTooltip}
                      delay={{ show: 0, hide: 0 }}>
        <div className="mb025em">
          <button type="submit" className="custom-button custom-button-balance nowrap"><QuestionCircle/></button>
        </div>
      </OverlayTrigger>
    </form>
  )
}