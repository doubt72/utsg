import React, { useEffect, useState } from "react";
import Game from "../../../engine/Game";
import JoinButton from "./buttons/JoinButton";
import LeaveButton from "./buttons/LeaveButton";
import StartButton from "./buttons/StartButton";
import actionsAvailable from "../../../engine/control/actionsAvailable";
import HelpButton from "./buttons/HelpButton";
import KickButton from "./buttons/KickButton";
import GameOverMenuButton from "./buttons/GameOverMenuButton";
import { ClockHistory, ExclamationCircle, ExclamationTriangle, HexagonHalf } from "react-bootstrap-icons";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";
import {
  AssaultMoveAbandonButton, AssaultMoveButton, AssaultMoveClearButton, AssaultMoveCrewButton,
  AssaultMoveEntrenchButton, AssaultMoveFinishButton, AssaultMoveRepairButton, BreakdownButton,
  CancelActionButton, CancelMoveButton, CloseCombatReduceButton, CloseCombatSelectButton,
  DeleteGameButton, EnemyRoutButton, FinishDeployButton, FireButton, FireDisplaceCancelButton,
  FireDisplaceConfirmButton, FireDisplaceEliminateButton, FireFinishButton, FireOutCheckButton,
  FireSmokeButton, FireSpreadCheckButton, FireStartCheckButton, InitiativeButton, IntensiveFireButton,
  JoinSquadButton, MoraleCheckButton, MoveButton, MoveFinishButton, MoveLoadToggleButton,
  MoveRotateToggleButton, MoveShortToggleButton, MoveSmokeToggleButton, OverstackReduceButton,
  PassButton, PassCancelButton, PrecipCheckButton, RallyButton, RallyPassButton, ReactionFireButton,
  ReactionIntensiveFireButton, ReactionPassButton, ResignButton, ResignCancelButton, RoutButton,
  RoutCheckButton, RoutEliminateButton, RushButton, ShortMoveButton, SkipShortMoveButton,
  SmokeCheckButton, SniperButton, SplitSquadButton, ToggleSponsonButton, UndeployButton,
  UndoButton, UnselectButton, WeatherCheckButton
} from "./buttons/ControlButtons";
import ReplayButton from "./buttons/ReplayButton";

interface GameControlsProps {
  game: Game;
  update: number;
  vertical: boolean;
  callback: () => void;
}

