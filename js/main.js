import p5 from 'p5';
import { useColorFire } from './sketches/useColorFire';
import { useLines } from './sketches/useLines';
import { useMoire } from './sketches/useMoire';

const sketch = (p) => {
  const [setup, draw] = useMoire(p);

  p.setup = setup;
  p.draw = draw;
};

const P5 = new p5(sketch);