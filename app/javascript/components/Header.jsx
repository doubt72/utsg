import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo"

export default (props) => {
  const profileSection = (
    <Link to="/profile" className="custom-button">profile</Link>
  )

  const loggedIn = (
    <div className="header-section header-right">
      <span className="mr1em">logged in as {localStorage.getItem("username")}</span>
      { (props.hideProfile === "true") ? '' : profileSection }
      <Link to="/logout" className="custom-button">logout</Link>
    </div>
  );

  const loggedOut = (
    <div className="header-section header-right">
      <Link to="/signup" className="custom-button">sign up</Link>
      <Link to="/login" className="custom-button">login</Link>
    </div>
  );

  const headerSection = (
    <div className="header-section">
      <Link to="/about" className="custom-button">about</Link>
    </div>
  )

  return (
    <div className="header">
      <Logo />
      { (props.hideAbout === "true") ? '' : headerSection }
      { localStorage.getItem("username") ? loggedIn : loggedOut }
    </div>
  )
};
