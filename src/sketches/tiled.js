// CONFIG
const TILE_WIDTH = 300;
const TILE_HEIGHT = 300;
const POINTS_COUNT_X = 80;
const POINTS_COUNT_Y = 80;

class Tile {
  constructor({ x, y, w, h }) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.maxMotion = w > h ? h / 2 : w / 2;
    this.borderPoints = this.initBorderPoints(POINTS_COUNT_X, POINTS_COUNT_Y);
  };

  initBorderPoints(cX, cY) {
    const { x, y, w, h } = this;
    const xStep = w / cX;
    const yStep = h / cY;
    let points = [];
    // ADD POINTS TO TOP & BOTTOM
    for (let ix = 0; ix <= cX; ix++) {
      let xVal = (ix * xStep) + x;
      points.push([xVal, y]);
      points.push([xVal, y + h]);
    }
    // ADD POINTS TO SIDES, starting at 1 bc no need to repeat corner
    for (let iy = 1; iy < cY; iy++) {
      let yVal = (iy * yStep) + y;
      points.push([x, yVal]);
      points.push([x + w, yVal]);
    }
    return points;
  }

  jitter(val, p) {
    return p.map(
      p.noise(val, p.frameCount * 0.005), 0, 1, -this.maxMotion, this.maxMotion
    );
  }

  draw(p) {
    const { x, y, w, h } = this;
    const center = [
      x + (w / 2) + this.jitter(x, p),
      y + (h / 2) + this.jitter(y, p),
    ];
    // DRAW LINES TO CENTER
    this.borderPoints.forEach(point => {
      p.line(...center, ...point);
    })
  };
};

export default (p) => {
  const MARGIN_VERT = (p.windowHeight % TILE_HEIGHT) / 2;
  const MARGIN_HORI = (p.windowWidth % TILE_WIDTH) / 2;
  const COLS = p.windowWidth / TILE_WIDTH;
  const ROWS = p.windowHeight / TILE_HEIGHT;
  const TILES = [];

  const initTiles = () => {
    for (let ix = 0; ix <= COLS - 1; ix++) {
      for (let iy = 0; iy <= ROWS - 1; iy++) {
        TILES.push(
          new Tile({
            x: ix * TILE_WIDTH,
            y: iy * TILE_HEIGHT,
            w: TILE_WIDTH,
            h: TILE_HEIGHT,
          })
        );
      };
    };
  };

  p.setup = () => {
    p.colorMode(p.HSL);
    p.angleMode(p.DEGREES);
    p.createCanvas(p.windowWidth, p.windowHeight);
    initTiles();
  };
  
  p.draw = () => {
    p.background(0);
    p.translate(MARGIN_HORI, MARGIN_VERT);
    p.stroke((p.frameCount * 0.5) % 360, 60, 40, 0.5);
    TILES.forEach(tile => {
      p.push();
      tile.draw(p);
      p.pop();
    });
  };
};
