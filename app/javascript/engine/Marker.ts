import { Direction, MarkerType, NumberBoolean, WeatherType, WindType, markerType, weatherType, windType } from "../utilities/commonTypes"
import { counterElite, counterGreen, counterRed, markerYellow } from "../utilities/graphics";
import { markerHelpText } from "./support/help";

// mk: marker
// v: value

export type MarkerData = {
  type: MarkerType;
  i?: string;
  subtype?: WeatherType | WindType;
  v?: number | string;
  v2?: number | string;
  nation?: string;
  player_nation?: string;
  facing?: Direction;
  rotates?: NumberBoolean;

  ft?: 0;
  mk: 1;
}

export default class Marker {
  type: MarkerType;
  nationalIcon?: string;
  subType?: WeatherType | WindType;
  value?: number | string;
  value2?: number | string;
  nation: string;
  playerNation: string;
  facing: Direction;
  rotates: boolean;

  constructor(data: MarkerData) {
    this.type = data.type
    this.nationalIcon = data.i
    this.subType = data.subtype
    this.value = data.v
    this.value2 = data.v2
    this.nation = data.nation || "none"
    this.playerNation = data.player_nation || this.nation
    this.facing = data.facing || 1
    this.rotates = !!data.rotates || false
  }

  name = ''
  turreted = false
  rotatingVehicleMount = false
  backwardsMount = false
  isWreck = false
  isBroken = false
  isPinned = false
  isExhausted = false
  isTired = false;
  isActivated = false
  jammed = false
  weaponBroken = false
  turretJammed = false
  immobilized = false
  turretFacing: Direction = 1
  hullArmor = false
  turretArmor = false
  sponson = false
  size = 0
  towSize = undefined
  canTow = false
  transport = 0
  smallName = 0
  baseMorale = 0
  currentMorale = 0
  baseFirepower = 0
  currentFirepower = 0
  minimumRange = 0
  currentRange = 0;
  currentMovement = 0;
  breakWeaponRoll = 0
  breakDestroysWeapon = false
  breakdownRoll = 0
  repairRoll = 0
  currentGunHandling = 0
  currentLeadership = 0
  sniperRoll = 0
  currentSmokeCapable = false
  armored = false
  topOpen = false
  isTracked = false
  isWheeled = false
  amphibious = false
  crewed = false;
  antiTank = false
  fieldGun = false
  offBoard = false
  singleFire = false
  assault = false
  engineer = false
  ignoreTerrain = false
  targetedRange = false
  rapidFire = false
  noFire = false
  rotatingMount = false;
  selected = false

  canHandle = false
  canCarrySupport = false
  uncrewedSW = false

  get hindrance(): number { return 0 }

  get blocksLos(): boolean { return false }

  get isMarker(): boolean {
    return true
  }

  get isFeature(): boolean {
    return false
  }

  get isHull(): boolean {
    return [markerType.TrackedHull, markerType.WheeledHull].includes(this.type)
  }

  get isMinor(): boolean {
    return [markerType.Activated, markerType.Exhausted, markerType.Tired].includes(this.type)
  }

  get hideOverlayRotation(): boolean {
    return !this.isHull
  }

  red = counterRed
  yellow = markerYellow

  get textColor(): string {
    if (this.type === markerType.GreenCrew) { return "black" }
    if (this.type === markerType.EliteCrew) { return "white" }
    if (this.type === markerType.Tired || this.type === markerType.Activated ||
        this.type === markerType.Exhausted || this.type === markerType.Turn ) { return "black" }
    if (this.type === markerType.Wind) {
      if (this.subType === windType.Calm) { return "black" }
      return "white"
    }
    if (this.type === markerType.Weather) {
      if (this.subType === weatherType.Rain || this.subType === weatherType.Fog) {
        return "white"
      }
      return "black"
    }
    return "white"
  }

