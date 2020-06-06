import React from "react";
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

function App() {
  return (
    <BrowserRouter>
      <div>
        <AuthProvider>
          <GlobalStyles />
          <HorizontalShade />
          <ModalProvider>
            <CreateRoom />

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
