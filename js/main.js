import p5 from 'p5';

import { useSand } from './sketches';

const sketch = (p) => {
  const [setup, draw] = useSand(p);

  p.setup = setup;
  p.draw = draw;
};

const P5 = new p5(sketch);