import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { useSelector } from "react-redux";
import Register from "./pages/Register";

const App = () => {
  ///
  /////////////////////////////////////////////////////////////////////////////////////////////////////

  const { user } = useSelector((state) => state.AuthReducer);

  useEffect(() => {
    if (user === undefined) {
      localStorage.setItem("user", JSON.stringify(null));
    } else {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  const RequireAuth = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <>
      <Routes>
        <Route exact path="/login" element={<LoginPage />} />
        <Route exact path="/register" element={<Register />} />
        <Route
          exact
          path="/"
          element={
            <RequireAuth>
              <HomePage />
            </RequireAuth>
          }
        />
      </Routes>
    </>
  );
};

export default App;
