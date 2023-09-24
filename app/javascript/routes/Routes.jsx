import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import MainPage from "../components/MainPage";
import Login from '../components/Login'
import Logout from '../components/Logout'
import Signup from '../components/Signup'
import ValidateAccount from '../components/ValidateAccount'

const Routes = () => {
  const publicRoutes = [
    { path: "/about", element: <div>about</div> },
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
        { path: "/logout", element: <Logout /> },
        { path: "/profile", element: <div>profile</div> },
        { path: "/logout", element: <Logout /> },
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
