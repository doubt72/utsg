import React, { useEffect } from "react";
import Logo from "../Logo";
import { postAPI } from "../../utilities/network";
import { ValidateAccountButton } from "../utilities/buttons";

export default () => {
  const email = localStorage.getItem("email")

  useEffect(() => {
    postAPI("/api/v1/user/new_code", {}, {
      ok: _response => {}
    })
  }, [])

  return (
    <div>
      <div className="header">
        <Logo />
      </div>
      <div className="form-container">
        A new verification code has been generated and was sent to your
        email: {email}
        <div className="align-end mt1em">
          <ValidateAccountButton />
        </div>
      </div>
    </div>
  )
}
