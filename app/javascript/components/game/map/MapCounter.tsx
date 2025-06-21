import React from "react";
import MapHexPatterns from "./MapHexPatterns";
import Counter from "../../../engine/Counter";
import { CounterLayout, StatusLayout } from "../../../utilities/graphics";
import {
  amphibiousLayout, breakdownLayout, canTowLayout, centerLabelLayout, eliteLayout, engineerLayout,
  firepowerLayout, gunBackwardsLayout, gunForwardsLayout, handlingLayout,
  hullArmorLayout, iconLayout, leadershipLayout, moraleLayout, movementLayout, rangeLayout,
  sizeLayout, smokeLayout, sponsonLayout, towLayout, transportLLayout, transportRLayout, turretArmorLayout,
  weaponBreakLayout, weaponFixLayout
} from "../../../engine/support/unitLayout";
import {
  markerBreakLayout, markerFirepowerLayout, markerFixLayout, markerLayout, markerMoraleLayout,
  markerMovementLayout, markerRangeLayout, markerSubLayout, turnLayout, windArrowLayout
} from "../../../engine/support/markerLayout";
import { featureLayout } from "../../../engine/support/featureLayout";
import {
  counterOutlineStyle,
  counterPath, counterStatusLayout, counterStyle, nameBackgroundPath, nameBackgroundStyle, nameLayout,
  shadowPath
} from "../../../engine/support/counterLayout";

interface MapCounterProps {
  counter: Counter;
  // eslint-disable-next-line @typescript-eslint/ban-types
  ovCallback: Function;
}

