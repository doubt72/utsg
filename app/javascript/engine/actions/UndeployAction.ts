import { Coordinate } from "../../utilities/commonTypes";
import { formatCoordinate, formatNation } from "../../utilities/graphics";
import DeployState from "../control/state/DeployState";
import Game from "../Game";
import { GameActionPath, GameActionData, GameActionReinforcementUnit } from "../GameAction";
import Unit from "../Unit";
import BaseAction from "./BaseAction";

export default class UndeployAction extends BaseAction {
  target: Coordinate;
  rTurn: number;
  rKey: string;
  rId: string;

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
  }

  get type(): string { return "undeploy" }

  get htmlValue(): string {
    const name = this.player === 1 ?
      this.game.scenario.alliedReinforcements[this.rTurn][this.rKey].counter.name :
      this.game.scenario.axisReinforcements[this.rTurn][this.rKey].counter.name
    return `undeployed ${formatNation(this.game, this.player)} ` +
      `unit: ${formatNation(this.game, this.player,name)} from ${formatCoordinate(this.target)}`
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
    this.game.setGameState(new DeployState(this.game, this.rTurn, this.rKey))
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
    map.addCounter(this.target, uf)
  }
}
