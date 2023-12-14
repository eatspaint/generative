export default (p) => {
  const TILE_SIZE = p.random([
    [100, 100],
    [70, 70],
    [200, 200],
    [300, 300],
  ]);
  const N = [0.5 * TILE_SIZE[0], 0];
  const E = [1 * TILE_SIZE[0], 0.5 * TILE_SIZE[1]];
  const S = [0.5 * TILE_SIZE[0], 1 * TILE_SIZE[1]];
  const W = [0, 0.5 * TILE_SIZE[1]];
  const TENSION = [TILE_SIZE[0] / 4, TILE_SIZE[1] / 4];
  const RENDER_DOTS = true;
  const MUILTIPLE_CONNECTIONS = true;

  class Tile {
    constructor({ x, y, p }) {
      this.x = x;
      this.y = y;
      this.p = p;
      this.lines = [];
      this.nodes = [N, E, S, W];

      this.seedLines();
    };

    seedLines() {
      const { p, lines, nodes } = this;
      const stack = p.shuffle(nodes);
      for (let i = 0; i < stack.length; i++) {
        // if the node is already connected, skip it
        if (!MUILTIPLE_CONNECTIONS && lines.flat().includes(stack[i])) {
          return;
        }
        // flip a coin to determine if line or point
        if (p.random([true, false])) {
          // if there is a "next" node, use it, if not get first node
          if (stack[i + 1]) {
            lines.push([stack[i], stack[i + 1]]);
          } else {
            lines.push([stack[i], stack[0]]);
          }
        } else if (RENDER_DOTS) {
          lines.push([stack[i]]);
        }
      }
    }

    controlPoint(node) {
      const [x, y] = node;
      switch (node) {
        case N:
          return [x, y + TENSION[1]];
        case E:
          return [x - TENSION[0], y];
        case S:
          return [x, y - TENSION[1]];
        case W:
          return [x + TENSION[0], y];
        default:
          return [0, 0];
      }
    }

    drawLine(line) {
      const { p } = this;
      if (line.length === 2) {
        p.bezier(
          ...line[0],
          ...this.controlPoint(line[0]),
          ...this.controlPoint(line[1]),
          ...line[1],
        );
      } else if (line.length === 1) {
        p.point(...line[0]);
      }
    }

    draw() {
      const { x, y, lines, p } = this;
      p.push();
      p.translate(x, y);
      lines.forEach(line => {
        this.drawLine(line);
      })
      p.pop();
    };
  }

  let tiles = [];
  let hue = p.random(0, 360);
  const BG = [hue, 50, 50];
  const STROKE1 = [hue, 75, 25];
  const STROKE2 = [hue, 25, 75];

  const seedTiles = () => {
    tiles = []
    for (let x = 0; x < (p.windowWidth - TILE_SIZE[0]); x += TILE_SIZE[0]) {
      for (let y = 0; y < (p.windowHeight - TILE_SIZE[1]); y += TILE_SIZE[1]) {
        tiles.push(new Tile({ x, y, p }));
      }
    }
  };

  p.setup = () => {
    p.colorMode(p.HSL);
    p.angleMode(p.DEGREES);
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(10);
    p.noFill();
  };
  
  p.draw = () => {
    seedTiles();
    p.background(...BG);
    p.translate(
      (p.windowWidth % TILE_SIZE[0]) / 2,
      (p.windowHeight % TILE_SIZE[1]) / 2,
    );
    p.stroke(...STROKE1);
    p.strokeWeight(25);
    tiles.forEach(tile => tile.draw());
    p.stroke(...STROKE2);
    p.strokeWeight(15);
    tiles.forEach(tile => tile.draw());
    p.stroke(...STROKE1);
    p.strokeWeight(5);
    tiles.forEach(tile => tile.draw());
    // p.noLoop();
  };

  let looping = true;
  p.mouseClicked = () => {
    if (looping) {
      p.noLoop();
      looping = !looping;
    } else {
      p.loop();
      looping = !looping;
    }
  }
};
