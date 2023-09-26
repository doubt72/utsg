import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo"
import { ArrowRepeat, BoxArrowInRight, XCircle } from "react-bootstrap-icons";

export default () => {
  const navigate = useNavigate();
  const [formInput, setFormInput] = useState({ username: "", password: "" });
  const [formErrors, setFormError] = useState({ username: "", password: "" });

  const anyEmpty = () => {
    if (formInput.username === "") {
      validateForm("username", "")
      return true
    } else if (formInput.password === "") {
      validateForm("password", "")
      return true
    }
    return false
  }

  const validateForm = (name, value) => {
    let usernameError = formErrors.username;
    let passwordError = formErrors.password;

    if (name === "username") {
      if (value === "") {
        usernameError = "please enter a username or email";
      } else {
        usernameError = ""
      }
    } else if (name === "password") {
      if (value === "") {
        passwordError = "please enter a password";
      } else {
        passwordError = "";
      }
    }
    setFormError({ username: usernameError, password: passwordError });
    return usernameError === "" && passwordError === ""
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
      const url = "/api/v1/session";

      const body = {
        user: {
          username: formInput.username,
          password: formInput.password,
        }
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
            const json = response.json().then(json => {
              localStorage.setItem("username", json.username)
              localStorage.setItem("email", json.email)
              navigate("/", { replace: true });
            })
            return
          } else if (response.status === 401) {
            setFormError({ username: "", password: "username not found or password incorrect" });
          }
          console.log(response.json());
      }).catch(error => console.log(error.message));
    }
  };

  return (
    <div>
      <div className="header">
        <Logo />
      </div>
      <div className="form-container">
        <form onSubmit={onSubmit}>
          <label>username or email address</label>
          <input
            type="text"
            name="username"
            className="form-input"
            onChange={({ target }) => onChange(target.name, target.value)}
          />
          <div className="form-error-message">{formErrors.username}</div>
          <label>password</label>
          <input
            type="password"
            name="password"
            className="form-input"
            onChange={({ target }) => onChange(target.name, target.value)}
          />
          <div className="form-error-message">{formErrors.password}</div>
          <div className="align-end">
            <Link to="/" className="custom-button">
              <XCircle />cancel
            </Link>
            <button type="submit" className="custom-button">
              <BoxArrowInRight />login
            </button>
          </div>
        </form>
        <div className="mt1em">
          If you've forgotten your password, you can recover your account here:
        </div>
        <div className="align-end mt1em">
          <Link to="/recover_account" className="custom-button">
            <ArrowRepeat />recover account
          </Link>
        </div>
      </div>
    </div>
  )
};
