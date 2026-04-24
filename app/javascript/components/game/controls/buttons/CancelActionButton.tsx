import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { CancelGlyph } from "../../../utilities/buttons";
import { stateType } from "../../../../engine/control/state/BaseState";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface CancelActionButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function CancelActionButton({ game, vertical, callback }: CancelActionButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.cancelAction()
    callback()
  }

  const text = () => {
    if (game.gameState?.type === stateType.Fire) {
      return "cancel fire"
    } else if (game.gameState?.type === stateType.Move) {
      return `cancel ${game.moveState.rushing ? "rush" : "move"}`
    } else if (game.gameState?.type === stateType.Assault) {
      return "cancel assault move"
    } else if (game.gameState && [stateType.Rout, stateType.RoutAll].includes(game.gameState.type)) {
      return "cancel rout"
    } else if (game.gameState?.type === stateType.SquadJoin) {
      return "cancel join"
    } else {
      return "unexpected action"
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
              {CancelGlyph()}
            </button>
          </OverlayTrigger> :
          <button type="submit" className="custom-button nowrap">
            {CancelGlyph()} {text()}
          </button>
        }
      </div>
    </form>
  )
}
