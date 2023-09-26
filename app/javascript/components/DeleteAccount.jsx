import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo"
import { Trash3, XCircle } from "react-bootstrap-icons";

export default () => {
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const onChange = (value) => {
    setConfirm(value);
    if (value !== "DELETE") {
      setConfirmError("value does not equal 'DELETE'");
    } else {
      setConfirmError("are you really really sure?");
    }
  }

  const onSubmit = (event) => {
    event.preventDefault();
    if (confirm !== "DELETE") {
      return false;
    } else {
      const token = document.querySelector('meta[name="csrf-token"]').content;
      fetch("/api/v1/user", {
        method: "DELETE",
        headers: {
          "X-CSRF-Token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }).then(response => {
          if (response.ok) {
            localStorage.removeItem("username")
            localStorage.removeItem("email")
            navigate("/");
            return
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
        <div className="mb1em">
          <p>Are you sure you want to delete this account?</p>
        </div>
        <form onSubmit={onSubmit}>
          <label>Enter '<span className="red">DELETE</span>' to confirm that you want to delete this account:</label>
          <input
            type="text"
            name="confirm"
            className="form-input"
            onChange={({ target }) => onChange(target.value)}
          />
          <div className="form-error-message">{confirmError}</div>
          <div className="align-end">
            <Link to="/" className="custom-button">
              <XCircle />cancel
            </Link>
            <button type="submit" className="custom-button">
              <Trash3 />delete account
            </button>
          </div>
        </form>
      </div>
    </div>
  )
};
