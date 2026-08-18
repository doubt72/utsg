import React, { FormEvent, useEffect } from "react";
import Game from "../../../../engine/Game";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";
import {
  ArrowClockwise, ArrowCounterclockwise, BoxArrowDown, BoxArrowInUp, CircleFill, CircleHalf, Clouds,
  CloudSlash, DashSquare, ShieldFill, XCircle, XLg
} from "react-bootstrap-icons";
import AssaultState from "../../../../engine/control/state/AssaultState";
import {
  CancelGlyph, DiceGlyph, EliminateGlyph, FinishGlyph, FireGlyph, FireIntenseGlyph, MoveGlyph,
  MoveRushGlyph, RoutGlyph
} from "../../../utilities/buttons";
import { stateType } from "../../../../engine/control/state/BaseState";
import { useNavigate } from "react-router-dom";
import RoutAllState from "../../../../engine/control/state/RoutAllState";
import FireState from "../../../../engine/control/state/FireState";
import MoveState from "../../../../engine/control/state/MoveState";
import OverstackState from "../../../../engine/control/state/OverstackState";
import RallyState from "../../../../engine/control/state/RallyState";
import RoutState from "../../../../engine/control/state/RoutState";
import PassState from "../../../../engine/control/state/PassState";

interface ButtonProps {
  game: Game,
  vertical: boolean,
  callback: () => void;
}

export function AssaultMoveAbandonButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.assaultState.abandon()
    callback()
  }

  return <StandardButton vertical={vertical} text="abandon vehicle" glyph={<BoxArrowDown />} callback={submit} />
}

export function AssaultMoveButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.setGameState(new AssaultState(game))
    callback()
  }

  return <StandardTooltipButton vertical={vertical} text="assault move (3)" glyph={MoveRushGlyph()} hotkey={"A"}
                                callback={submit} />
}

export function AssaultMoveClearButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.assaultState.clear()
    callback()
  }

  return <StandardTooltipButton vertical={vertical} text="clear obstacle" glyph={<XLg />} hotkey={"O"}
                                callback={submit} />
}

export function AssaultMoveCrewButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.assaultState.crew()
    callback()
  }

  return <StandardButton vertical={vertical} text="man vehicle" glyph={<BoxArrowInUp />} callback={submit} />
}

export function AssaultMoveEntrenchButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.assaultState.entrench()
    callback()
  }

  return <StandardTooltipButton vertical={vertical} text="entrench" glyph={<ShieldFill />} hotkey={"E"}
                                callback={submit} />
}

export function AssaultMoveFinishButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.gameState?.finish()
    callback()
  }

  return <StandardTooltipButton vertical={vertical} text={"done assault moving"} glyph={FinishGlyph()} hotkey={"K"}
                                callback={submit} />
}

export function AssaultMoveRepairButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.assaultState.repair()
    callback()
  }

  return <StandardButton vertical={vertical} text="repair vehicle" glyph={DiceGlyph()} callback={submit} />
}

export function BreakdownButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.gameState?.finish()
    callback()
  }

  return <StandardTooltipButton vertical={vertical} text={"check for breakdown"} glyph={DiceGlyph()} hotkey={"B"}
                                callback={submit} />
}

export function CancelActionButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
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

  return <EscapeButton vertical={vertical} text={text()} glyph={CancelGlyph()} callback={submit} />
}

export function CancelMoveButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.moveState.unmove()
    callback()
  }

  return <StandardTooltipButton vertical={vertical} text={"undo last move"} glyph={<ArrowCounterclockwise />} hotkey={"Z"}
                                callback={submit} />
}

export function CloseCombatReduceButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.closeCombatState.reduceUnit()
    callback()
  }

  return <StandardTooltipButton vertical={vertical} text={"take hit"} glyph={<DashSquare />} hotkey={"H"}
                                callback={submit} />
}

export function CloseCombatSelectButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.closeCombatState.rollForCombat()
    callback()
  }

  return <StandardTooltipButton vertical={vertical} text={"resolve close combat"} glyph={DiceGlyph()} hotkey={"C"}
                                callback={submit} />
}

