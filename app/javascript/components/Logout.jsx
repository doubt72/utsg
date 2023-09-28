import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deleteAPI } from "../helper";

export default () => {
  const navigate = useNavigate()

  useEffect(() => {
    deleteAPI("/api/v1/session", {
      ok: _response => {
        localStorage.removeItem("username")
        localStorage.removeItem("email")
        navigate("/", { replace: true })
      }
    })
  }, [])

  return <>bye</>
}
