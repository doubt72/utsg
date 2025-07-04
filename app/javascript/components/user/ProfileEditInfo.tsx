import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { putAPI } from "../../utilities/network";
import { DeleteButton, UpdateInfoButton } from "../utilities/buttons";
import DeleteAccount from "./DeleteAccount";

export default function ProfileEditInfo() {
  const navigate = useNavigate()
  const [formInput, setFormInput] = useState({
    username: localStorage.getItem("username") ?? undefined,
    email: localStorage.getItem("email") ?? undefined,
  })
  const [formErrors, setFormError] = useState({ username: "", email: "" })
  const [deleting, setDeleting] = useState(false)

  const anyEmpty = () => {
    if (formInput.username === "") {
      validateForm("username", "")
      return true
    } else if (formInput.email === "") {
      validateForm("email", "")
      return true
    }
    return false
  }

  const validateForm = (name: string, value: string) => {
    let usernameError = formErrors.username
    let emailError = formErrors.email

    if (name === "username") {
      if (value === "") {
        usernameError = "username must not be blank"
      } else {
        usernameError = ""
      }
    } else if (name === "email") {
      const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      if (value === "") {
        emailError = "email must not be blank"
      } else if (value.match(validRegex)) {
        emailError = ""
      } else {
        emailError = "please enter a valid email address"
      }
    }
    setFormError({
      username: usernameError,
      email: emailError,
    })
    return usernameError === "" && emailError === ""
  }

  const onChange = (name: string, value: string) => {
    setFormInput({ ...formInput, [name]: value })
    validateForm(name, value)
  }

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!validateForm("", "") || anyEmpty()) {
      return false
    } else {
      const body = {
        user: {
          username: formInput.username,
          email: formInput.email,
        }
      }

      putAPI("/api/v1/user", body, {
        ok: response => {
          response.json().then(json => {
            localStorage.setItem("username", json.username)
            localStorage.setItem("email", json.email)
            navigate("/profile", { replace: true })
          })
        }
      })
    }
  }

  const onDeleteSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setDeleting(true)
  }

  const deleteForm = (
    <div className="delete-confirm-form">
      <form onSubmit={onDeleteSubmit}>
        <div className="mt1em mb1em">You can delete your account here:</div>
        <div className="align-end">
          <DeleteButton />
        </div>
      </form>
    </div>
  )

  const deleteConfirmForm = <DeleteAccount reset={() => setDeleting(false)} />

  return (
    <div className="profile-form mr05em ml05em">
      <div className="mb1em">
        You can change your username or email here:
      </div>
      <form onSubmit={onSubmit}>
        <label className="form-label">username</label>
        <input
          type="text"
          name="username"
          value={formInput.username}
          className="form-input"
          onChange={({ target }) => onChange(target.name, target.value)}
        />
        <div className="form-error-message">{formErrors.username}</div>
        <label className="form-label">email</label>
        <input
          type="email"
          name="email"
          value={formInput.email}
          className="form-input"
          onChange={({ target }) => onChange(target.name, target.value)}
        />
        <div className="form-error-message">{formErrors.email}</div>
        <div className="align-end">
          <UpdateInfoButton />
        </div>
      </form>
      { deleting ? deleteConfirmForm : deleteForm }
    </div>
  )
}