export function DeleteGameButton({ game, vertical, callback }: ButtonProps) {
  const navigate = useNavigate()

  const submit = () => {
    game.increaseDelete()
    if (game.deleteLevel > 1) {
      navigate("/", { replace: true })
    }
    callback()
  }

  const text = () => {
    const rc = "delete game"
    if (vertical) {
      return game.deleteLevel > 0 ? "are you sure you want to delete this game?" : rc
    }
    return rc
  }

  return <StandardButton vertical={vertical} text={text()} glyph={<XCircle />} callback={submit} />
}

export function EnemyRoutButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    if (game.gameState?.type === stateType.RoutAll) {
      game.gameState?.finish()
    } else {
      game.setGameState(new RoutAllState(game))
    }
    callback()
  }

  const text = () => {
    if (game.gameState?.type === stateType.RoutAll) {
      return "confirm rout enemy"
    } else {
      const mod = game.routCount()*2
      if (vertical) {
        return `rout enemy (3)${ mod > 0 ? ` [+${mod} rally modifier]` : "" }`
      } else {
        return `rout enemy (3)${ mod > 0 ? ` [rally +${mod}]` : "" }`
      }
    }
  }

  return <StandardTooltipButton vertical={vertical} text={text()} glyph={RoutGlyph()} hotkey={"R"}
                                callback={submit} />
}

export function FinishDeployButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.gameState?.finish()
    callback()
  }

  return <StandardTooltipButton vertical={vertical} text="done with deployment" glyph={FinishGlyph()} hotkey={"K"}
                                callback={submit} />
}

export function FireButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.setGameState(new FireState(game, false))
    callback()
  }

  return <StandardTooltipButton vertical={vertical} text="fire (2)" glyph={FireGlyph()} hotkey={"F"}
                                callback={submit} />
}

export function FireDisplaceCancelButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.fireDisplaceState.cancel()
    callback()
  }

  const text = `cancel ${ game.fireDisplaceState.path.length > 1 ? "displacement" : "elimination" }`

  return <EscapeButton vertical={vertical} text={text} glyph={CancelGlyph()} callback={submit} />
}

export function FireDisplaceConfirmButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.gameState?.finish()
    callback()
  }

  const text = ` confirm ${game.fireDisplaceState.path.length > 1 ? "displacement" : "elimination"}`

  const glyph = game.fireDisplaceState.path.length > 1 ? MoveGlyph() : EliminateGlyph()

  return <StandardTooltipButton vertical={vertical} text={text} glyph={glyph} hotkey={"K"}
                                callback={submit} />
}

export function FireDisplaceEliminateButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    if (game.fireDisplaceState.availableHexes.length > 0) {
      game.fireDisplaceState.remove = true
    } else {
      game.gameState?.finish()
    }
    callback()
  }

  return <StandardButton vertical={vertical} text="eliminate unit" glyph={EliminateGlyph()} callback={submit} />
}

export function FireFinishButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.gameState?.finish()
    callback()
  }

  return <StandardTooltipButton vertical={vertical} text="done firing" glyph={FinishGlyph()} hotkey={"K"}
                                callback={submit} />
}

export function FireOutCheckButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.gameState?.finish()
    callback()
  }

  return <StandardTooltipButton vertical={vertical} text="fire extinguish check" glyph={DiceGlyph()} hotkey={"E"}
                                callback={submit} />
}

export function FireSmokeButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.fireState.smokeToggle()
    callback()
  }

  const text = () => {
    if (game.fireState.smoke === true) { return "cancel smoke round" }
    return "smoke round"
  }

  const icon = () => {
    if (game.fireState.smoke === true) { return <CloudSlash /> }
    return <Clouds />
  }

  return <StandardTooltipButton vertical={vertical} text={text()} glyph={icon()} hotkey={"S"}
                                callback={submit} />
}

export function FireSpreadCheckButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.gameState?.finish()
    callback()
  }

  return <StandardTooltipButton vertical={vertical} text="fire spread check" glyph={DiceGlyph()} hotkey={"E"}
                                callback={submit} />
}

export function FireStartCheckButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.gameState?.finish()
    callback()
  }

  return <StandardTooltipButton vertical={vertical} text="fire start check" glyph={DiceGlyph()} hotkey={"E"}
                                callback={submit} />
}

