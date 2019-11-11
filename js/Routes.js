import React from 'react';
import { Route } from 'react-router-dom';
import P5Wrapper from 'react-p5-wrapper';

import {
  branch,
  bubblegum,
  colorFire,
  curve,
  // cutout,
  lines,
  moire,
  movement,
  oil,
  sand,
  towers,
  waves,
  wavesMoving,
} from './sketches';

export const ROUTE_MAP = [
  { name: 'branch', sketch: branch },
  { name: 'bubblegum', sketch: bubblegum },
  { name: 'colorFire', sketch: colorFire },
  { name: 'curve', sketch: curve },
  // { name: 'cutout', sketch: cutout },
  { name: 'lines', sketch: lines },
  { name: 'moire', sketch: moire },
  { name: 'movement', sketch: movement },
  { name: 'oil', sketch: oil },
  { name: 'sand', sketch: sand },
  { name: 'towers', sketch: towers },
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