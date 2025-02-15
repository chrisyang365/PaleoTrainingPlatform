import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Axios from "axios";
import ImageForm from "./ImageForm";
import Results from "./Results";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
        <Router>
          <Switch>
            <Route exact path="/" component={ImageForm} />
            <Route exact path="/results" component={Results} />
          </Switch>
        </Router>
  );
}

export default App;
