import React from "react";
import { Link } from "react-router-dom";

export default function DebugIndex() {
  return (
    <div className="flex">
      <div className="p1em">
        Maps:
        <ul>
          <li><Link to={"/debug/map/0"}>Map 0</Link></li>
          <li><Link to={"/debug/map/1"}>Map 1</Link></li>
          <li><Link to={"/debug/map/2"}>Map 2</Link></li>
          <li><Link to={"/debug/map/3"}>Small Map</Link></li>
        </ul>
        Scenario Statistics:
        <ul>
          <li><Link to={"/debug/stats/scenarios"}>page</Link></li>
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
        Units by Type:
        <ul>
          <li><Link to={"/debug/units/type"}>all</Link></li>
        </ul>
        Types:
        <ul>
          <li><Link to={"/debug/units/type/ldr"}>leaders</Link></li>
          <li><Link to={"/debug/units/type/sqd"}>infantry squads</Link></li>
          <li><Link to={"/debug/units/type/tm"}>infantry teams</Link></li>
          <li><Link to={"/debug/units/type/sw"}>infantry weapons</Link></li>
          <li><Link to={"/debug/units/type/gun"}>guns</Link></li>
          <li><Link to={"/debug/units/type/tank"}>tanks</Link></li>
          <li><Link to={"/debug/units/type/spg"}>self-propelled guns</Link></li>
          <li><Link to={"/debug/units/type/ac"}>armored cars</Link></li>
          <li><Link to={"/debug/units/type/ht"}>half-tracks</Link></li>
          <li><Link to={"/debug/units/type/truck"}>trucks</Link></li>
          <li><Link to={"/debug/units/type/cav"}>cavalry</Link></li>
        </ul>
        Functions:
        <ul>
          <li><Link to={"/debug/units/ability/assault"}>assault</Link></li>
          <li><Link to={"/debug/units/ability/smoke"}>smoke</Link></li>
          <li><Link to={"/debug/units/ability/eng"}>engineering</Link></li>
          <li><Link to={"/debug/units/ability/tow"}>can be towed</Link></li>
          <li><Link to={"/debug/units/ability/amp"}>amphibious</Link></li>
          <li><Link to={"/debug/units/ability/trans"}>transports</Link></li>
          <li><Link to={"/debug/units/ability/spon"}>sponsons</Link></li>
        </ul>
      </div>
      <div className="p1em">
        Markers:
        <ul>
          <li><Link to={"/debug/markers"}>and features</Link></li>
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
      <div className="p1em">
        Unit Statistics:
        <ul>
          <li><Link to={"/debug/stats/units"}>all</Link></li>
        </ul>
        Countries:
        <ul>
          <li><Link to={"/debug/stats/units/ussr"}>soviet</Link></li>
          <li><Link to={"/debug/stats/units/uk"}>commonwealth</Link></li>
          <li><Link to={"/debug/stats/units/usa"}>american</Link></li>
          <li><Link to={"/debug/stats/units/fra"}>french</Link></li>
          <li><Link to={"/debug/stats/units/chi"}>chinese</Link></li>
          <li><Link to={"/debug/stats/units/alm"}>allied minors</Link></li>
        </ul>
        <ul>
          <li><Link to={"/debug/stats/units/ger"}>german</Link></li>
          <li><Link to={"/debug/stats/units/ita"}>italian</Link></li>
          <li><Link to={"/debug/stats/units/jap"}>japanese</Link></li>
          <li><Link to={"/debug/stats/units/fin"}>finnish</Link></li>
          <li><Link to={"/debug/stats/units/axm"}>axis minors</Link></li>
        </ul>
      </div>
    </div>
  )
}