export function InitiativeButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.gameState?.finish()
    callback()
  }

  return <StandardTooltipButton vertical={vertical} text="initiative check" glyph={DiceGlyph()} hotkey={"N"}
                                callback={submit} />
}

export function IntensiveFireButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.setGameState(new FireState(game, false))
    callback()
  }

  return <StandardTooltipButton vertical={vertical} text="intensive fire (2)" glyph={FireIntenseGlyph()} hotkey={"F"}
                                callback={submit} />
}

export function JoinSquadButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.join()
    callback()
  }

  return <StandardTooltipButton vertical={vertical} text="combine teams" glyph={<CircleFill />} hotkey={"J"}
                                callback={submit} />
}

export function MoraleCheckButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.gameState?.finish()
    callback()
  }

  return <StandardTooltipButton vertical={vertical} text="morale check" glyph={DiceGlyph()} hotkey={"E"}
                                callback={submit} />
}

export function MoveButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.setGameState(new MoveState(game))
    callback()
  }

  return <StandardTooltipButton vertical={vertical} text="move (2)" glyph={MoveGlyph()} hotkey={"M"}
                                callback={submit} />
}

export function MoveFinishButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.gameState?.finish()
    callback()
  }

  const text = `done ${ game.moveState.rushing ? "rushing" : "moving" }`

  return <StandardTooltipButton vertical={vertical} text={text} glyph={FinishGlyph()} hotkey={"K"}
                                callback={submit} />
}

export function MoveLoadToggleButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.moveState.loadToggle()
    callback()
  }

  const text = () => {
    if (game.moveState.loading === true) { return "continue moving" }
    return "pick up unit"
  }

  const icon = () => {
    if (game.moveState.loading === true) { return MoveGlyph() }
    return <BoxArrowInUp />
  }

  return <StandardTooltipButton vertical={vertical} text={text()} glyph={icon()} hotkey={"L"}
                                callback={submit} />
}

export function MoveRotateToggleButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.moveState.rotateToggle()
    callback()
  }

  const text = () => {
    if (game.moveState.rotatingTurret === true) { return "rotating turret" }
    return "rotating hull"
  }

  return <StandardTooltipButton vertical={vertical} text={text()} glyph={<ArrowClockwise />} hotkey={"T"}
                                callback={submit} />
}

export function MoveShortToggleButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.moveState.dropToggle()
    callback()
  }

  const text = () => {
    if (game.moveState.dropping === true) {
      return `continue ${ game.moveState.rushing ? "rushing" : "moving" }`
    }
    return "drop unit"
  }

  const icon = () => {
    if (game.moveState.dropping === true) { return MoveGlyph() }
    return <BoxArrowDown />
  }

  return <StandardTooltipButton vertical={vertical} text={text()} glyph={icon()} hotkey={"D"}
                                callback={submit} />
}

export function MoveSmokeToggleButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.moveState.smokeToggle()
    game.closeOverlay = true
    callback()
  }

  const text = () => {
    if (game.moveState.smoke === true) { return "stop laying smoke" }
    return "lay smoke"
  }

  const icon = () => {
    if (game.moveState.smoke === true) { return <CloudSlash /> }
    return <Clouds />
  }

  return <StandardTooltipButton vertical={vertical} text={text()} glyph={icon()} hotkey={"S"}
                                callback={submit} />
}

export function OverstackReduceButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    const state = game.gameState as OverstackState
    state.finish()
    callback()
  }

  return <StandardTooltipButton vertical={vertical} text="eliminate" glyph={EliminateGlyph()} hotkey={"H"}
                                callback={submit} />
}

export function PassButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
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

  return <StandardTooltipButton vertical={vertical} text={text()} glyph={<ArrowClockwise />} hotkey={"P"}
                                callback={submit} />
}

export function PassCancelButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.clearGameState()
    callback()
  }

  return <EscapeButton vertical={vertical} text="cancel pass" glyph={CancelGlyph()} callback={submit} />
}

export function PrecipCheckButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.gameState?.finish()
    callback()
  }

  return <StandardTooltipButton vertical={vertical} text="check precipitation" glyph={DiceGlyph()} hotkey={"E"}
                                callback={submit} />
}

