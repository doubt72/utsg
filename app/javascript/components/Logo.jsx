import React from "react";
import { Link } from "react-router-dom";

export default () => {
  return (
    <div className="header-logo">
      <Link to="/">
        <img src="/assets/utsg-64.png" alt="UTSG Logo" />
      </Link>
    </div>
  )
};
