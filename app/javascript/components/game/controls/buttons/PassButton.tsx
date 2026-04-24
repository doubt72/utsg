import React, { FormEvent } from "react";
import { ArrowClockwise } from "react-bootstrap-icons";
import Game from "../../../../engine/Game";
import { stateType } from "../../../../engine/control/state/BaseState";
import PassState from "../../../../engine/control/state/PassState";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface PassButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function PassButton({ game, vertical, callback }: PassButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (game.gameState?.type === stateType.Pass) {
      game.gameState.finish()
    } else {
      game.setGameState(new PassState(game))
    }
    callback()
  }

  const text = () => {
    const amount = game.passAmount
    if (game.gameState?.type === stateType.Pass) {
      return "confirm pass"
    } else {
      return `pass (${amount})`
    }
  }

  const buttonTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      { text() }
    </Tooltip>
  )

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        { vertical ?
          <OverlayTrigger placement="bottom" overlay={buttonTooltip}
                          delay={{ show: 0, hide: 0 }} >
            <button type="submit" className="custom-button custom-button-balance nowrap">
              <ArrowClockwise />
            </button>
          </OverlayTrigger> :
          <button type="submit" className="custom-button nowrap">
            <ArrowClockwise /> {text()}
          </button>
        }
      </div>
    </form>
  )
}
