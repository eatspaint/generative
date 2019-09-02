import p5 from 'p5';
import { useColorFire } from './sketches/useColorFire';
import { useLines } from './sketches/useLines';
import { useMoire } from './sketches/useMoire';
import { useWaves } from './sketches/useWaves';

const sketch = (p) => {
  const [setup, draw] = useWaves(p);

  p.setup = setup;
  p.draw = draw;
};

const P5 = new p5(sketch);