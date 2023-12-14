import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTE_MAP } from './Routes';

const renderLink = ({ name }) => (
  <Link key={`link-to-${name}`} to={`/${name}`}>{name}</Link>
);

const Home = () => (
  <div className="nav">
    {ROUTE_MAP.map(renderLink)}
  </div>
);

export default Home;
