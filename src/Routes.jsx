import React from 'react';
import { Route } from 'react-router-dom';
import { ReactP5Wrapper } from '@p5-wrapper/react';

import {
  atmos,
  branch,
  bubblegum,
  cells,
  colorFire,
  curve,
  // cutout,
  drops,
  every,
  lines,
  moire,
  movement,
  oil,
  ooo,
  pix,
  sand,
  shift,
  sins,
  tiled,
  towers,
  warp,
  waves,
  wavesMoving,
} from './sketches';

export const ROUTE_MAP = [
  { name: 'atmos', sketch: atmos },
  { name: 'branch', sketch: branch },
  { name: 'bubblegum', sketch: bubblegum },
  { name: 'cells', sketch: cells },
  { name: 'colorFire', sketch: colorFire },
  { name: 'curve', sketch: curve },
  // { name: 'cutout', sketch: cutout },
  { name: 'drops', sketch: drops },
  { name: 'every', sketch: every },
  { name: 'lines', sketch: lines },
  { name: 'moire', sketch: moire },
  { name: 'movement', sketch: movement },
  { name: 'oil', sketch: oil },
  { name: 'ooo', sketch: ooo },
  { name: 'pix', sketch: pix },
  { name: 'sand', sketch: sand },
  { name: 'shift', sketch: shift },
  { name: 'sins', sketch: sins },
  { name: 'tiled', sketch: tiled },
  { name: 'towers', sketch: towers },
  { name: 'warp', sketch: warp },
  { name: 'waves', sketch: waves },
  { name: 'wavesMoving', sketch: wavesMoving },
];

const renderRoute = ({ name, sketch }) => (
  <Route
    key={name}
    path={`/${name}`}
    render={
      () => <ReactP5Wrapper sketch={sketch}/>
    }
  />
);

const Routes = () => (
  <>
    {ROUTE_MAP.map(route => renderRoute(route))}
  </>
);

export const routes = ROUTE_MAP.map(({ name, sketch }) => ({
  element: <ReactP5Wrapper sketch={sketch}/>,
  path: `/${name}`,
}))

export default Routes;
