import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header"
import ProfileEditInfo from "./ProfileEditInfo"
import ProfileEditPassword from "./ProfileEditPassword"
import { Hexagon } from "react-bootstrap-icons";

export default () => {

  return (
    <div>
      <Header hideProfile="true" />
      <div className="standard-body">
        <div className="profile-main">
          <p>
            Hello {localStorage.getItem("username")}!
          </p>
          <div className="align-end">
            <Link to="/" className="custom-button"><Hexagon />back to main page</Link>
          </div>
        </div>
        <ProfileEditInfo />
        <ProfileEditPassword />
      </div>
    </div>
  )
};
