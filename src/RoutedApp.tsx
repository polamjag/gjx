import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { About } from "./gjx/About";
import GJXApp from "./gjx/GJXApp";
import { Home } from "./gjx/Home";

export const RoutedApp: React.FC<{}> = () => {
  return (
    <Router>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/sessions/:projectId/:apiKey" element={<GJXApp />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};
