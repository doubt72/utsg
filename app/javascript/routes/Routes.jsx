import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import MainPage from "../components/MainPage";

import Login from '../components/Login'
import Logout from '../components/Logout'
import Signup from '../components/Signup'

import ValidateAccount from '../components/ValidateAccount'
import NewValidationCode from '../components/NewValidationCode'
import DeleteAccount from '../components/DeleteAccount'

import About from "../components/About";
import Profile from "../components/Profile";

const Routes = () => {
  const publicRoutes = [
    { path: "/about", element: <About /> },
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },
  ];

  const protectedRoutes = [
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        { path: "/", element: <MainPage />},
        { path: "/validate_account", element: <ValidateAccount /> },
        { path: "/new_validation_code", element: <NewValidationCode /> },
        { path: "/delete_account", element: <DeleteAccount /> },
        { path: "/logout", element: <Logout /> },
        { path: "/profile", element: <Profile /> },
      ],
    },
  ];

  const router = createBrowserRouter([
    ...publicRoutes,
    ...protectedRoutes,
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