export function RallyButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.gameState?.finish()
    callback()
  }

  const text = game.scenario.map.selection?.unit.isBroken ? "rally" : "repair"

  return <StandardTooltipButton vertical={vertical} text={text} glyph={DiceGlyph()} hotkey={"R"}
                                callback={submit} />
}

export function RallyPassButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    const state = game.gameState as RallyState
    state.pass()
    callback()
  }

  return <StandardTooltipButton vertical={vertical} text="pass" glyph={<ArrowClockwise />} hotkey={"P"}
                                callback={submit} />
}

export function ReactionFireButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.setGameState(new FireState(game, true))
    callback()
  }

  return <StandardTooltipButton vertical={vertical} text="reaction fire (2)" glyph={FireGlyph()} hotkey={"F"}
                                callback={submit} />
}

export function ReactionIntensiveFireButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.setGameState(new FireState(game, true))
    callback()
  }

  return <StandardTooltipButton vertical={vertical} text="intensive reaction fire (2)"
                                glyph={FireIntenseGlyph()} hotkey={"F"} callback={submit} />
}

export function ReactionPassButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.gameState?.finish()
    callback()
  }

  return <StandardTooltipButton vertical={vertical} text="skip reaction fire"
                                glyph={<ArrowClockwise />} hotkey={"R"} callback={submit} />
}

export function ResignButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.increaseResignation()
    callback()
  }

  const text = () => {
    let rc = "resign"
    if (vertical) {
      rc = game.resignationLevel > 0 ? "are you sure you want to resign?" : rc
      rc = game.resignationLevel > 1 ? "are you really sure you want to resign? " : rc
    }
    return rc
  }

  return <StandardButton vertical={vertical} text={text()} glyph={<XCircle />} callback={submit} />
}

export function ResignCancelButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.clearResignation()
    game.clearDelete()
    callback()
  }

  return <StandardButton vertical={vertical} text="cancel" glyph={CancelGlyph()} callback={submit} />
}

export function RoutButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.setGameState(new RoutState(game, true))
    callback()
  }

  return <StandardTooltipButton vertical={vertical} text="rout (1)" glyph={RoutGlyph()} hotkey="R"
                                callback={submit} />
}

export function RoutCheckButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.gameState?.finish()
    callback()
  }

  return <StandardTooltipButton vertical={vertical} text="rout morale check" glyph={DiceGlyph()} hotkey={"E"}
                                callback={submit} />
}

export function RoutEliminateButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.gameState?.finish()
    callback()
  }

  return <StandardButton vertical={vertical} text="eliminate unit" glyph={RoutGlyph()} callback={submit} />
}

export function RushButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.setGameState(new MoveState(game))
    callback()
  }

  return <StandardTooltipButton vertical={vertical} text="rush (2)" glyph={MoveRushGlyph()} hotkey={"M"}
                                callback={submit} />
}

export function ShortMoveButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.gameState?.finish()
    callback()
  }

  return <StandardButton vertical={vertical} text="stay with broken units"
                         glyph={<ArrowCounterclockwise />} callback={submit} />
}

export function SkipShortMoveButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.shortMoveState.skip()
    callback()
  }

  return <StandardButton vertical={vertical} text="complete move"
                         glyph={<ArrowClockwise />} callback={submit} />
}

export function SmokeCheckButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.gameState?.finish()
    callback()
  }

  return <StandardTooltipButton vertical={vertical} text="smoke dispersion check" glyph={DiceGlyph()} hotkey={"E"}
                                callback={submit} />
}

export function SniperButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.gameState?.finish()
    callback()
  }

  return <StandardTooltipButton vertical={vertical} text="sniper check" glyph={DiceGlyph()} hotkey={"E"}
                                callback={submit} />
}

export function SplitSquadButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.split()
    callback()
  }

  return <StandardTooltipButton vertical={vertical} text="split squad" glyph={<CircleHalf />} hotkey={"X"}
                                callback={submit} />
}

export function ToggleSponsonButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.fireState.sponsonToggle()
    callback()
  }

  const text = () => {
    return game.fireState.sponson ? "use turret" : "use hull gun"
  }

  return <StandardTooltipButton vertical={vertical} text={text()} glyph={FireGlyph()} hotkey={"T"}
                                callback={submit} />
}

