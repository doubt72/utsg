import { Coordinate } from "../../utilities/commonTypes";
import { formatCoordinate, formatNation } from "../../utilities/graphics";
import Game from "../Game";
import { GameActionPath, GameActionData, GameActionReinforcementUnit } from "../GameAction";
import Unit from "../Unit";
import BaseAction from "./BaseAction";
import StackingActionError from "./StackingActionError";

export default class UndeployAction extends BaseAction {
  target: Coordinate;
  rTurn: number;
  rKey: string;
  rId: string;
  rName: string;
  index: number;

  constructor(data: GameActionData, game: Game, index: number) {
    super(data, game, index)

    this.validate(data.data.deploy)
    const deploy = data.data.deploy as GameActionReinforcementUnit[]
    this.validate(deploy[0])
    this.validate(data.data.path)
    const path = data.data.path as GameActionPath[]
    this.validate(path[0])

    this.target = new Coordinate(path[0].x, path[0].y)
    this.rKey = deploy[0].key
    this.rTurn = deploy[0].turn
    this.rId = deploy[0].id
    this.rName = deploy[0].name
    this.index = deploy[0].index ?? 0
  }

  get type(): string { return "undeploy" }

  get htmlValue(): string {
    return `undeployed ${formatNation(this.game, this.player)} ` +
      `unit: ${formatNation(this.game, this.player, this.rName)} from ${formatCoordinate(this.target)}`
  }

  get undoPossible() { return true }

  mutateGame(): void {
    const scenario = this.game.scenario

    if (this.player === 1) {
      scenario.replaceAlliedReinforcement(this.rTurn, this.rKey)
    } else {
      scenario.replaceAxisReinforcement(this.rTurn, this.rKey)
    }
    this.map.removeCounter(this.target, this.rId)
    const units = this.map.units[this.target.y][this.target.x]
    if (units.length > this.index) {
      const u = units[this.index] as Unit
      const last = this.index > 0 ? units[this.index - 1] as Unit : undefined
      if (u.uncrewedSW) {
        if (!last || !last.canCarrySupport) {
          throw new StackingActionError(
            `${u.name} is no longer assigned to an operator; it ` +
              "must be stacked on a squad, team, or leader to be assigned."
          )
        }
      } else if (u.crewed) {
        if (!last || !last.canHandle && !(last.canTow && last.size >= (u.towSize ?? 0))) {
          throw new StackingActionError(
            `${u.name} is no longer assigned to an operator or vehicle; it ` +
              "must be placed on a squad or team to be assigned, or on a vehicle large enough " +
              "to tow it."
          )

        }
      }
    }
  }

  undo(): void {
    const scenario = this.game.scenario
    const map = scenario.map

    const turn = this.rTurn

    const uf = this.player === 1 ? scenario.takeAlliedReinforcement(turn, this.rKey) :
                                   scenario.takeAxisReinforcement(turn, this.rKey)
    if (!uf.isFeature) {
      (uf as Unit).playerNation = this.player === 1 ? scenario.alliedFactions[0] : scenario.axisFactions[0]
    }
    uf.id = this.rId
    map.addCounter(this.target, uf, this.index)
  }
}
