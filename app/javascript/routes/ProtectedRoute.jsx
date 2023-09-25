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
    }).then(response => {
        if (response.ok) {
          return
        } else if (response.status === 403) {
          if (path !== "/validate_account" && path !== '/logout') {
            navigate("/validate_account", { replace: true });
          }
          return
        }
        localStorage.removeItem("username")
        localStorage.removeItem("email")
        if (path !== '/') {
          navigate("/", { replace: true });
        }
    }).catch(error => console.log(error.message));
  }, []);

  return <Outlet />;
};
