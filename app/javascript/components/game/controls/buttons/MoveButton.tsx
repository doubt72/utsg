import React, { FormEvent, useEffect } from "react";
import Game from "../../../../engine/Game";
import { MoveGlyph } from "../../../utilities/buttons";
import MoveState from "../../../../engine/control/state/MoveState";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface MoveButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function MoveButton({ game, vertical, callback }: MoveButtonProps) {
  const hotkey = "M"
  const submit = () => {
    game.setGameState(new MoveState(game))
    callback()
  }

  useEffect(() => {
    if (localStorage.getItem("hotkeys") === "true") {
      const hotKeyListener = (e: KeyboardEvent) => {
        if (e.key === hotkey.toLowerCase() && e.ctrlKey) {
          e.preventDefault()
          e.stopPropagation()
          submit()
        }
      }
      window.addEventListener('keyup', hotKeyListener)

      return () => {
        window.removeEventListener('keyup', hotKeyListener)
      }
    }
  }, [])

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    submit()
  }

  const text = "move (2)"

  const buttonTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      { text }{localStorage.getItem("hotkeys") === "true" ? ` ^${hotkey}` : "" }
    </Tooltip>
  )

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        { vertical ?
          <OverlayTrigger placement="bottom" overlay={buttonTooltip}
                          delay={{ show: 0, hide: 0 }} >
            <button type="submit" className="custom-button custom-button-balance nowrap">
              {MoveGlyph()}
            </button>
          </OverlayTrigger> :
          <button type="submit" className="custom-button nowrap">
            {MoveGlyph()} {text} {
              localStorage.getItem("hotkeys") === "true" ? <span className="button-hotkey">^{hotkey}</span> : ""
            }
          </button>
        }
      </div>
    </form>
  )
}