export default function GameControls({
  game, update, vertical, callback }: GameControlsProps
) {
  const [controls, setControls] = useState<JSX.Element[]>([])
  const [specialRules, setSpecialRules] = useState<JSX.Element | undefined>(undefined)
  const [internalUpdate, setInternalUpdate] = useState(0)

  useEffect(() => {
    if (localStorage.getItem("hotkeys") === "true") {
      const hotKeyListener = (e: KeyboardEvent) => {
        console.log(`${e.key} c:${e.ctrlKey} a:${e.altKey} s:${e.shiftKey}`)
      }
      window.addEventListener('keyup', hotKeyListener)

      return () => {
        window.removeEventListener('keyup', hotKeyListener)
      }
    }
  }, [])

  useEffect(() => {
    if (!game.id) { return }
    displayActions()
  }, [game, game.lastActionIndex, internalUpdate, update])

  useEffect(() => {
    if (!game.scenario || game.scenario.specialRules.length < 1) { return }
    const tooltip = (props: TooltipProps) => (
      <Tooltip className="tooltip-game" {...props}>
        Special Rules:
        <ul>
          {
            game.scenario.specialRulesList.map((r,i) => {
              return (
                <li key={i}>{r}</li>
              )
            })
          }
        </ul>
      </Tooltip>
    )
    setSpecialRules(
      <OverlayTrigger placement="bottom" overlay={tooltip}
                      delay={{ show: 0, hide: 0 }} >
        <div className="special-rules"><ExclamationCircle /></div>
      </OverlayTrigger>
    )
  }, [game])

  const callAllBack = () => {
    setInternalUpdate(s => s+1)
    callback()
  }

  const syncTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      synchronizing (you may need to reload this page)
    </Tooltip>
  )

  const waitTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      waiting for opponent to take an action
    </Tooltip>
  )

  const deployTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      open unit panel to deploy units
    </Tooltip>
  )

  const unknownTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      waiting for opponent to take an action
    </Tooltip>
  )

  const displayActions = () => {
    const user = localStorage.getItem("username")
    const actions = actionsAvailable(game, user as string)
    actions.push({ type: "help" })
    setControls(actions.map((a, i) => {
      if (a.type === "sync") {
        if (vertical) {
          return (
            <OverlayTrigger key={i} placement="bottom" overlay={syncTooltip}
                            delay={{ show: 0, hide: 0 }} >
              <div className="game-control-text-vertical"><ExclamationTriangle /></div>
            </OverlayTrigger>
          )
        } else {
          return (
            <div className="mt05em mb05em mr05em ml05em" key={i}>
              synchronizing (you may need to reload this page)
            </div>
          )
        }
      } else if (a.type === "wait") {
        if (vertical) {
          return (
            <OverlayTrigger key={i} placement="bottom" overlay={waitTooltip}
                            delay={{ show: 0, hide: 0 }} >
              <div className="game-control-text-vertical"><ClockHistory /></div>
            </OverlayTrigger>
          )
        } else {
          return <div className="mt05em mb05em mr05em ml05em" key={i}>{a.message}</div>
        }
      } else if (a.type === "none") {
        if (vertical) {
          return (<div key={i}></div>
          )
        } else {
          return <div className="mt05em mb05em mr05em ml05em" key={i}>{a.message}</div>
        }
      } else if (a.type === "undo") {
        return <UndoButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "join") {
        return <JoinButton gameId={game.id} key={i} vertical={vertical} />
      } else if (a.type === "leave") {
        return <LeaveButton gameId={game.id} key={i} vertical={vertical} />
      } else if (a.type === "start") {
        return <StartButton gameId={game.id} key={i} vertical={vertical} />
      } else if (a.type === "kick") {
        return <KickButton gameId={game.id} key={i} vertical={vertical} />
      } else if (a.type === "deploy") {
        if (vertical) {
          return (
            <OverlayTrigger key={i} placement="bottom" overlay={deployTooltip}
                            delay={{ show: 0, hide: 0 }} >
              <div className="game-control-text-vertical"><HexagonHalf /></div>
            </OverlayTrigger>
          )
        } else {
          return <div className="mt05em mb05em mr05em ml05em" key={i}>deploy units</div>
        }
      } else if (a.type === "undeploy") {
        return <UndeployButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "finish_deploy") {
        return <FinishDeployButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "split_squad") {
        return <SplitSquadButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "join_squad") {
        return <JoinSquadButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "rally") {
        return <RallyButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "rally_pass") {
        return <RallyPassButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "precip_check") {
        return <PrecipCheckButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "unselect") {
        return <UnselectButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "pass") {
        return <PassButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "pass_cancel") {
        return <PassCancelButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "reaction_fire") {
        return <ReactionFireButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "reaction_intensive_fire") {
        return <ReactionIntensiveFireButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "reaction_pass") {
        return <ReactionPassButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "enemy_rout") {
        return <EnemyRoutButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "fire") {
        return <FireButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "fire_finish") {
        return <FireFinishButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "fire_toggle_sponson") {
        return <ToggleSponsonButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "fire_smoke") {
        return <FireSmokeButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "intensive_fire") {
        return <IntensiveFireButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "morale_check") {
        return <MoraleCheckButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "short_move") {
        return <ShortMoveButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "skip_short_move") {
        return <SkipShortMoveButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "initiative") {
        return <InitiativeButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "fire_start_check") {
        return <FireStartCheckButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "sniper") {
        return <SniperButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "move") {
        return <MoveButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "move_undo") {
        return <CancelMoveButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "move_finish") {
        return <MoveFinishButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "move_rotate_toggle") {
        return <MoveRotateToggleButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "move_shortdrop_toggle") {
        return <MoveShortToggleButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "move_load_toggle") {
        return <MoveLoadToggleButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "move_smoke_toggle") {
        return <MoveSmokeToggleButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "breakdown") {
        return <BreakdownButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "rush") {
        return <RushButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "assault_move") {
        return <AssaultMoveButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "assault_move_finish") {
        return <AssaultMoveFinishButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "assault_move_clear") {
        return <AssaultMoveClearButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "assault_move_entrench") {
        return <AssaultMoveEntrenchButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "assault_move_abandon") {
        return <AssaultMoveAbandonButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "assault_move_repair") {
        return <AssaultMoveRepairButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "assault_move_crew") {
        return <AssaultMoveCrewButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "cancel_action") {
        return <CancelActionButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "rout") {
        return <RoutButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "rout_eliminate") {
        return <RoutEliminateButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "rout_check") {
        return <RoutCheckButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "close_combat_select") {
        return <CloseCombatSelectButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "close_combat_reduce") {
        return <CloseCombatReduceButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "overstack_reduce") {
        return <OverstackReduceButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "smoke_check") {
        return <SmokeCheckButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "fire_out_check") {
        return <FireOutCheckButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "fire_spread_check") {
        return <FireSpreadCheckButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "weather_check") {
        return <WeatherCheckButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "fire_displace_eliminate") {
        return <FireDisplaceEliminateButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "fire_displace_confirm") {
        return <FireDisplaceConfirmButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "fire_displace_cancel") {
        return <FireDisplaceCancelButton game={game} key={i} callback={callAllBack} vertical={vertical} />
      } else if (a.type === "menu") {
        return <GameOverMenuButton key={i} vertical={vertical} />
      } else if (a.type === "replay") {
        return <ReplayButton key={i} vertical={vertical} gameId={game.id} />
      } else if (a.type === "help") {
        return <HelpButton game={game} key={i} />
      } else {
        if (vertical) {
          console.log(`unknown action ${a.type}`)
          return (
            <OverlayTrigger key={i} placement="bottom" overlay={unknownTooltip}
                            delay={{ show: 0, hide: 0 }} >
              <div className="game-control-text-vertical"><ExclamationTriangle /></div>
            </OverlayTrigger>
          )
        } else {
          return <div className="mt05em mb05em mr05em" key={i}>unknown action {a.type}</div>
        }
      }
    }))
  }

  return (
    <div className={ vertical ? "flex-vertical" : "flex" } >
      {controls}
      {specialRules}
      <div className="flex-fill"></div>
      { (game.state !== "in_progress" || game.currentUser !== localStorage.getItem("username")) ? "" :
        game.resignationLevel > 0 ?
        <div className={ `${vertical ? "flex-vertical" : "flex"} nowrap` }>
          { vertical ? "" :
            <div className="mt05em mb05em mr05em ml05em" >
              { game.resignationLevel > 1 ? "Are you really sure? " : "Are you sure you want to resign? " }
            </div>
          }
          <ResignButton game={game} callback={callAllBack} vertical={vertical} />
          <ResignCancelButton game={game} callback={callAllBack} vertical={vertical} />
        </div> :
        <div>
          <ResignButton game={game} callback={callAllBack} vertical={vertical} />
        </div>
      }
      { (game.state === "in_progress" || game.state === "complete" ||
         game.ownerName !== localStorage.getItem("username")) ? "" :
        game.deleteLevel > 0 ?
        <div className={ `${vertical ? "flex-vertical" : "flex"} nowrap` }>
          { vertical ? "" :
            <div className="mt05em mb05em mr05em ml05em" >
              Are you really sure?
            </div>
          }
          <DeleteGameButton game={game} callback={callAllBack} vertical={vertical} />
          <ResignCancelButton game={game} callback={callAllBack} vertical={vertical} />
        </div> :
        <div>
          <DeleteGameButton game={game} callback={callAllBack} vertical={vertical} />
        </div>
      }
    </div>
  )
}
