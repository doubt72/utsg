import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header"

export default () => {

  return (
    <div>
      <Header hideAbout="true" />
      <div className="standard-body">
        <div className="about-about">
          <p>Untitled TSG</p>
          <p>blah blah blah</p>
          <p>blah blah blah</p>
          <p>blah blah blah</p>
          <div className="align-end">
            <Link to="/" className="custom-button">back to main page</Link>
          </div>
        </div>
        <div className="about-logo">
          <img src="/assets/utsg-160.png" alt="UTSG Logo" />
        </div>
      </div>
    </div>
  )
};
