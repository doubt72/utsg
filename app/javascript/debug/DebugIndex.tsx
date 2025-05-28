import React from "react";
import { Link } from "react-router-dom";

export default function DebugIndex() {
  return (
    <div className="flex">
      <div className="p1em">
        Maps:
        <ul>
          <li><Link to={"/debug/map/0"}>base test</Link></li>
          <li><Link to={"/debug/map/1"}>building LOS</Link></li>
          <li><Link to={"/debug/map/2"}>more LOS</Link></li>
          <li><Link to={"/debug/map/3"}>small WIP</Link></li>
        </ul>
      </div>
      <div className="p1em">
        Units:
        <ul>
          <li><Link to={"/debug/units"}>all</Link></li>
        </ul>
        Countries:
        <ul>
          <li><Link to={"/debug/units/ussr"}>soviet</Link></li>
          <li><Link to={"/debug/units/uk"}>commonwealth</Link></li>
          <li><Link to={"/debug/units/usa"}>american</Link></li>
          <li><Link to={"/debug/units/fra"}>french</Link></li>
          <li><Link to={"/debug/units/chi"}>chinese</Link></li>
          <li><Link to={"/debug/units/alm"}>allied minors</Link></li>
        </ul>
        <ul>
          <li><Link to={"/debug/units/ger"}>german</Link></li>
          <li><Link to={"/debug/units/ita"}>italian</Link></li>
          <li><Link to={"/debug/units/jap"}>japanese</Link></li>
          <li><Link to={"/debug/units/fin"}>finnish</Link></li>
          <li><Link to={"/debug/units/axm"}>axis minors</Link></li>
        </ul>
      </div>
      <div className="p1em">
        Units by Year:
        <ul>
          <li><Link to={"/debug/units/year"}>all</Link></li>
        </ul>
        Countries by Year:
        <ul>
          <li><Link to={"/debug/units/year/ussr"}>soviet</Link></li>
          <li><Link to={"/debug/units/year/uk"}>commonwealth</Link></li>
          <li><Link to={"/debug/units/year/usa"}>american</Link></li>
          <li><Link to={"/debug/units/year/fra"}>french</Link></li>
          <li><Link to={"/debug/units/year/chi"}>chinese</Link></li>
          <li><Link to={"/debug/units/year/alm"}>allied minors</Link></li>
        </ul>
        <ul>
          <li><Link to={"/debug/units/year/ger"}>german</Link></li>
          <li><Link to={"/debug/units/year/ita"}>italian</Link></li>
          <li><Link to={"/debug/units/year/jap"}>japanese</Link></li>
          <li><Link to={"/debug/units/year/fin"}>finnish</Link></li>
          <li><Link to={"/debug/units/year/axm"}>axis minors</Link></li>
        </ul>
      </div>
      <div className="p1em">
        Markers:
        <ul>
          <li><Link to={"/debug/markers"}>all</Link></li>
        </ul>
        Units/Markers:
        <ul>
          <li><Link to={"/debug/markers/ussr"}>soviet</Link></li>
          <li><Link to={"/debug/markers/uk"}>commonwealth</Link></li>
          <li><Link to={"/debug/markers/usa"}>american</Link></li>
          <li><Link to={"/debug/markers/fra"}>french</Link></li>
          <li><Link to={"/debug/markers/chi"}>chinese</Link></li>
          <li><Link to={"/debug/markers/alm"}>allied minors</Link></li>
        </ul>
        <ul>
          <li><Link to={"/debug/markers/ger"}>german</Link></li>
          <li><Link to={"/debug/markers/ita"}>italian</Link></li>
          <li><Link to={"/debug/markers/jap"}>japanese</Link></li>
          <li><Link to={"/debug/markers/fin"}>finnish</Link></li>
          <li><Link to={"/debug/markers/axm"}>axis minors</Link></li>
        </ul>
      </div>
    </div>
  )
}