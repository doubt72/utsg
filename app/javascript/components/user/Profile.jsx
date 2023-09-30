import React from "react";
import Header from "../Header"
import ProfileEditInfo from "./ProfileEditInfo"
import ProfileEditPassword from "./ProfileEditPassword"
import { ReturnButton } from "../utilities/buttons";

export default function Profile() {

  return (
    <div>
      <Header hideProfile="true" />
      <div className="standard-body">
        <div className="profile-main">
          <p>
            Hello {localStorage.getItem("username")}!
          </p>
          <div className="align-end">
            <ReturnButton />
          </div>
        </div>
        <ProfileEditInfo />
        <ProfileEditPassword />
      </div>
    </div>
  )
}
