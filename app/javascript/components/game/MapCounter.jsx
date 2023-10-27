import React from "react";
import PropTypes from "prop-types"
import { Counter } from "../../engine/counter";

export default function MapCounter(props) {

  const counterBack = (
    <path d={props.counter.counterPath()} style={props.counter.counterStyle} />
  )

  const nameBackground = (
    <path d={props.counter.nameBackgroundPath} style={props.counter.nameBackgroundStyle} />
  )

  const shadow = () => {
    const layout = props.counter.shadowPath
    if (layout) {
      return (
        <path d={layout} style={{ fill: "rgba(0,0,0,0.2)" }} />
      )
    }
  }

  const name = () => {
    const layout = props.counter.nameLayout
    return (
      <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="start"
            style={layout.style}>{layout.name}</text>
    )
  }

  const morale = () => {
    const layout = props.counter.moraleLayout
    if (layout) return (
      <text x={layout.x} y={layout.y} fontSize={layout.fsize} textAnchor="middle"
            fontFamily="monospace" style={layout.style}>{layout.value}</text>
    )
  }

  const weaponBreak = () => {
    const layout = props.counter.weaponBreakLayout
    if (layout) return (
      <g>
        <path d={layout.path} style={layout.style} />
        <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
              fontFamily="monospace" style={layout.tStyle}>{layout.value}</text>
      </g>
    )
  }

  const size = () => {
    const layout = props.counter.sizeLayout
    if (layout) return (
      <g>
        <path d={layout.path} style={layout.style} />
        <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
              fontFamily="monospace" style={layout.tStyle}>{layout.value}</text>
      </g>
    )
  }

  const leadership = () => {
    const layout = props.counter.leadershipLayout
    if (layout) return (
      <g>
        <path d={layout.path} style={layout.style} />
        <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
              fontFamily="monospace" style={layout.tStyle}>{layout.value}</text>
      </g>
    )
  }

  const handling = () => {
    const layout = props.counter.handlingLayout
    if (layout) return (
      <g>
        <path d={layout.path} style={layout.style} />
        <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
              fontFamily="monospace" style={layout.tStyle}>{layout.value}</text>
      </g>
    )
  }

  const breakdown = () => {
    const layout = props.counter.breakdownLayout
    if (layout) return (
      <g>
        <path d={layout.path} style={layout.style} />
        <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
              fontFamily="monospace" style={layout.tStyle}>{layout.value}</text>
      </g>
    )
  }

  const smoke = () => {
    const layout = props.counter.smokeLayout
    if (layout) return (
      <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
            fontFamily="monospace" style={layout.style}>{layout.value}</text>
    )
  }

  const icon = (
    <image width="40" height="40" x={props.counter.x + 20} y={props.counter.y + 13}
           href={`/assets/units/${props.counter.icon}.svg`} /> 
  )

  const sponson = () => {
    const layout = props.counter.sponsonLayout
    if (layout) return (
      <g>
        <path d={layout.path} style={layout.style} />
        <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
              fontFamily="sans-serif" style={{fill: "black"}}>{layout.value}</text>
      </g>
    )
  }

  const turretArmor = () => {
    const layout = props.counter.turretArmorLayout
    if (layout) return (
      <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
            fontFamily="sans-serif" style={{fill: "black"}}>{layout.value}</text>
    )
  }

  const hullArmor = () => {
    const layout = props.counter.hullArmorLayout
    if (layout) return (
      <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
            fontFamily="sans-serif" style={{fill: "black"}}>{layout.value}</text>
    )
  }

  const firepower = () => {
    const layout = props.counter.firepowerLayout
    if (layout) return (
      <g>
        <path d={layout.path} style={layout.style} />
        <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
              fontFamily="monospace" style={layout.tStyle}>{layout.value}</text>
      </g>
    )
  }

  const range = () => {
    const layout = props.counter.rangeLayout
    if (layout) return (
      <g>
        <path d={layout.path} style={layout.style} />
        <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
              fontFamily="monospace" style={layout.tStyle}>{layout.value}</text>
      </g>
    )
  }

  const movement = () => {
    const layout = props.counter.movementLayout
    if (layout) return (
      <g>
        <path d={layout.path} style={layout.style} />
        <text x={layout.x} y={layout.y} fontSize={layout.size} textAnchor="middle"
              fontFamily="monospace" style={layout.tStyle}>{layout.value}</text>
      </g>
    )
  }

  const status = () => {
    const layout = props.counter.statusLayout
    if (layout) {
      const text = layout.value.map((t, i) => (
        <text key={i} x={layout.x} y={layout.y + layout.size*i} fontSize={layout.size}
              textAnchor="middle" fontFamily="monospace" style={layout.fStyle}>{t}</text>
      ))
      const c = props.counter
      const r = c.rotation
      return (
        <g opacity="0.8" transform={`rotate(${r ? `${-r.a} ${c.x+40} ${c.y+40}` : "0"})`}>
          <path d={layout.path} style={layout.style} />
          {text}
        </g>
      )
    }
  }

  const rotation = () => {
    const r = props.counter.rotation
    return r ? `${r.a} ${r.x} ${r.y}` : "0"
  }

  return (
    <g transform={`rotate(${rotation()})`}>
      {shadow()}
      {counterBack}
      {nameBackground}{name()}
      {morale()}
      {weaponBreak()}{size()}
      {leadership()}{handling()}{breakdown()}{smoke()}
      {icon}
      {sponson()}{turretArmor()}{hullArmor()}
      {firepower()}{range()}{movement()}
      {status()}
    </g>
  )
}

MapCounter.propTypes = {
  counter: PropTypes.instanceOf(Counter),
  x: PropTypes.number,
  y: PropTypes.number,
}