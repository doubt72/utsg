import React from "react";
import { ExclamationCircleFill } from "react-bootstrap-icons";
import { Tooltip } from "react-tooltip";

interface CustomTooltipProps {
  html: string,
}

// pass html to the props (so can include line breaks and such)
function CustomTooltip({ html }: CustomTooltipProps) {
  return (
    <span>
      <span className="standard-tooltip" data-tooltip-id="password-tt" data-tooltip-html={html}>
        <ExclamationCircleFill />
      </span>
      <Tooltip className="standard-tooltip-popout" id="password-tt" />
    </span>
  )
}

export function PasswordTooltip() {
  const html = "we don't enforce any password quality at all but<br />" +
               "you should still choose a unique, secure password<br />" +
               "and if you don't, that's on you"

  return <CustomTooltip html={html} />
}

export function SignupEmailTooltip () {
  const html = "email will be used to send a verification code<br />to complete signup"

  return <CustomTooltip html={html} />
}
