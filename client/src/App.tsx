import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Login from "src/pages/Login/Login";
import Dashboard from "src/pages/Dashboard/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route path="/" exact component={Dashboard} />
          <Route path="/login" exact component={Login} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
