import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { About } from "./gjx/About";
import GJXApp from "./gjx/GJXApp";
import { Home } from "./gjx/Home";

export const RoutedApp: React.FC<{}> = () => {
  return (
    <Router>
      <Switch>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/sessions/:projectId/:apiKey">
          <GJXApp />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
};
