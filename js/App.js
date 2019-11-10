import React from 'react';
import { HashRouter as Router, Route } from "react-router-dom";
import Routes from './Routes';
import Home from './Home';

const App = () => (
  <Router baseName='/'>
    <Route path='/' exact component={Home} />
    <Routes />
  </Router>
);

export default App;