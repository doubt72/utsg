import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deleteAPI } from "../../utilities/network";

export default () => {
  const navigate = useNavigate()

  useEffect(() => {
    deleteAPI("/api/v1/session", {
      ok: _response => {
        localStorage.removeItem("username")
        localStorage.removeItem("email")
        localStorage.removeItem("validationNeeded")
        navigate("/", { replace: true })
      }
    })
  }, [])

  return <>bye</>
}
