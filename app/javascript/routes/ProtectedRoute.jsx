import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

export const ProtectedRoute = (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    const path = window.location.pathname
    const token = document.querySelector('meta[name="csrf-token"]').content;
    fetch("/api/v1/users/auth", {
      method: "GET",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json",
      },
    }).then((response) => {
        console.log('path: ' + path)
        if (response.ok) {
          console.log("got ok")
          return
        } else if (response.status === 403) {
          console.log("got forbidden")
          if (path !== "/validate_account" && path !== '/logout') {
            navigate("/validate_account", { replace: true });
          }
          return
        }
        console.log("not authorized")
        localStorage.removeItem("username")
        localStorage.removeItem("email")
        if (path !== '/') {
          navigate("/", { replace: true });
        }
    }).catch((error) => {
      console.log('something went wrong')
      console.log(error.message)
    });
  }, []);

  return <Outlet />;
};
