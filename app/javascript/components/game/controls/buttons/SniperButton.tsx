import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { DiceGlyph } from "../../../utilities/buttons";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface SniperButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function SniperButton({ game, vertical, callback }: SniperButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.gameState?.finish()
    callback()
  }

  const text = "sniper check"

  const buttonTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      { text }
    </Tooltip>
  )

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        { vertical ?
          <OverlayTrigger placement="bottom" overlay={buttonTooltip}
                          delay={{ show: 0, hide: 0 }} >
            <button type="submit" className="custom-button custom-button-balance nowrap">
              {DiceGlyph()}
            </button>
          </OverlayTrigger> :
          <button type="submit" className="custom-button nowrap">
            {DiceGlyph()} {text}
          </button>
        }
      </div>
    </form>
  )
}