  get color(): string {
    if (this.type === markerType.GreenCrew) { return counterGreen }
    if (this.type === markerType.EliteCrew) { return counterElite }
    if (this.type === markerType.Tired || this.type === markerType.Activated ||
        this.type === markerType.Exhausted) { return this.yellow }
    if (this.type === markerType.Wind) {
      if (this.subType === windType.Calm) { return "#DDF" }
      if (this.subType === windType.Breeze) { return "#AAE" }
      if (this.subType === windType.Moderate) { return "#77B" }
      if (this.subType === windType.Strong) { return "#448" }
    }
    if (this.type === markerType.Weather) {
      if (this.subType === weatherType.Dry) { return "#DDF" }
      if (this.subType === weatherType.Fog) { return "#777" }
      if (this.subType === weatherType.Rain) { return "#44D" }
      if (this.subType === weatherType.Snow) { return "#DFDFDF" }
      if (this.subType === weatherType.Sand) { return "#DD8" }
      if (this.subType === weatherType.Dust) { return "#DB9" }
    }
    return this.red
  }

  get displayText(): string[] {
    if (this.type === markerType.GreenCrew) { return ["green", "crew"] }
    if (this.type === markerType.EliteCrew) { return ["elite", "crew"] }
    if (this.type === markerType.Tired) { return ["tired"] }
    if (this.type === markerType.Pinned) { return ["pinned"] }
    if (this.type === markerType.Activated) { return ["activated"] }
    if (this.type === markerType.Exhausted) { return ["exhausted"] }
    if (this.type === markerType.Jammed) { return ["weapon", "jammed"] }
    if (this.type === markerType.WeaponBroken) { return ["weapon", "broken"] }
    if (this.type === markerType.TurretJammed) { return ["turret", "jammed"] }
    if (this.type === markerType.Immobilized) { return ["immobilized"] }
    if (this.type === markerType.Wind) {
      if (this.subType === windType.Calm) { return ["calm"] }
      if (this.subType === windType.Breeze) { return ["breeze"] }
      if (this.subType === windType.Moderate) { return ["moderate"] }
      if (this.subType === windType.Strong) { return ["strong"] }
    }
    if (this.type === markerType.Weather) {
      if (this.subType === weatherType.Dry) { return ["dry"] }
      if (this.subType === weatherType.Fog) { return ["fog"] }
      if (this.subType === weatherType.Rain) { return ["rain"] }
      if (this.subType === weatherType.Snow) { return ["snow"] }
      if (this.subType === weatherType.Sand) { return ["sand"] }
      if (this.subType === weatherType.Dust) { return ["dust"] }
    }
    if (this.type === markerType.Turn) { return ["turn"] }
    return []
  }

  get subText(): string[] | false {
    if (this.type === markerType.GreenCrew) { return ["", "-1", "targeting"] }
    if (this.type === markerType.EliteCrew) { return ["", "+1", "targeting"] }
    if (this.type === markerType.Weather) {
      if (this.subType === weatherType.Dry) { return ["10% fe", "", ""] }
      if (this.subType === weatherType.Fog) { return ["30% fe", "", ""] }
      if (this.subType === weatherType.Sand) { return ["30% fe", "", ""] }
      if (this.subType === weatherType.Dust) { return ["", "+10% fs", ""] }
      const fe = this.subType === weatherType.Rain ? "60% fe" : "40% fe"
      if (!this.value) { return [fe, "", ""] }
      return [fe, `${this.value}0% chance`, ""]
    }
    if (this.type === markerType.Wind) {
      const text = []
      if (this.value) {
        text.push("variable")
      } else {
        text.push("")
      }
      if (this.subType === windType.Calm) {
        text.push("")
        text.push("20% sd")
      } else if (this.subType === windType.Breeze) {
        text.push("10% fs")
        text.push("40% sd")
      } else if (this.subType === windType.Moderate) {
        text.push("20% fs")
        text.push("60% sd")
      } else if (this.subType === windType.Strong) {
        text.push("40% fs")
        text.push("90% sd")
      }
      return text
    }
    return false
  }

  get icon(): string | false {
    if (this.type === markerType.WheeledHull) { return "wheeled-hull" }
    if (this.type === markerType.TrackedHull) { return "tracked-hull" }
    if (this.type === markerType.Initiative) { return this.nationalIcon || this.nation }
    return false
  }

  get fullIcon(): boolean {
    return true
  }

  get helpText(): string[] {
    return markerHelpText(this)
  }

  select() {
    // does nothing, can't select markers
  }
}
