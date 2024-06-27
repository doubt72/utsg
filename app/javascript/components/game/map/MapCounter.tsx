import React from "react";
import MapHexPatterns from "./MapHexPatterns";
import Counter from "../../../engine/Counter";
import { CounterLayout, StatusLayout } from "../../../utilities/graphics";

interface MapCounterProps {
  counter: Counter;
  // eslint-disable-next-line @typescript-eslint/ban-types
  ovCallback: Function;
}

export default function MapCounter({ counter, ovCallback }: MapCounterProps) {

  const counterBack = (
    <path d={counter.counterPath()} style={counter.counterStyle as object} />
  )

  const nameBackground = () => {
    const path = counter.nameBackgroundPath
    if (path) return (
        <path d={path} style={counter.nameBackgroundStyle as object} />
    )
  }

  const shadow = () => {
    const layout = counter.shadowPath
    if (layout) {
      return (
        <path d={layout} style={{ fill: "rgba(0,0,0,0.2)" }} />
      )
    }
  }

  const name = () => {
    const layout = counter.nameLayout
    return (
      <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="start"
            style={layout.style as object}>{layout.name}</text>
    )
  }

  const morale = () => {
    const layout = counter.moraleLayout
    if (layout) return (
      <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
            fontFamily="'Courier Prime', monospace"
            style={layout.style as object}>{layout.value}</text>
    )
  }

  const weaponBreak = () => {
    const layout = counter.weaponBreakLayout
    if (layout) return (
      <g>
        <path d={layout.path} style={layout.style as object} />
        <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
              fontFamily="'Courier Prime', monospace"
              style={layout.tStyle as object}>{layout.value}</text>
      </g>
    )
  }

  const size = () => {
    const layout = counter.sizeLayout
    if (layout) return (
      <g>
        <path d={layout.path} style={layout.style as object} />
        <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
              fontFamily="'Courier Prime', monospace"
              style={layout.tStyle as object}>{layout.value}</text>
      </g>
    )
  }

  const leadership = () => {
    const layout = counter.leadershipLayout
    if (layout) return (
      <g>
        <path d={layout.path} style={layout.style as object} />
        <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
              fontFamily="'Courier Prime', monospace"
              style={layout.tStyle as object}>{layout.value}</text>
      </g>
    )
  }

  const handling = () => {
    const layout = counter.handlingLayout
    if (layout) return (
      <g>
        <path d={layout.path} style={layout.style as object} />
        <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
              fontFamily="'Courier Prime', monospace"
              style={layout.tStyle as object}>{layout.value}</text>
      </g>
    )
  }

  const breakdown = () => {
    const layout = counter.breakdownLayout
    if (layout) return (
      <g>
        <path d={layout.path} style={layout.style as object} />
        <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
              fontFamily="'Courier Prime', monospace"
              style={layout.tStyle as object}>{layout.value}</text>
      </g>
    )
  }

  const smoke = () => {
    const layout = counter.smokeLayout
    if (layout) return (
      <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
            fontFamily="'Courier Prime', monospace"
            style={layout.style as object}>{layout.value}</text>
    )
  }

  const icon = () => {
    const layout = counter.iconLayout
    if (layout) return (
      <image width={layout.size} height={layout.size} x={layout.x} y={layout.y}
             href={`/assets/units/${layout.icon}.svg`} /> 
    )
  }

  const centerLabel = () => {
    const layout = counter.centerLabelLayout
    if (layout) return (
      <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
            fontFamily="'Courier Prime', monospace"
            style={layout.style as object}>{layout.value}</text>
    )
  }

  const sponson = () => {
    const layout = counter.sponsonLayout
    if (layout) return (
      <g>
        <path d={layout.path} style={layout.style as object} />
        <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
              fontFamily="sans-serif" style={{fill: "black"}}>{layout.value}</text>
      </g>
    )
  }

  const turretArmor = () => {
    const layout = counter.turretArmorLayout
    if (layout) return (
      <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
            fontFamily="sans-serif" style={{fill: "black"}}>{layout.value}</text>
    )
  }

  const hullArmor = () => {
    const layout = counter.hullArmorLayout
    if (layout) return (
      <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
            fontFamily="sans-serif" style={{fill: "black"}}>{layout.value}</text>
    )
  }

  const firepower = () => {
    const layout = counter.firepowerLayout
    if (layout) return (
      <g>
        <path d={layout.path} style={layout.style as object} />
        <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
              fontFamily="'Courier Prime', monospace"
              style={layout.tStyle as object}>{layout.value}</text>
      </g>
    )
  }

  const range = () => {
    const layout = counter.rangeLayout
    if (layout) return (
      <g>
        <path d={layout.path} style={layout.style as object} />
        <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
              fontFamily="'Courier Prime', monospace"
              style={layout.tStyle as object}>{layout.value}</text>
      </g>
    )
  }

  const movement = () => {
    const layout = counter.movementLayout
    if (layout) return (
      <g>
        <path d={layout.path} style={layout.style as object} />
        <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
              fontFamily="'Courier Prime', monospace"
              style={layout.tStyle as object}>{layout.value}</text>
      </g>
    )
  }

  const marker = () => {
    const layout = counter.markerLayout
    if (layout) {
      return (
        <g>
          {layout.path ? <path d={layout.path} style={layout.style as object}/> : ""}
          {
            layout.text.map((t, i) =>
              <text key={i} x={t.x} y={t.y} fontSize={layout.size} textAnchor="middle"
                    fontFamily="'Courier Prime', monospace"
                    style={layout.tStyle as object}>{t.value}</text>
            )
          }
        </g>
      )
    }
  }

  const turnBadges = () => {
    const layout = counter.turnLayout
    if (layout) {
      return (
        <g>
          <MapHexPatterns />
          {layout.map((c, i) => <circle key={i} cx={c.x} cy={c.y} r={c.r}
                                        style={c.style as object}/>)}
        </g>
      )
    }
  }

  const windArrow = () => {
    const layout = counter.windArrowLayout
    if (layout) return <path d={layout.path} style={layout.style as object} />
  }

  const markerSub = () => {
    const layout = counter.markerSubLayout
    if (layout) return (
      <g>
        <text x={layout.x} y={layout.y[0]} fontSize={layout.size} textAnchor="middle"
              fontFamily="'Courier Prime', monospace"
              style={layout.style as object}>{layout.value[0]}</text>
        <text x={layout.x} y={layout.y[1]} fontSize={layout.size} textAnchor="middle"
              fontFamily="'Courier Prime', monospace"
              style={layout.style as object}>{layout.value[1]}</text>
        <text x={layout.x} y={layout.y[2]} fontSize={layout.size} textAnchor="middle"
              fontFamily="'Courier Prime', monospace"
              style={layout.style as object}>{layout.value[2]}</text>
      </g>
    )
  }

  const feature = () => {
    const layoutSrc = counter.featureLayout
    if (layoutSrc) {
      const layout = layoutSrc as CounterLayout
      return (
        <g>
          <path d={layout.path} style={layout.style as object} />
          <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
                fontFamily="'Courier Prime', monospace"
                style={layout.tStyle as object}>{layout.value}</text>
        </g>
      )
    }
  }

  const status = () => {
    const layoutSrc = counter.statusLayout
    if (layoutSrc) {
      const layout = layoutSrc as StatusLayout
      const text = layout.value.map((t, i) => (
        <text key={i} x={layout.x} y={layout.y + layout.size*i} fontSize={layout.size}
              textAnchor="middle" fontFamily="'Courier Prime', monospace"
              style={layout.fStyle as object}>{t}</text>
      ))
      const c = counter
      const r = c.rotation
      return (
        <g transform={`rotate(${r ? `${-r.a} ${c.x+40} ${c.y+40}` : "0"})`}>
          <path d={layout.path} style={layout.style as object} />
          {text}
        </g>
      )
    }
  }
  
  const overlay = (
    <path d={counter.counterPath()} style={{ fill: "rgba(0,0,0,0)" }}
          onMouseEnter={() => ovCallback(
            { show: true, x: counter.hex?.x, y: counter.hex?.y }
          )} />
  )

  const rotation = () => {
    const r = counter.rotation
    return r ? `${r.a} ${r.x} ${r.y}` : "0"
  }

  return (
    <g transform={`rotate(${rotation()})`}>
      {shadow()}
      {counterBack}
      {nameBackground()}{name()}
      {morale()}
      {weaponBreak()}{size()}
      {leadership()}{handling()}{breakdown()}{smoke()}
      {icon()}{centerLabel()}
      {sponson()}{turretArmor()}{hullArmor()}
      {feature()}
      {firepower()}{range()}{movement()}
      {marker()}{windArrow()}{markerSub()}{turnBadges()}
      {status()}
      {overlay}
    </g>
  )
}
