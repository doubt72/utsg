import React from "react";
import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <div className="header-logo">
      <Link to="/">
        <img src="/assets/utsg-48.png" alt="UTSG Logo" />
      </Link>
    </div>
  )
}
