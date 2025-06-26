import React, { useEffect, useState } from "react";
import { EyeFill, Hexagon, HexagonFill, Stack } from "react-bootstrap-icons";
import { roundedRectangle } from "../utilities/graphics";
import Map from "../engine/Map";
import {
  BaseTerrainType, BorderType, BuildingShape, Coordinate, RoadType, StreamType, TerrainType, weatherType, windType
} from "../utilities/commonTypes";
import MapHex from "../components/game/map/MapHex";
import Hex from "../engine/Hex";
import MapHexDetail from "../components/game/map/MapHexDetail";
import MapHexPatterns from "../components/game/map/MapHexPatterns";

type PickTerrain = {
  m?: BaseTerrainType, t?: TerrainType, b?: BorderType, r?: RoadType, s?: StreamType, rr?: boolean, sh?: BuildingShape,
}

export default function TerrainSection() {
  const [currentState, setCurrentState] = useState<PickTerrain>({ m: "g", t: "o" })
  const [currentTerrain, setCurrentTerrain] = useState<string>("open")

  const [updateSection, setUpdateSection] = useState<JSX.Element | undefined>()

  const [map, setMap] = useState<Map | undefined>()

  const lookup: { [index: string]: PickTerrain } = {
    open: { m: "g", t: "o" },
    snow: { m: "s", t: "o" },
    mud: { m: "m", t: "o" },
    sand: { m: "g", t: "s", sh: undefined },
    soft: { m: "g", t: "t", sh: undefined },
    forest: { m: "g", t: "f", b: undefined, s: undefined, rr: false, sh: undefined },
    brush: { m: "g", t: "b", b: undefined, r: undefined, s: undefined, rr: false, sh: undefined },
    orchard: { m: "g", t: "d", r: undefined, s: undefined, rr: false, sh: undefined },
    field: { m: "g", t: "g", r: undefined, s: undefined, rr: false, sh: undefined },
    marsh: { m: "g", t: "m", b: undefined, r: undefined, rr: false, sh: undefined },
    jungle: { m: "g", t: "j", b: undefined, s: undefined, rr: false, sh: undefined },
    palm: { m: "g", t: "p", b: undefined, r: undefined, s: undefined, rr: false, sh: undefined },
    rough: { m: "g", t: "r", b: undefined, r: undefined, s: undefined, rr: false, sh: undefined },
    debris: { m: "g", t: "x", b: undefined, r: undefined, s: undefined, rr: false, sh: undefined },
    water: { m: "g", t: "w", b: undefined, r: undefined, s: undefined, rr: false, sh: undefined },
    shallow: { m: "g", t: "y", b: undefined, r: undefined, s: undefined, rr: false, sh: undefined },
    road: { t: "o", r: "t", s: undefined, rr: false },
    dirt: { t: "o", r: "d", s: undefined, rr: false },
    path: { t: "o", r: "p", s: undefined, rr: false },
    air: { t: "o", r: "a", s: undefined, rr: false },
    rail: { t: "o", r: undefined, s: undefined, rr: true },
    fence: { t: "o", b: "f" },
    wall: { t: "o", b: "w" },
    bocage: { t: "o", b: "b" },
    cliff: { t: "o", b: "c" },
    stream: { t: "o", s: "s", r: undefined, rr: false },
    gully: { t: "o", s: "g", r: undefined, rr: false },
    trench: { t: "o", s: "t", r: undefined, rr: false },
    house: { t: "o", sh: "l" },
    silo: { t: "o", sh: "c" },
  }

  useEffect(() => {
    const map = new Map({
      layout: [2, 2, "x"], axis_dir: 4, allied_dir: 1,
      start_weather: weatherType.Dry, base_weather: weatherType.Dry, precip: [0, weatherType.Rain],
      wind: [windType.Calm, 1, false],
      base_terrain: "g",
      hexes: [[{ t: "o" }, { t: "o" }], [{ t: "o" }, { t: "o" }]]
    })
    map.showCoords = false
    setMap(map)
  }, [])

  useEffect(() => {
    setTerrain(currentTerrain)
  }, [map])

  const setTerrain = (key: string) => {
    const look = lookup[key]
    if (!look) { return }
    if (look.t === "f" && currentState.r === "a") { look.r = undefined }
    if (look.t === "m" && currentState.s !== "s") { look.s = undefined }
    if (look.t === "g" && currentState.b !== "f") { look.b = undefined }
    if (look.b && currentState.r === "a") { look.r = undefined }
    if (look.r === "a" && currentState.b) { look.b = undefined }
    setCurrentTerrain(key)
    setCurrentState(s => { return { ...s, ...look }})
  }

  const terrainHelp = () => {
    if (!map) { return }
    const sections: JSX.Element[] = []
    let index = 0
    const attr = (map.hexAt(new Coordinate(0, 0)) as Hex).terrain.baseAttr
    const battr = (map.hexAt(new Coordinate(0, 1)) as Hex).terrain.borderAttr
    const sattr = (map.hexAt(new Coordinate(1, 1)) as Hex).terrain.streamAttr
    sections.push(<p key={index++}>
      The base terrain is <strong>
        {attr.name}{map.baseTerrain !== "g" ? ` (${map.baseTerrainName})`: ""}
      </strong> which { attr.move === 0 ? "is impassble to all units": `has a movement cost of ${map.baseTerrain !== "g" ? 2 : attr.move }` }
      {(!attr.vehicle || attr.vehicle === "amph") && attr.move !== 0 ? ", and is impassible to vehicles" : ""}
      {attr.vehicle === "amph" ? " (except amphibious vehicles)" : ""}{!attr.gun && attr.move !== 0 ? " and crewed weapons" : ""}.
      {attr.gun === "back" ? " Crewed weapons can only be maneuvered backwards into this terrain." : ""}
      {attr.los ? " This terrain blocks line-of-sight" : ""}
      {attr.cover > 0 && attr.hindrance === 0 ? ` and has a cover of ${attr.cover}` : ""}
      {attr.hindrance > 0 && attr.cover === 0 ? ` This terrain has a hindrance of ${attr.hindrance}.` : ""}
      {attr.hindrance > 0 && attr.cover > 0 ? ` This terrain has a cover of ${attr.cover} and has a hindrance of ${attr.hindrance}.` : ""}
      {attr.los ? "." : ""}
    </p>)
    if (currentState.b) {
      sections.push(<p key={index++}>
        There is a <strong>{battr.name}</strong>,
        which { battr.move > 0 ? `adds a movement cost of ${battr.move}` : "is impassible" }
        { battr.move > 0 && !battr.vehicle ? ", but is impassible to vehicles and crewed weapons" : ", and is impassible to crewed weapons" }
        { battr.move === 0 ? " (the terrain behind the cliff is at a higher elevation)." : "." }
        { battr.cover > 0 && battr.los ? ` The ${battr.name} blocks line-of-sight and has a cover of ${battr.cover}.` : ""}
        { battr.hindrance > 0 ? ` The ${battr.name} has a hindrance of ${battr.hindrance}.` : "" }
      </p>)
    }
    if (currentState.r) {
      if (currentState.r === "t" || currentState.r === "d") {
        sections.push(<p key={index++}>
          There is a <strong>{currentState.r === "t" ? "paved" : "dirt"} road</strong>, movement along
          a road costs 1 movement point (except for wheeled vehicles, which pay only ½ movement point
          when moving along a road).  If tracked or foot (but not crewed) units move entirely along a
          road, they may move one additional hex. Units moving along roads ignore the movement cost of
          the underlying terrain and/or may move into otherwise forbidden terrain.
        </p>)
      } else if (currentState.r === "p") {
        sections.push(<p key={index++}>
          There is an <strong>path</strong>, foot movement along a path only costs 1 movement, and
          the movement cost of the underlying terrain is ignored.  Has no effect on other units.
        </p>)
      } else if (currentState.r === "a") {
        sections.push(<p key={index++}>
          There is an <strong>airfield</strong>, which has all the same effects on movements as a
          road.
        </p>)
      }
    }
    if (currentState.s) {
      sections.push(<p key={index++}>
        There is a <strong>{sattr.name}</strong>.
        {currentState.s === "s" && map.baseTerrain !== "s" ? " Adds 1 movement cost to moves into, out of, or along the stream." : ""}
        {currentState.s === "s" && map.baseTerrain === "s" ? " Streams have no effect on movement when frozen." : ""}
        {currentState.s === "g" ? " Adds 1 movement cost to moves into, out of, or along the gully, and has a cover of 1." : ""}
        {currentState.s === "t" ? " Adds 1 movement cost to moves into or out of the trench, and has a cover of 3." : ""}
      </p>)
    }
    if (currentState.rr) {
      sections.push(<p key={index++}>
        There is a <strong>railroad</strong>, which has no effect on movement, but has a cover of 1.
      </p>)
    }
    if (currentState.sh) {
      sections.push(<p key={index++}>
        There is a <strong>building{currentState.sh === "c" ? " (silo)": "" }</strong>, which has a
        movement cost of 2 (instead of base movement), but is impassible to vehicles and crewed weapons.
        It blocks line-of-sight, and has a cover of 2.
      </p>)
    }
    if (attr?.cover > 0 || battr?.cover > 0 || sattr?.cover > 0 || currentState.rr || currentState.sh) {
      sections.push(<p key={index++}>
        [<strong>Cover</strong> is a defensive bonus applied to infantry units occupying this terrain.]
      </p>)
    }
    if (attr?.hindrance > 0 || battr?.hindrance > 0) {
      sections.push(<p key={index++}>
        [<strong>Hindrance</strong> is an offensive penalty applied to attacks into or through this terrain.]
      </p>)
    }
    return sections
  }

  const typeButton = (terrain: string, name: string) => {
    const selected = (currentState.t === lookup[terrain].t && currentState.m === lookup[terrain].m) ?
      " counter-help-button-selected" : ""
    return (
      <div className={`custom-button normal-button terrain-help-button${selected}`} onClick={
           () => setTerrain(terrain) }>
        <span>{name}</span>
      </div>
    )
  }

  const borderButton = (border: string, name: string) => {
    const selected = currentState.b === lookup[border].b ? " counter-help-button-selected" : ""
    return (
      <div className={`custom-button normal-button terrain-help-button${selected}`} onClick={
           () => setTerrain(border) }>
        <span>{name}</span>
      </div>
    )
  }

  const roadButton = (road: string, name: string) => {
    const selected = currentState.r === lookup[road].r ? " counter-help-button-selected" : ""
    return (
      <div className={`custom-button normal-button terrain-help-button${selected}`} onClick={
           () => setTerrain(road) }>
        <span>{name}</span>
      </div>
    )
  }

  const streamButton = (stream: string, name: string) => {
    const selected = currentState.s === lookup[stream].s ? " counter-help-button-selected" : ""
    return (
      <div className={`custom-button normal-button terrain-help-button${selected}`} onClick={
           () => setTerrain(stream) }>
        <span>{name}</span>
      </div>
    )
  }

  const railButton = (name: string) => {
    const selected = currentState.rr ? " counter-help-button-selected" : ""
    return (
      <div className={`custom-button normal-button terrain-help-button${selected}`} onClick={
           () => setTerrain("rail") }>
        <span>{name}</span>
      </div>
    )
  }

  const buildingButton = (shape: string, name: string) => {
    const selected = currentState.sh === lookup[shape].sh ? " counter-help-button-selected" : ""
    return (
      <div className={`custom-button normal-button terrain-help-button${selected}`} onClick={
           () => setTerrain(shape) }>
        <span>{name}</span>
      </div>
    )
  }
  
  useEffect(() => {
    if (!map) { return }
    map.baseTerrain = currentState.m ?? "g"
    const hex1 = new Hex(new Coordinate(0, 0), {
      t: currentState.t, d: 2, r: currentState.r ? { t: currentState.r, d: [1, 4] } : undefined,
      rr: currentState.rr ? { d: [[1, 4]] } : undefined,
      s: currentState.s ? { t: currentState.s, d: [1, 4] } : undefined,
    }, map)
    const hex2 = new Hex(new Coordinate(1, 0), {
      t: currentState.t, d: 2, r: currentState.r ? { t: currentState.r, d: [1, 5] } : undefined,
      rr: currentState.rr ? { d: [[1, 5]] } : undefined,
      s: currentState.s ? { t: currentState.s, d: [1, 5] } : undefined,
    }, map)
    const hex3 = new Hex(new Coordinate(0, 1), {
      t: currentState.t, d: 2, b: currentState.b ? currentState.b : undefined,
      be: currentState.b ? [2, 3, 4] : undefined, h: currentState.b === "c" ? 2 : undefined,
      st: currentState.sh ? { sh: currentState.sh, s: "u" } : undefined,
    }, map)
    const hex4 = new Hex(new Coordinate(1, 1), {
      t: currentState.t, d: 2, r: currentState.r ? { t: currentState.r, d: [2, 5] } : undefined,
      rr: currentState.rr ? { d: [[2, 5]] } : undefined,
      s: currentState.s ? { t: currentState.s, d: [2, 5] } : undefined,
    }, map)
    map.mapHexes[0][0] = hex1
    map.mapHexes[0][1] = hex2
    map.mapHexes[1][0] = hex3
    map.mapHexes[1][1] = hex4
    setUpdateSection(
      <div>
        <div className="flex mb05em flex-align-start">
          <div>
            <svg width={320} height={263} viewBox='-10 -10 310 253' style={{ minWidth: 320 }}>
              <MapHexPatterns />
              <path d={roundedRectangle(-8,-8,305,249,8)}
                    style={{ stroke: "#DDD", strokeWidth: 1, fill: "#FFF" }}/>
              <MapHex hex={hex1} />
              <MapHex hex={hex2} />
              <MapHex hex={hex3} />
              <MapHex hex={hex4} />
              <MapHexDetail hex={hex1} maxX={0} maxY={0} selectCallback={() => {}} showTerrain={false}
                            scale={1} terrainCallback={() => {}}
                            svgRef={null as unknown as React.MutableRefObject<HTMLElement>} />
              <MapHexDetail hex={hex2} maxX={0} maxY={0} selectCallback={() => {}} showTerrain={false}
                            scale={1} terrainCallback={() => {}}
                            svgRef={null as unknown as React.MutableRefObject<HTMLElement>} />
              <MapHexDetail hex={hex3} maxX={0} maxY={0} selectCallback={() => {}} showTerrain={false}
                            scale={1} terrainCallback={() => {}}
                            svgRef={null as unknown as React.MutableRefObject<HTMLElement>} />
              <MapHexDetail hex={hex4} maxX={0} maxY={0} selectCallback={() => {}} showTerrain={false}
                            scale={1} terrainCallback={() => {}}
                            svgRef={null as unknown as React.MutableRefObject<HTMLElement>} />
            </svg>
          </div>
          <div>
            <div className="flex flex-wrap ml025em">
              { typeButton("open", "Open") }
              { typeButton("forest", "Forest") }
              { typeButton("brush", "Brush") }
              { typeButton("orchard", "Orchard") }
              { typeButton("field", "Field") }
              { roadButton("road", "Paved Road") }
              { roadButton("dirt", "Dirt Road") }
              { buildingButton("house", "Building") }
              { streamButton("stream", "Stream") }
              { borderButton("fence", "Fence") }
              { borderButton("wall", "Wall") }
              { typeButton("sand", "Sand") }
              { typeButton("marsh", "Marsh") }
              { typeButton("snow", "Snow") }
              { typeButton("mud", "Mud") }
              { roadButton("path", "Path") }
              { borderButton("bocage", "Bocage") }
              { typeButton("jungle", "Jungle") }
              { typeButton("palm", "Palm Trees") }
              { typeButton("rough", "Rough Ground") }
              { typeButton("soft", "Soft Ground") }
              { typeButton("debris", "Debris") }
              { typeButton("water", "Water") }
              { buildingButton("silo", "Silo") }
              { typeButton("shallow", "Shallow Water") }
              { borderButton("cliff", "Cliff") }
              { streamButton("gully", "Gully") }
              { streamButton("trench", "Trench") }
              { railButton("Railroad") }
              { roadButton("air", "Airfield") }
            </div>
          </div>
        </div>
        <div className="mr05em mt05em">
          { terrainHelp() }
        </div>
      </div>
    )
  }, [currentState])

  return (
    <div>
      <h1>Map Terrain</h1>
      <p>
        Terrain in the game affects a number of things: in particular, movement (i.e., movement cost),
        cover, and hindrances or line-of-sight.  Terrain also has elevations, which has further effects
        on movement and line-of-sight.  A help tooltip is available in-game by mousing over hexes, and can
        be toggled on and off with the terrain info button:
      </p>
      <div className="flex mb1em">
        <div className="ml1em"></div>
        <div className="custom-button normal-button">
          <Hexagon /> <span>terrain info</span>
        </div>
        <div className="mt05em">/</div>
        <div className="custom-button normal-button">
          <HexagonFill /> <span>terrain info</span>
        </div>
        <div className="flex-fill"></div>
      </div>
      <p>
        In addition, line-of-sight and hindrance effects can be viewed by toggling the overlay button, which
        toggles between the counter selection overlay and the line-of-sight map overlay:
      </p>
      <div className="flex mb1em">
        <div className="ml1em"></div>
        <div className="custom-button normal-button">
          <Stack /> <span>overlay</span>
        </div>
        <div className="mt05em">/</div>
        <div className="custom-button normal-button">
          <EyeFill /> <span>overlay</span>
        </div>
        <div className="flex-fill"></div>
      </div>
      <h2 className="mt05em">Terrain Types</h2>
      <p>
        Select the buttons on the right to see the different types of terrain:
      </p>
      { updateSection }
    </div>
  )
}
