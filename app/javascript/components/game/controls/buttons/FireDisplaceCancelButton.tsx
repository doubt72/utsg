import React, { FormEvent, useEffect } from "react";
import Game from "../../../../engine/Game";
import { CancelGlyph } from "../../../utilities/buttons";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface FireDisplaceCancelButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function FireDisplaceCancelButton({ game, vertical, callback }: FireDisplaceCancelButtonProps) {
  const hotkey = "Esc"
  const submit = () => {
    game.fireDisplaceState.cancel()
    callback()
  }

  useEffect(() => {
    if (localStorage.getItem("hotkeys") === "true") {
      const hotKeyListener = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
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

  const text = `cancel ${ game.fireDisplaceState.path.length > 1 ? "displacement" : "elimination" }`

  const buttonTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      { text }{ localStorage.getItem("hotkeys") === "true" ? ` [${hotkey}]` : "" }
    </Tooltip>
  )

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        { vertical ?
          <OverlayTrigger placement="bottom" overlay={buttonTooltip}
                          delay={{ show: 0, hide: 0 }} >
            <button type="submit" className="custom-button custom-button-balance nowrap">
              { CancelGlyph() }
            </button>
          </OverlayTrigger> :
          <button type="submit" className="custom-button nowrap">
            { CancelGlyph() } {text} {
              localStorage.getItem("hotkeys") === "true" ? <span className="button-hotkey">[{hotkey}]</span> : ""
            }
          </button>
        }
      </div>
    </form>
  )
}
