import React from 'react';
import { Route, Link } from 'react-router-dom';
import P5Wrapper from 'react-p5-wrapper';

import {
  colorFire,
  lines,
  moire,
  movement,
  sand,
  waves,
  wavesMoving,
} from './sketches';

export const ROUTE_MAP = [
  { name: 'colorFire', sketch: colorFire },
  // { name: 'lines', sketch: lines },
  { name: 'moire', sketch: moire },
  { name: 'movement', sketch: movement },
  { name: 'sand', sketch: sand },
  { name: 'waves', sketch: waves },
  { name: 'wavesMoving', sketch: wavesMoving },
];

const renderRoute = ({ name, sketch }) => (
  <Route
    key={name}
    path={`/${name}`}
    render={
      () => <P5Wrapper sketch={sketch}/>
    }
  />
);

const Routes = () => (
  <>
    {ROUTE_MAP.map(route => renderRoute(route))}
  </>
);

export default Routes;