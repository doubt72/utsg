import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../Logo";
import { postAPI } from "../../utilities/network";
import { DeleteButton, LogoutButton, SendNewCodeButton, VerifyButton } from "../utilities/buttons";
import DeleteAccount from "./DeleteAccount";

export default function VerifyAccount() {
  const navigate = useNavigate()
  const [verificationCode, setVerificationCode] = useState("")
  const [verificationError, setVerificationError] = useState("")
  const [deleting, setDeleting] = useState(false)
  const [newCodeSent, setNewCodeSent] = useState(false)

  const email = localStorage.getItem("email")

  const onChange = (event, setFunction) => {
    setFunction(event.target.value)
  }

  const onSubmit = (event) => {
    event.preventDefault()
    const body = { code: verificationCode }
    postAPI("/api/v1/user/validate_code", body, {
      ok: () => {
        localStorage.removeItem("validationNeeded")
        navigate("/", { replace: true })
      },
      forbidden: () => setVerificationError("code does not match")
    })
  }

  const onNewCodeSubmit = (event) => {
    event.preventDefault()
    postAPI("/api/v1/user/new_code", {}, {
      ok: () => {}
    })
    setNewCodeSent(true)
  }

  const onDeleteSubmit = (event) => {
    event.preventDefault()
    setDeleting(true)
  }

  const codeSentMessage = (
    <div className="mt1em mb1em ml1em mr1em red">
      A new verification code has been generated and was sent to your
      email.
    </div>
  )

  const deleteForm = (
    <div className="delete-confirm-form">
      <form onSubmit={onDeleteSubmit}>
        <div className="align-end">
          <DeleteButton />
        </div>
      </form>
    </div>
  )

  const deleteConfirmForm = <DeleteAccount version="signup" reset={() => setDeleting(false)} />

  return (
    <div>
      <div className="header">
        <Logo />
      </div>
      <div className="form-container">
        <div className="mb1em">
          A verification code was sent to {email}.
          Please enter it here to activate your account.
        </div>
        <form onSubmit={onSubmit}>
          <label className="form-label">verification code:</label>
          <input
            type="text"
            name="verificationCode"
            className="form-input"
            onChange={event => onChange(event, setVerificationCode)}
          />
          <div className="form-error-message">{verificationError}</div>
          <div className="align-end">
            <LogoutButton />
            <VerifyButton />
          </div>
        </form>
        <form onSubmit={onNewCodeSubmit}>
          <div className="mt1em mb1em">
            If you did not receive the email with the verification code,
            you may request a new code:
          </div>
          <div className="align-end">
            <SendNewCodeButton />
          </div>
          { newCodeSent ? codeSentMessage : "" }
        </form>
        <div className="mt1em mb1em">
          If you no longer want to create an account with this username
          and password, you may cancel this signup and delete this account:
        </div>
        { deleting ? deleteConfirmForm : deleteForm }
      </div>
    </div>
  )
}
