import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo"

export default () => {
  const email = localStorage.getItem("email")

  useEffect(() => {
    const token = document.querySelector('meta[name="csrf-token"]').content;
    fetch("/api/v1/user/new_code", {
      method: "POST",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }).then(response => {
        if (response.ok) {
          return
        }
        console.log(response.json());
    }).catch(error => console.log(error.message));
  }, []);

  return (
    <div>
      <div className="header">
        <Logo />
      </div>
      <div className="standard-body">
        <div className="standard-section">
          A new verification code has been generated and was sent to your
          email: {email}
          <div className="mt1em">
            <Link to="/validate_account" className="custom-button">
              continue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
