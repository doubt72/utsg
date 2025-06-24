import React from "react";
import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <div className="header-logo">
      <Link to="/">
        <img src="/assets/logo-48.png" alt="Logo" />
      </Link>
    </div>
  )
}
