import React, { useEffect } from "react";
import Header from './Header'
import { useNavigate } from "react-router-dom";

export default () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("validationNeeded")) {
      navigate("/validate_account", { replace: true });
    }
  }, []);

  return (
    <div className="main-page">
      <Header />
      <div className="standard-body">
        <div className="main-page-chat">
          Some sort of chat bullshit coming soon.
        </div>
        <div className="main-page-announcements">
          <p>
            The UTSG server is still massively under construction.  If you're seeing this, you're
            probably just looking at the github repo, nothing is actually out there being hosted
            anywhere yet.

            There are, as yet, no announcements.
          </p>
        </div>
      </div>
      <div className="standard-body"></div>
    </div>
  )
};
