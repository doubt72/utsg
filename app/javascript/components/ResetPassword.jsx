import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import Logo from "./Logo"

export default () => {
  const navigate = useNavigate();
  const [formInput, setFormInput] = useState({
    username: "", code: "", password: "", confirmPassword: ""
  });
  const [formErrors, setFormError] = useState({
    username: "", code: "", password: "", confirmPassword: ""
  });

  const anyEmpty = () => {
    if (formInput.username === "") {
      validateForm("username", "")
      return true
    } else if (formInput.code === "") {
      validateForm("code", "")
      return true
    } else if (formInput.password === "") {
      validateForm("password", "")
      return true
    }
    return false
  }

  const validateForm = (name, value) => {
    let usernameError = formErrors.username;
    let codeError = formErrors.code;
    let passwordError = formErrors.password;
    let confirmPasswordError = formErrors.confirmPassword;

    if (name === "username") {
      if (value === "") {
        usernameError = "please supply a username or email address";
      } else {
        usernameError = ""
      }
    } else if (name === "code") {
      if (value === "") {
        codeError = "please enter your recovery code";
      } else {
        codeError = ""
      }
    } else if (name === "password") {
      if (value !== formInput.confirmPassword) {
        confirmPasswordError = "passwords must match";
        passwordError = "";
      } else if (value === "") {
        passwordError = "password must not be blank";
        confirmPasswordError = "";
      } else {
        confirmPasswordError = "";
        passwordError = "";
      }
    } else if (name === "confirmPassword") {
      if (value !== formInput.password) {
        confirmPasswordError = "passwords must match";
        passwordError = "";
      } else if (formInput.password === "") {
        passwordError = "password must not be blank";
        confirmPasswordError = "";
      } else {
        passwordError = "";
        confirmPasswordError = "";
      }
    }
    setFormError({
      username: usernameError,
      code: codeError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });
    return usernameError === "" && codeError === "" && passwordError === "" && confirmPasswordError === ""
  }

  const onChange = (name, value) => {
    setFormInput({ ...formInput, [name]: value });
    validateForm(name, value);
  }

  const onSubmit = (event) => {
    event.preventDefault();
    if (!validateForm("", "") || anyEmpty()) {
      return false;
    } else {
      const url = "/api/v1/user/password_reset";

      const body = {
        check: formInput.username,
        code: formInput.code,
        password: formInput.password,
      };

      const token = document.querySelector('meta[name="csrf-token"]').content;
      fetch(url, {
        method: "POST",
        headers: {
          "X-CSRF-Token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }).then(response => {
        if (response.ok) {
          navigate("/login", { replace: true });
          return
        } else if (response.status === 403) {
          setFormError({
            username: "",
            code: "recovery code is not valid",
            password: "",
            confirmPassword: "",
          });
          return
        }
        console.log(response.json());
      }).catch(error => console.log(error.message));
    }
  };

  const passwordTooltip = "we don't enforce any password quality at all but<br />" +
                          "you should still choose a unique, secure password<br />" +
                          "and if you don't, that's on you"

  return (
    <div>
      <div className="header">
        <Logo />
      </div>
      <div className="form-container">
        <div className="mb1em">
          If a recovery code has been sent to your email, you can use it here to reset
          your password.
        </div>
        <form onSubmit={onSubmit}>
          <label>username or email address</label>
          <input
            type="text"
            name="username"
            className="form-input"
            onChange={({ target }) => onChange(target.name, target.value)}
          />
          <div className="form-error-message">{formErrors.username}</div>
          <label>recovery code</label>
          <input
            type="code"
            name="code"
            className="form-input"
            onChange={({ target }) => onChange(target.name, target.value)}
          />
          <div className="form-error-message">{formErrors.code}</div>
          <label>
            new password
            <sup className="standard-tooltip" data-tooltip-id="code-tt" data-tooltip-html={passwordTooltip}>
              ⬤
            </sup>
            <Tooltip className="standard-tooltip-popout" id="code-tt" />
          </label>
          <input
            type="password"
            name="password"
            className="form-input"
            onChange={({ target }) => onChange(target.name, target.value)}
          />
          <div className="form-error-message">{formErrors.password}</div>
          <label>confirm password</label>
          <input
            type="password"
            name="confirmPassword"
            id="userConfirmPassword"
            className="form-input"
            onChange={({ target }) => onChange(target.name, target.value)}
          />
          <div className="form-error-message">{formErrors.confirmPassword}</div>
          <div className="align-end">
            <Link to="/" className="custom-button">
              cancel
            </Link>
            <button type="submit" className="custom-button">
              reset password
            </button>
          </div>
        </form>
      </div>
    </div>
  )
};