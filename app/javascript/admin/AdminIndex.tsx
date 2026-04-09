import React from "react";
import { Link } from "react-router-dom";

export default function AdminIndex() {
  return (
    <div className="flex">
      <div className="p1em">
        Users:
        <ul>
          <li><Link to={"/admin/users"}>all users</Link></li>
        </ul>
      </div>
      <div className="p1em">
        Games:
        <ul>
          <li><Link to={"/admin/stats/games"}>game stats</Link></li>
        </ul>
      </div>
    </div>
  )
}
