import React from "react";
import Header from "./Header";
import { ReturnButton } from "./utilities/buttons";

export default () => {
  return (
    <div>
      <Header hideAbout="true" />
      <div className="standard-body">
        <div className="about-about">
          <p>This is the Untitled TSG server.</p>
          <p>I mean, I'm basically working on it.</p>
          <p>Might want to add some code of conduct here, and if so, link here from the signup page.</p>
          <div className="align-end">
            <ReturnButton />
          </div>
        </div>
        <div className="about-logo">
          <img src="/assets/utsg-160.png" alt="UTSG Logo" />
        </div>
      </div>
    </div>
  )
}
