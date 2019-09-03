import p5 from 'p5';

import { useMovement } from './sketches';

const sketch = (p) => {
  const [setup, draw] = useMovement(p);

  p.setup = setup;
  p.draw = draw;
};

const P5 = new p5(sketch);