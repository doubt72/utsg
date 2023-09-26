import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default () => {
  const navigate = useNavigate();
  const [formInput, setFormInput] = useState({
    username: localStorage.getItem("username"),
    email: localStorage.getItem("email"),
  });
  const [formErrors, setFormError] = useState({ username: "", email: "" });

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

  const validateForm = (name, value) => {
    let usernameError = formErrors.username;
    let emailError = formErrors.email;

    if (name === "username") {
      if (value === "") {
        usernameError = "username must not be blank";
      } else {
        usernameError = ""
      }
    } else if (name === "email") {
      const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (value === "") {
        emailError = "email must not be blank";
      } else if (value.match(validRegex)) {
        emailError = "";
      } else {
        emailError = "please enter a valid email address"
      }
    }
    setFormError({
      username: usernameError,
      email: emailError,
    });
    return usernameError === "" && emailError === ""
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
      const url = "/api/v1/user";

      const body = {
        user: {
          username: formInput.username,
          email: formInput.email,
        }
      };

      const token = document.querySelector('meta[name="csrf-token"]').content;
      fetch(url, {
        method: "PUT",
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
              navigate("/profile", { replace: true });
            })
            return
          }
          console.log(response.json());
      }).catch(error => console.log(error.message));
    }
  };

  return (
    <div className="profile-form mr1em">
      <div className="mb1em">
        You can change your username or email here:
      </div>
      <form onSubmit={onSubmit}>
        <label>username</label>
        <input
          type="text"
          name="username"
          value={formInput.username}
          className="form-input"
          onChange={({ target }) => onChange(target.name, target.value)}
        />
        <div className="form-error-message">{formErrors.username}</div>
        <label>email</label>
        <input
          type="email"
          name="email"
          value={formInput.email}
          className="form-input"
          onChange={({ target }) => onChange(target.name, target.value)}
        />
        <div className="form-error-message">{formErrors.email}</div>
        <div className="align-end">
          <button type="submit" className="custom-button">
            update user info
          </button>
        </div>
      </form>
      <div className="mt1em mb1em">You can delete your account here:</div>
      <div className="align-end">
        <Link to="/delete_account" className="custom-button">delete account</Link>
      </div>
    </div>
  )
};
