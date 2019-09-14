import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Routes from './Routes';
import Home from './Home';

const App = () => (
  <Router>
    <Route path="/" exact component={Home} />
    <Routes />
  </Router>
);

export default App;