export default function MapCounter({ counter, ovCallback }: MapCounterProps) {

  const counterBack = (
    <path d={counterPath(counter)} style={counterStyle(counter) as object} />
  )

  const counterOutline = (
    <path d={counterPath(counter)} style={counterOutlineStyle(counter) as object} />
  )

  const showDisabled = () => {
    const disable = counter.showDisabled
    if (disable) return (
      <path d={counterPath(counter)} style={{ fill: "rgba(0,0,0,0.5)" }} />
    )
  }

  const nameBackground = () => {
    const path = nameBackgroundPath(counter)
    if (path) return (
        <path d={path} style={nameBackgroundStyle(counter) as object} />
    )
  }

  const shadow = () => {
    const layout = shadowPath(counter)
    if (layout) {
      return (
        <path d={layout} style={{ fill: "rgba(0,0,0,0.2)" }} />
      )
    }
  }

  const name = () => {
    const layout = nameLayout(counter)
    return (
      <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="start"
            style={layout.style as object}>{layout.name}</text>
    )
  }

  const morale = () => {
    const layout = moraleLayout(counter)
    if (layout) return (
      <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
            fontFamily="'Courier Prime', monospace"
            style={layout.style as object}>{layout.value}</text>
    )
  }

  const weaponBreak = () => {
    const layout = weaponBreakLayout(counter)
    if (layout) return (
      <g>
        <path d={layout.path} style={layout.style as object} />
        <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
              fontFamily="'Courier Prime', monospace"
              style={layout.tStyle as object}>{layout.value}</text>
      </g>
    )
  }

  const weaponFix = () => {
    const layout = weaponFixLayout(counter)
    if (layout) return (
      <g>
        <path d={layout.path} style={layout.style as object} />
        <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
              fontFamily="'Courier Prime', monospace"
              style={layout.tStyle as object}>{layout.value}</text>
      </g>
    )
  }

  const markerBreak = () => {
    const layout = markerBreakLayout(counter)
    if (layout) return (
      <g>
        <path d={layout.path} style={layout.style as object} />
        <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
              fontFamily="'Courier Prime', monospace"
              style={layout.tStyle as object}>{layout.value}</text>
      </g>
    )
  }

  const markerFix = () => {
    const layout = markerFixLayout(counter)
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
    const layout = sizeLayout(counter)
    if (layout) return (
      <g>
        <path d={layout.path} style={layout.style as object} />
        <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
              fontFamily="'Courier Prime', monospace"
              style={layout.tStyle as object}>{layout.value}</text>
      </g>
    )
  }

  const tow = () => {
    const layout = towLayout(counter)
    if (layout) return (
      <g>
        <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
              fontFamily="'Courier Prime', monospace"
              style={layout.tStyle as object}>{layout.value}</text>
      </g>
    )
  }

  const canTow = () => {
    const layout = canTowLayout(counter)
    if (layout) return (
      <g>
        <path d={layout.path} style={layout.style as object} />
      </g>
    )
  }

  const rightTransport = () => {
    const layout = transportRLayout(counter)
    if (layout) return (
      <path d={layout.path} style={layout.style as object} />
    )
  }

  const leftTransport = () => {
    const layout = transportLLayout(counter)
    if (layout) return (
      <path d={layout.path} style={layout.style as object} />
    )
  }

  const leadership = () => {
    const layout = leadershipLayout(counter)
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
    const layout = handlingLayout(counter)
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
    const layout = breakdownLayout(counter)
    if (layout) return (
      <g>
        <path d={layout.path} style={layout.style as object} />
        <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
              fontFamily="'Courier Prime', monospace"
              style={layout.tStyle as object}>{layout.value}</text>
      </g>
    )
  }

  const icon = () => {
    const layout = iconLayout(counter)
    if (layout) return (
      <image width={layout.size} height={layout.size} x={layout.x} y={layout.y}
             href={`/assets/units/${layout.icon}.svg`} /> 
    )
  }

  const centerLabel = () => {
    const layout = centerLabelLayout(counter)
    if (layout) return (
      <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
            fontFamily="'Courier Prime', monospace"
            style={layout.style as object}>{layout.value}</text>
    )
  }

  const sponson = () => {
    const layout = sponsonLayout(counter)
    if (layout) return (
      <g>
        <path d={layout.path} style={layout.style as object} />
        <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
              fontFamily="sans-serif" style={{ fill: "black" }}>{layout.value}</text>
      </g>
    )
  }

  const turretArmor = () => {
    const layout = turretArmorLayout(counter)
    if (layout) return (
      <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
            fontFamily="sans-serif" style={{fill: "black"}}>{layout.value}</text>
    )
  }

  const hullArmor = () => {
    const layout = hullArmorLayout(counter)
    if (layout) return (
      <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
            fontFamily="sans-serif" style={{fill: "black"}}>{layout.value}</text>
    )
  }

  const firepower = () => {
    const layout = firepowerLayout(counter)
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
    const layout = smokeLayout(counter)
    if (layout) return (
      <path d={layout.path} style={layout.style as object} />
    )
  }

  const range = () => {
    const layout = rangeLayout(counter)
    if (layout) return (
      <g>
        <path d={layout.path} style={layout.style as object} />
        <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
              fontFamily="'Courier Prime', monospace"
              style={layout.tStyle as object}>{layout.value}</text>
      </g>
    )
  }

  const gunForward = () => {
    const layout = gunForwardsLayout(counter)
    if (layout) return (
      <path d={layout.path} style={layout.style as object} />
    )
  }

  const gunBackward = () => {
    const layout = gunBackwardsLayout(counter)
    if (layout) return (
      <path d={layout.path} style={layout.style as object} />
    )
  }

  const movement = () => {
    const layout = movementLayout(counter)
    if (layout) return (
      <g>
        <path d={layout.path} style={layout.style as object} />
        <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
              fontFamily="'Courier Prime', monospace"
              style={layout.tStyle as object}>{layout.value}</text>
      </g>
    )
  }

  const engineer = () => {
    const layout = engineerLayout(counter)
    if (layout) return (
      <path d={layout.path} style={layout.style as object} />
    )
  }

  const amphibious = () => {
    const layout = amphibiousLayout(counter)
    if (layout) return (
      <path d={layout.path} style={layout.style as object} />
    )
  }

  const markerMorale = () => {
    const layout = markerMoraleLayout(counter)
    if (layout) return (
      <g>
        <path d={layout.path} style={layout.style as object} />
        <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
              fontFamily="'Courier Prime', monospace"
              style={layout.tStyle as object}>{layout.value}</text>
      </g>
    )
  }

  const markerFirepower = () => {
    const layout = markerFirepowerLayout(counter)
    if (layout) return (
      <g>
        <path d={layout.path} style={layout.style as object} />
        <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
              fontFamily="'Courier Prime', monospace"
              style={layout.tStyle as object}>{layout.value}</text>
      </g>
    )
  }

  const markerRange = () => {
    const layout = markerRangeLayout(counter)
    if (layout) return (
      <g>
        <path d={layout.path} style={layout.style as object} />
        <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
              fontFamily="'Courier Prime', monospace"
              style={layout.tStyle as object}>{layout.value}</text>
      </g>
    )
  }

  const markerMovement = () => {
    const layout = markerMovementLayout(counter)
    if (layout) return (
      <g>
        <path d={layout.path} style={layout.style as object} />
        <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
              fontFamily="'Courier Prime', monospace"
              style={layout.tStyle as object}>{layout.value}</text>
      </g>
    )
  }

  const elite = () => {
    const layout = eliteLayout(counter)
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
    const layout = markerLayout(counter)
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
    const layout = turnLayout(counter)
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
    const layout = windArrowLayout(counter)
    if (layout) return <path d={layout.path} style={layout.style as object} />
  }

  const markerSub = () => {
    const layout = markerSubLayout(counter)
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
    const layoutSrc = featureLayout(counter)
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
    const layoutSrc = counterStatusLayout(counter)
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
  
  const overlay = () => {
    return (
      <path d={counterPath(counter)} style={{ fill: "rgba(0,0,0,0)" }}
            onMouseEnter={() => ovCallback(
              { show: true, x: counter.hex?.x, y: counter.hex?.y }
            )} />
    )
  }

  const rotation = () => {
    const r = counter.rotation
    return r ? `${r.a} ${r.x} ${r.y}` : "0"
  }

  return (
    <g transform={`rotate(${rotation()})`} opacity={counter.targetUF.ghost ? 0.7 : 1}>
      {shadow()}
      {counterBack}
      {nameBackground()}{name()}
      {morale()}
      {weaponBreak()}{size()}
      {leadership()}{handling()}{breakdown()}{weaponFix()}
      {icon()}{centerLabel()}
      {sponson()}{turretArmor()}{hullArmor()}
      {feature()}
      {firepower()}{range()}{movement()}
      {smoke()}{gunForward()}{gunBackward()}{engineer()}{amphibious()}
      {elite()}
      {tow()}{canTow()}{leftTransport()}{rightTransport()}
      {marker()}{windArrow()}{markerSub()}{turnBadges()}
      {markerBreak()}{markerFix()}
      {markerMorale()}{markerFirepower()}{markerRange()}{markerMovement()}
      {status()}
      {showDisabled()}
      {counterOutline}
      {overlay()}
    </g>
  )
}