export function UndoButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.executeUndo(false)
    callback()
  }

  return <StandardTooltipButton vertical={vertical} text="undo" glyph={<ArrowCounterclockwise />} hotkey={"Z"}
                                callback={submit} />
}

export function UndeployButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.undeploy()
    callback()
  }

  return <StandardTooltipButton vertical={vertical} text="undeploy" glyph={<ArrowCounterclockwise />} hotkey={"U"}
                                callback={submit} />
}

export function UnselectButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.scenario.map.clearAllSelections()
    callback()
  }

  return <EscapeButton vertical={vertical} text="clear selection" glyph={CancelGlyph()} callback={submit} />
}

export function WeatherCheckButton({ game, vertical, callback }: ButtonProps) {
  const submit = () => {
    game.gameState?.finish()
    callback()
  }

  const text = () => {
    return `wind ${ game.checkWindDirection ? "direction" : "speed" } check`
  }

  return <StandardTooltipButton vertical={vertical} text={text()} glyph={DiceGlyph()} hotkey={"E"}
                                callback={submit} />
}

interface StandardButtonProps {
  vertical: boolean,
  text: string,
  glyph: JSX.Element,
  callback: () => void;
}

interface StandardTooltipButtonProps {
  vertical: boolean,
  text: string,
  glyph: JSX.Element,
  hotkey: string,
  callback: () => void;
}

function StandardButton({vertical, text, glyph, callback}: StandardButtonProps) {
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    callback()
  }

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
              {glyph}
            </button>
          </OverlayTrigger> :
          <button type="submit" className="custom-button nowrap">
            {glyph} {text}
          </button>
        }
      </div>
    </form>
  )
}

function StandardTooltipButton({vertical, text, glyph, hotkey, callback}: StandardTooltipButtonProps) {
  const submit = () => { callback() }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    submit()
  }

  const hk = localStorage.getItem("hotkeys") ?? ""

  useEffect(() => {
    if (hk !== "") {
      const hotKeyListener = (e: KeyboardEvent) => {
        if ((e.key === hotkey.toLowerCase() && hk === "A" && document.activeElement?.tagName !== "INPUT") ||
            (e.key === hotkey.toLowerCase() && e.ctrlKey && hk === "C")) {
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

  const hkstring = () => {
    if (hk === "") { return "" }
    if (hk === "C") { return ` ^${hotkey}` }
    if (hk === "A") { return `${hotkey}` }
  }

  const buttonTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      { text }{ hk === "A" ? ` [${hotkey}]`: hkstring() }
    </Tooltip>
  )

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        { vertical ?
          <OverlayTrigger placement="bottom" overlay={buttonTooltip}
                          delay={{ show: 0, hide: 0 }} >
            <button type="submit" className="custom-button custom-button-balance nowrap">
              {glyph}
            </button>
          </OverlayTrigger> :
          <button type="submit" className="custom-button nowrap">
            {glyph} {text} {
              hk !== "" ?
                <span className={`button-hotkey${hk === "A" ? " ml025em": ""}`}>
                  {hkstring()}
                </span> : ""
            }
          </button>
        }
      </div>
    </form>
  )
}

function EscapeButton({vertical, text, glyph, callback}: StandardButtonProps) {
  const hotkey = "ESC"
  const submit = () => { callback() }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    submit()
  }

  useEffect(() => {
    if (localStorage.getItem("hotkeys") !== "") {
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

  const buttonTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      { text }{localStorage.getItem("hotkeys") !== "" ? ` [${hotkey}]` : "" }
    </Tooltip>
  )

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        { vertical ?
          <OverlayTrigger placement="bottom" overlay={buttonTooltip}
                          delay={{ show: 0, hide: 0 }} >
            <button type="submit" className="custom-button custom-button-balance nowrap">
              {glyph}
            </button>
          </OverlayTrigger> :
          <button type="submit" className="custom-button nowrap">
            {glyph} {text} {
              localStorage.getItem("hotkeys") !== "" ? <span className="button-hotkey ml025em">{hotkey}</span> : ""
            }
          </button>
        }
      </div>
    </form>
  )
}
