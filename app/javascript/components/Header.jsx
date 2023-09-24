import React from "react";
import { Link } from "react-router-dom";

export default () => {

  const loggedIn = (
    <div className="header-user-controls">
      <Link to="/about" className="custom-button">about</Link>
      <Link to="/profile" className="custom-button">profile</Link>
      <Link to="/logout" className="custom-button">logout</Link>
    </div>
  );

  const loggedOut = (
    <div className="header-user-controls">
      <Link to="/about" className="custom-button">about</Link>
      <Link to="/login" className="custom-button">login</Link>
      <Link to="/signup" className="custom-button">signup</Link>
    </div>
  );

  return (
    <div className="header">
      <div className="header-logo">UTSG</div>
      { localStorage.getItem("username") ? loggedIn : loggedOut }
    </div>
  )
};
