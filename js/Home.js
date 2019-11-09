import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ROUTE_MAP } from './Routes';

const Nav = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  a {
    padding: 6px;
  }
`;

const renderLink = ({ name }) => (
  <Link key={`link-to-${name}`} to={`/${name}`}>{name}</Link>
);

const Home = () => (
  <Nav>
    {ROUTE_MAP.map(route => renderLink(route))}
  </Nav>
);

export default Home;