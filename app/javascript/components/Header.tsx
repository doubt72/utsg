import React from "react";
import Logo from "./Logo";
import { AboutButton, LoginButton, LogoutButton, ProfileButton, SignupButton } from "./utilities/buttons";

interface HeaderProps {
  hideAbout?: string;
  hideProfile?: string;
}

export default function Header({ hideAbout, hideProfile}: HeaderProps) {
  const profileSection = (
    <ProfileButton />
  )

  const loggedIn = (
    <div className="header-section header-right">
      <span className="mr1em">logged in as {localStorage.getItem("username")}</span>
      { (hideProfile === "true") ? '' : profileSection }
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
      { (hideAbout === "true") ? '' : headerSection }
      { localStorage.getItem("username") ? loggedIn : loggedOut }
    </div>
  )
}
