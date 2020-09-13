import React, { useState, useEffect } from "react";
import ImageForm from "./ImageForm";
import Results from "./Results";
import HomepageLayout from "./HomePage";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomepageLayout} />
        <Route exact path="/quiz" component={ImageForm} />
        <Route exact path="/results" component={Results} />
      </Switch>
    </Router>
  );
}

export default App;
