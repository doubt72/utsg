import React, { FormEvent, useEffect } from "react";
import Game from "../../../../engine/Game";
import { DiceGlyph } from "../../../utilities/buttons";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface RoutCheckButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function RoutCheckButton({ game, vertical, callback }: RoutCheckButtonProps) {
  const hotkey = "E"
  const submit = () => {
    game.gameState?.finish()
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

  const text = "rout morale check"

  const buttonTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      { text }{ localStorage.getItem("hotkeys") === "true" ? ` ^${hotkey}` : "" }
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
            {DiceGlyph()} {text} {
              localStorage.getItem("hotkeys") === "true" ? <span className="button-hotkey">^{hotkey}</span> : ""
            }
          </button>
        }
      </div>
    </form>
  )
}
