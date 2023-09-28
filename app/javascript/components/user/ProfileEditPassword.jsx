import React, { useState } from "react";
import { putAPI } from "../../utilities/network";
import { PasswordTooltip } from "../utilities/tooltips";
import { ChangePasswordButton } from "../utilities/buttons";

export default () => {
  const [formInput, setFormInput] = useState({
    oldPassword: "", password: "", confirmPassword: ""
  })
  const [formErrors, setFormError] = useState({
    oldPassword: "", password: "", confirmPassword: ""
  })

  const anyEmpty = () => {
    if (formInput.oldPassword === "") {
      validateForm("oldPassword", "")
      return true
    } else if (formInput.password === "") {
      validateForm("password", "")
      return true
    }
    return false
  }

  const validateForm = (name, value) => {
    let oldPasswordError = formErrors.oldPassword
    let passwordError = formErrors.password
    let confirmPasswordError = formErrors.confirmPassword

    if (name === "oldPassword") {
      if (value === "") {
        oldPasswordError = "please enter your current password"
      } else {
        oldPasswordError = ""
      }
    } else if (name === "password") {
      if (value !== formInput.confirmPassword) {
        confirmPasswordError = "new passwords must match"
        passwordError = ""
      } else if (value === "") {
        passwordError = "new password must not be blank"
        confirmPasswordError = ""
      } else {
        confirmPasswordError = ""
        passwordError = ""
      }
    } else if (name === "confirmPassword") {
      if (value !== formInput.password) {
        confirmPasswordError = "new passwords must match"
        passwordError = ""
      } else if (formInput.password === "") {
        passwordError = "new password must not be blank"
        confirmPasswordError = ""
      } else {
        passwordError = ""
        confirmPasswordError = ""
      }
    }
    setFormError({
      oldPassword: oldPasswordError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    })
    return oldPasswordError === "" && passwordError === "" && confirmPasswordError === ""
  }

  const onChange = (name, value) => {
    setFormInput({ ...formInput, [name]: value })
    validateForm(name, value)
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (!validateForm("", "") || anyEmpty()) {
      return false
    } else {
      const body = {
        user: {
          old_password: formInput.oldPassword,
          password: formInput.password,
        }
      }

      putAPI("/api/v1/user", body, {
        ok: _response => {
          setFormInput({ oldPassword: "", password: "", confirmPassword: "" })
        },
        unauthorized: _response => {
          setFormError({ oldPassword: "old password not valid", password: "", confirmPassword: "" })
        }
      })
    }
  }

  return (
    <div className="profile-form">
      <div className="mb1em">
        You can change your password here:
      </div>
      <form onSubmit={onSubmit}>
        <label>current password</label>
        <input
          type="password"
          name="oldPassword"
          value={formInput.oldPassword}
          className="form-input"
          onChange={({ target }) => onChange(target.name, target.value)}
        />
        <div className="form-error-message">{formErrors.oldPassword}</div>
        <label>new password<PasswordTooltip /></label>
        <input
          type="password"
          name="password"
          value={formInput.password}
          className="form-input"
          onChange={({ target }) => onChange(target.name, target.value)}
        />
        <div className="form-error-message">{formErrors.password}</div>
        <label>confirm new password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formInput.confirmPassword}
          id="userConfirmPassword"
          className="form-input"
          onChange={({ target }) => onChange(target.name, target.value)}
        />
        <div className="form-error-message">{formErrors.confirmPassword}</div>
        <div className="align-end">
          <ChangePasswordButton />
        </div>
      </form>
    </div>
  )
}
