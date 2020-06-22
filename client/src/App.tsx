import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Login from "pages/Login/Login";
import Invitation from "pages/Invitation/Invitation";
import Dashboard from "pages/Dashboard/Dashboard";
import GlobalStyles from "styles/GlobalStyles";

import { AuthProvider } from "contexts/AuthContext";
import { ModalProvider } from "contexts/ModalContext";
import AuthRoute from "components/AuthRoute";
import HorizontalShade from "components/HorizontalShade";
import CreateRoom from "pages/Modals/CreateRoom";
import UserSettings from "pages/Modals/UserSettings/UserSettings";

function App() {
  // chrome address bar css height fix!
  // https://stackoverflow.com/a/50683190/10629172
  const calculateHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty("--app-height", `${window.innerHeight}px`);
  };

  useEffect(() => {
    window.addEventListener("resize", calculateHeight);
    calculateHeight();

    return () => window.removeEventListener("resize", calculateHeight);
  }, []);

  return (
    <BrowserRouter>
      <div>
        <AuthProvider>
          <GlobalStyles />
          <HorizontalShade />
          <ModalProvider>
            <CreateRoom />
            <UserSettings />

            <Switch>
              <Route path="/login" exact component={Login} />
              <AuthRoute
                path="/invitation/:token"
                exact
                component={Invitation}
              />

              <AuthRoute path="/" component={Dashboard} />
            </Switch>
          </ModalProvider>
        </AuthProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
