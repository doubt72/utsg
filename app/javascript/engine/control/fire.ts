import { Coordinate, hexOpenType, HexOpenType } from "../../utilities/commonTypes";
import { hexDistance } from "../../utilities/utilities";
import Map from "../Map";
import { leadershipRange } from "./select";

export function openHexFiring(map: Map, from: Coordinate, to: Coordinate): HexOpenType {
  if (!map.game?.gameActionState?.fire) { return hexOpenType.Closed }
  const fire = map.game.gameActionState.fire
  if (!fire.doneRotating) {
    return hexOpenType.Closed
  }
  if (!fire.doneSelect) {
    const leadership = leadershipRange(map.game)
    if (!leadership) {
      if (from.x === to.x && from.y === to.y) { return hexOpenType.Open }
    } else {
      if (hexDistance(from, to) <= leadership) { return hexOpenType.Open }
    }
  } else {
    // Any hex in range of all units
    // Show red if all area or untargeted
  }
  return hexOpenType.Closed
}