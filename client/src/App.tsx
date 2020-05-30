import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Login from "pages/Login/Login";
import Dashboard from "pages/Dashboard/Dashboard";
import GlobalStyles from "styles/GlobalStyles";

import AuthRoute from "components/AuthRoute";
import { AuthProvider } from "contexts/AuthContext";
import HorizontalShade from "components/HorizontalShade";

function App() {
  return (
    <BrowserRouter>
      <div>
        <AuthProvider>
          <GlobalStyles />
          <HorizontalShade />
          <Switch>
            <Route path="/login" exact component={Login} />
            <AuthRoute path="/" component={Dashboard} />
          </Switch>
        </AuthProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
