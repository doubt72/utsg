import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import GameReplay from "../../engine/GameReplay";
import { getAPI } from "../../utilities/network";
import MapDisplay from "./map/MapDisplay";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";
import {
  ArrowClockwise,
  ArrowCounterclockwise,
  ArrowLeftCircle,
  ArrowRepeat, ArrowsAngleContract, ArrowsAngleExpand, Circle, CircleFill, DashCircle, EyeFill,
  GeoAlt, GeoAltFill, Hexagon, HexagonFill, Phone, PlusCircle, Square, SquareFill, Stack
} from "react-bootstrap-icons";
import Header from "../Header";
import ActionReplayDisplay from "./ActionReplayDisplay";

export default function GameReplayDisplay() {
  const { id } = useParams()
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    history.pushState(null, "", location.pathname)
    const handlePopState = () => { history.pushState(null, "", location.pathname) }
    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [navigate, location])

  useEffect(() => {
    if (localStorage.getItem("validationNeeded")) {
      navigate("/verify_account", { replace: true });
    }
  }, []);

  const [replay, setReplay] = useState<GameReplay | undefined>()
  const [mapDisplay, setMapDisplay] = useState<JSX.Element | undefined>()
  const [actions, setActions] = useState<JSX.Element | undefined>()

  const [collapseHeader, setCollapseHeader] = useState<boolean>(false)

  const [collapseHeaderButton, setCollapseHeaderButton] = useState<JSX.Element | undefined>()
  const [rollbackButton, setRollbackButton] = useState<JSX.Element | undefined>()
  const [rollforwardButton, setRollforewardButton] = useState<JSX.Element | undefined>()

  const [mapScale, setMapScale] = useState(1)
  const [interfaceShrink, setInterfaceShrink] = useState(0)
  const [rotated, setRotated] = useState(false)
  const [coords, setCoords] = useState(true)
  const [showStatusCounters, setShowStatusCounters] = useState(false)
  const [hideCounters, setHideCounters] = useState(false)
  const [showTerrain, setShowTerrain] = useState(false)
  const [showLos, setShowLos] = useState(false)
  const [shrinkButtons, setShrinkButtons] = useState<boolean>(false)
  const [checkCancelHideLOS, setCheckCancelHideLOS] = useState<number>(0)
  const [checkCancelTerrain, setCheckCancelTerrain] = useState<number>(0)

  const [mapScaleMinusButton, setMapScaleMinusButton] = useState<JSX.Element | undefined>()
  const [mapScaleResetButton, setMapScaleResetButton] = useState<JSX.Element | undefined>()
  const [mapScalePlusButton, setMapScalePlusButton] = useState<JSX.Element | undefined>()
  const [largeInterfaceButton, setLargeInterfaceButton] = useState<JSX.Element | undefined>()
  const [smallInterfaceButton, setSmallInterfaceButton] = useState<JSX.Element | undefined>()
  const [mobileInterfaceButton, setMobileInterfaceButton] = useState<JSX.Element | undefined>()

  const [updateMap, setUpdateMap] = useState(0)

  const setUpdate = () =>  {
    setUpdateMap(s => s + 1)
  }

  useEffect(() => {
    getAPI(`/api/v1/games/${id}`, {
      ok: response => response.json().then(json => {
        const code = json.scenario
        const version = json.scenario_version
        getAPI(`/api/v1/scenarios/${code}?version=${version}`, {
          ok: response => response.json().then(scenario => {
            json.scenario = scenario
            setReplay(new GameReplay(json, setUpdate))
          })
        })
      }),
      other: () => {
        navigate("/", { replace: true })
      }
    })
    const shrink = localStorage.getItem("mapInterfaceShrink")
    const mScale = localStorage.getItem("mapScale")
    const headerCollape = localStorage.getItem("mapCollapseHeader")
    const showCoords = localStorage.getItem("mapCoords")
    const showMarkers = localStorage.getItem("mapMarkers")
    const mapRotate = localStorage.getItem("mapRotate")
    if (shrink !== null) {
      setInterfaceShrink(Number(shrink))
    } else {
      if (window.innerWidth < 1350) {
        setInterfaceShrink(2)
      } else if (window.innerWidth < 1800) {
        setInterfaceShrink(1)
      }
    }
    if (mScale !== null) { setMapScale(Number(mScale)) }
    if (headerCollape !== null) { setCollapseHeader(headerCollape === "true") }
    if (showCoords !== null) { setCoords(showCoords === "true") }
    if (showMarkers !== null) { setShowStatusCounters(showMarkers === "true") }
    if (mapRotate !== null) { setRotated(mapRotate === "true") }
  }, [])

  useEffect(() => {
    if (!replay) { return }
    const map = replay.game.scenario.map
    map.rotated = rotated
    setMapDisplay(
      <MapDisplay map={map} scale={shrinkScales[interfaceShrink]} mapScale={mapScale}
                  showCoords={coords} showStatusCounters={showStatusCounters} showLos={showLos}
                  hideCounters={hideCounters} showTerrain={showTerrain} preview={false}
                  forceUpdate={updateMap} replay={true} headerCollapse={collapseHeader}
                  updateCallback={setUpdate} shrinkCallback={(n: boolean) => setShrinkButtons(n)}
                  checkCancelHideLOS={checkCancelHideLOS} checkCancelTerrain={checkCancelTerrain} />
    )
  }, [
    replay, rotated, updateMap, interfaceShrink, mapScale, coords, showStatusCounters, showLos,
    hideCounters, showTerrain, collapseHeader,
  ])

  const switchMapScale = (set: -1 | 0 | 1) => {
    if (set < 0) {
      setMapScale(ms => {
        const nv = Math.max(ms/1.25, 0.4096)
        localStorage.setItem("mapScale", String(nv))
        return nv
      })
    } else if (set > 0) {
      setMapScale(ms => {
        const nv = Math.min(ms*1.25, 1.0)
        localStorage.setItem("mapScale", String(nv))
        return nv
      })
    } else {
      setMapScale(() => {
        localStorage.setItem("mapScale", String(1))
        return 1
      })
    }
  }
  
  const expandHeaderTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      show header
    </Tooltip>
  )

  const collapseHeaderTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      collapses header to make more room for the game map
    </Tooltip>
  )

  const scaleMinusTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      make the map smaller
    </Tooltip>
  )

  const scaleZeroTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      reset map size
    </Tooltip>
  )

  const scalePlusTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      make the map larger
    </Tooltip>
  )

  const largeSizeTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      set the size of the map status overlays and the unzoomed size of the map
      to best suit larger displays
    </Tooltip>
  )

  const smallSizeTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      set the size of the map status overlays and the unzoomed size of the map
      to best suit smaller displays
    </Tooltip>
  )

  const mobileSizeTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      set the size of the map status overlays and the unzoomed size of the map
      to best suit very small or mobile (tablet) displays
    </Tooltip>
  )

  useEffect(() => {
    setMapScaleMinusButton(
      <OverlayTrigger placement="bottom" overlay={scaleMinusTooltip}
                      delay={{ show: 0, hide: 0 }}>
        <div className={`custom-button normal-button button-left${mapScale > 0.41 ? "" : " custom-button-ghost"}`}
             onClick={() => switchMapScale(-1)}>
          <DashCircle />
        </div>
      </OverlayTrigger>
    )
    setMapScaleResetButton(
      <OverlayTrigger placement="bottom" overlay={scaleZeroTooltip}
                      delay={{ show: 0, hide: 0 }}>
        <div className={`custom-button normal-button button-middle${mapScale < 1 ? "" : " custom-button-ghost"}`}
             onClick={() => switchMapScale(0)}>
          <Circle />
        </div>
      </OverlayTrigger>
    )
    setMapScalePlusButton(
      <OverlayTrigger placement="bottom" overlay={scalePlusTooltip}
                      delay={{ show: 0, hide: 0 }}>
        <div className={`custom-button normal-button button-right${mapScale < 1 ? "" : " custom-button-ghost"}`}
             onClick={() => switchMapScale(1)}>
          <PlusCircle />
        </div>
      </OverlayTrigger>
    )
  }, [mapScale])
  useEffect(() => {
    setLargeInterfaceButton(
      <OverlayTrigger placement="bottom" overlay={largeSizeTooltip}
                      delay={{ show: 0, hide: 0 }}>
        <div className={ `custom-button normal-button button-left${interfaceShrink !== 0 ? "" : " custom-button-select"}` }
             onClick={() => selectInterfaceShrink(0)}>
          <ArrowsAngleExpand />
        </div>
      </OverlayTrigger>
    )
    setSmallInterfaceButton(
      <OverlayTrigger placement="bottom" overlay={smallSizeTooltip}
                      delay={{ show: 0, hide: 0 }}>
        <div className={ `custom-button normal-button button-middle${interfaceShrink !== 1 ? "" : " custom-button-select"}` }
             onClick={() => selectInterfaceShrink(1)}>
          <ArrowsAngleContract />
        </div>
      </OverlayTrigger>
    )
    setMobileInterfaceButton(
      <OverlayTrigger placement="bottom" overlay={mobileSizeTooltip}
                      delay={{ show: 0, hide: 0 }}>
        <div className={ `custom-button normal-button button-right${interfaceShrink !== 2 ? "" : " custom-button-select"}` }
             onClick={() => selectInterfaceShrink(2)}>
          <Phone />
        </div>
      </OverlayTrigger>
    )
  }, [mapScale, interfaceShrink])

  const selectInterfaceShrink = (setting: number) => {
    setInterfaceShrink(() => {
      let nv = setting
      if (nv < 0) { nv = 0 }
      if (nv > 2) { nv = 2 }
      localStorage.setItem("mapInterfaceShrink", String(nv))
      return nv
    })
  }

  const toggleRotated = () => {
    setRotated(c => {
      const nc = !c
      if (replay) { replay.game.scenario.map.rotated = nc }
      localStorage.setItem("mapRotate", nc ? "true" : "false")
      return nc
    })
  }

  const toggleShowCoords = () => {
    setCoords(c => {
      const nc = !c
      localStorage.setItem("mapCoords", String(nc))
      return nc
    })
  }

  const toggleShowMarkers = () => {
    setShowStatusCounters(sc => {
      const nc = !sc
      localStorage.setItem("mapMarkers", String(nc))
      return nc
    })
  }

  useEffect(() => {
    if (!replay) { return }
    setActions(<ActionReplayDisplay gameReplay={replay} currentSequence={replay.currentSequence}
                                    setSequence={s => {
                                      replay.setSequence(s)
                                      setUpdate()
                                    }}/>)
  }, [replay, replay?.currentIndex, updateMap])

  useEffect(() => {
    setCollapseHeaderButton(
      <OverlayTrigger placement="bottom"
                      overlay={ collapseHeader ? expandHeaderTooltip : collapseHeaderTooltip}
                      delay={{ show: 0, hide: 0 }}>
        <div className="custom-button normal-button collapse-button-right"
             style={{ margin: "0.5em 0.5em 0.5em 0" }}
             onClick={() => {
               setCollapseHeader(s => {
                 localStorage.setItem("mapCollapseHeader", s ? "false" : "true")
                 return !s
               })
             }}>
          { collapseHeader ? <PlusCircle /> : <DashCircle /> }
        </div>
      </OverlayTrigger>
    )
  }, [collapseHeader])

  useEffect(() => {
    if (!replay) { return }
    if (replay.firstIndex) {
      setRollbackButton(
        <div className="custom-button-disable normal-button">
          <ArrowCounterclockwise /> <span style={{ verticalAlign: "-1px" }}>previous</span>
        </div>
      )
    } else {
      setRollbackButton(
        <div className="custom-button normal-button"
            onClick={() => {
              replay.rollback()
              setUpdate()
            }}>
          <ArrowCounterclockwise /> <span style={{ verticalAlign: "-1px" }}>previous</span>
        </div>
      )
    }
    if (replay.lastIndex) {
      setRollforewardButton(
        <div className="custom-button-disable normal-button">
          <ArrowClockwise /> <span style={{ verticalAlign: "-1px" }}>next</span>
        </div>
      )
    } else {
      setRollforewardButton(
        <div className="custom-button normal-button"
            onClick={() => {
              replay.rollForward()
              setUpdate()
            }}>
          <ArrowClockwise /> <span style={{ verticalAlign: "-1px" }}>next</span>
        </div>
      )
    }
  }, [replay, replay?.currentIndex])

  const rotateTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      rotate map
    </Tooltip>
  )

  const coordsTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      toggles showing hex coordinate labels
    </Tooltip>
  )

  const statusTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      toggles between status badges and status markers
    </Tooltip>
  )

  const overlayTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      toggles between counter overlays and line-of-sight overlay [hold down control to suppress overlays]
    </Tooltip>
  )

  const countersTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      toggles showing or hiding counters
    </Tooltip>
  )

  const terrainTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      toggles showing terrain info overlay
    </Tooltip>
  )

  const shrinkScales = [1, 0.75, 0.5625]

  return (
    <div className="main-page">
      { collapseHeader ? "" : <Header /> }
      <div className="flex">
        <div className="game-page-replay-controls">
          <div className="corner-round background-gray p05em flex-fill mb05em flex flex-vertical">
            <div>
              <div className="mb05em">
                {replay?.game.name}
              </div>
              <div className="flex">
                <div className="red monospace mr05em">
                  {replay?.game.scenario?.code}:
                </div>
                <div className="green nowrap">
                  {replay?.game.scenario?.name}
                </div>
              </div>
            </div>
            <div className="flex-fill"></div>
            <div className="flex">
              <div className="flex-fill"></div>
              <div className="custom-button normal-button"
                  onClick={() => {
                    navigate(`/game/${replay?.game.id}`, { replace: true })
                  }}>
                <ArrowLeftCircle /> <span style={{ verticalAlign: "-1px" }}>back</span>
              </div>
              { rollbackButton } { rollforwardButton }
            </div>
          </div>
        </div>
        <div className="standard-body">
          <div className="game-page-replay-actions flex-fill">
            {actions}
          </div>
        </div>
        { collapseHeaderButton }
      </div>
      <div className="flex">
        <div>
          <div className="flex map-control">
            <div className="flex-fill"></div>
            <OverlayTrigger placement="bottom" overlay={rotateTooltip}
                            delay={{ show: 0, hide: 0 }}>
              <div className={`custom-button normal-button${ rotated ? " custom-button-select" : ""}`}
                   onClick={() => toggleRotated()}>
                <ArrowRepeat />
              </div>
            </OverlayTrigger>
            {mapScaleMinusButton}
            {mapScaleResetButton}
            {mapScalePlusButton}
            {largeInterfaceButton}
            {smallInterfaceButton}
            {mobileInterfaceButton}
            <OverlayTrigger placement="bottom" overlay={coordsTooltip}
                            delay={{ show: 0, hide: 0 }}>
              <div className="custom-button normal-button"
                  onClick={() => toggleShowCoords()}>
                { coords ? <GeoAltFill /> : <GeoAlt /> } <span>{shrinkButtons ? "" : "coords"}</span>
              </div>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={statusTooltip}
                            delay={{ show: 0, hide: 0 }}>
              <div className="custom-button normal-button"
                  onClick={() => toggleShowMarkers()}>
                { showStatusCounters ? <Stack /> : <CircleFill /> } <span>{shrinkButtons ? "" : "status"}</span>
              </div>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={overlayTooltip}
                            delay={{ show: 0, hide: 0 }}>
              <div className="custom-button normal-button"
                  onClick={() => { setShowLos(sl => !sl); setCheckCancelHideLOS(s => s+1) }}>
                { showLos ? <EyeFill /> : <Stack /> } <span>{shrinkButtons ? "" : "overlay"}</span>
              </div>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={countersTooltip}
                            delay={{ show: 0, hide: 0 }}>
              <div className="custom-button normal-button"
                  onClick={() => { setHideCounters(sc => !sc); setCheckCancelHideLOS(s => s+1) }}>
                { hideCounters ? <Square /> : <SquareFill /> } <span>{shrinkButtons ? "" : "counters"}</span>
              </div>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={terrainTooltip}
                            delay={{ show: 0, hide: 0 }}>
              <div className="custom-button normal-button"
                  onClick={() => { setShowTerrain(sc => !sc); setCheckCancelTerrain(s => s+1) }}>
                { showTerrain ? <HexagonFill /> : <Hexagon /> } <span>{shrinkButtons ? "" : "terrain"}</span>
              </div>
            </OverlayTrigger>
          </div>
          <div className="game-map">
            { mapDisplay }
          </div>
        </div>
      </div>
    </div>
  )
}
