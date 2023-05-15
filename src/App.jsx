// eslint-disable-next-line no-unused-vars
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import RequireAuth from "./Firebase/RequireAuth";
import Sms_Navigation from "./Component/Navigation/Sms_Navigation";
import Login from "./Component/Account/Login";
import { Toaster } from "react-hot-toast";
import FirebaseContextProvider from "./Context Api/AuthContext";
import ContextProvider from "./Context Api/useHooks";

const App = () => {
  return (
    <Router>
      <FirebaseContextProvider>
        <ContextProvider>
          <Routes>
            <Route
              path="/"
              element={
                <RequireAuth>
                  <Sms_Navigation />
                </RequireAuth>
              }
            />
            <Route path="/login" element={<Login />} />
          </Routes>
        </ContextProvider>
      </FirebaseContextProvider>

      <Toaster />
    </Router>
  );
};

export default App;
