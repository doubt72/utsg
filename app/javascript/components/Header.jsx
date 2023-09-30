import React from "react";
import PropType from "prop-types";
import Logo from "./Logo";
import { AboutButton, LoginButton, LogoutButton, ProfileButton, SignupButton } from "./utilities/buttons";

export default function Header(props) {
  const profileSection = (
    <ProfileButton />
  )

  const loggedIn = (
    <div className="header-section header-right">
      <span className="mr1em">logged in as {localStorage.getItem("username")}</span>
      { (props.hideProfile === "true") ? '' : profileSection }
      <LogoutButton />
    </div>
  )

  const loggedOut = (
    <div className="header-section header-right">
      <SignupButton />
      <LoginButton />
    </div>
  )

  const headerSection = (
    <div className="header-section">
      <AboutButton />
    </div>
  )

  return (
    <div className="header">
      <Logo />
      { (props.hideAbout === "true") ? '' : headerSection }
      { localStorage.getItem("username") ? loggedIn : loggedOut }
    </div>
  )
}

Header.propTypes = {
  hideAbout: PropType.string,
  hideProfile: PropType.string,
}
