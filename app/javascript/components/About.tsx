import React from "react";
import Header from "./Header";
import { AboutHelpButton, ReturnButton } from "./utilities/buttons";

export default function About() {
  return (
    <div>
      <Header hideAbout="true" />
      <div className="standard-body">
        <div className="about-about">
          <p>This is the STB (Online) server.</p>
          <p>I mean, I&apos;m basically working on it.</p>
          <p>Might want to add some code of conduct here, and if so, link here from the signup page.</p>
          <div className="align-end">
            {AboutHelpButton()}<ReturnButton />
          </div>
        </div>
        <div className="about-logo">
          <img src="/assets/logo-120.png" alt="Logo" />
        </div>
      </div>
    </div>
  )
}
