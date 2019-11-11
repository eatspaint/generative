export default (p) => {
  p.angleMode(p.DEGREES);

  // HELPERS
  const UP = 210;
  const LEFT = 150;
  const DOWN = 30;
  const RIGHT = 330;

  // GENERATED CONFIG
  const SIZE = p.random(10, 300); // length of tower side
  const STROKE_WEIGHT = 6; // stroke weight
  const BG = p.map(p.random(), 0, 1, 0, 360) // background fill
  const PERIOD = p.random([1, 2, 3, 4]); // wave period

  // UTIL
  const TOWER_WIDTH = (p.cos(DOWN) * (2 * SIZE));
  const COUNT = p.windowWidth / (TOWER_WIDTH * 0.5);

  const drawShape = (vertices) => {
    p.beginShape();
    vertices.forEach(([x, y]) => {
      p.vertex(x, y);
    })
    p.endShape(p.CLOSE);
  };

  const calcTopFace = (origin) => {
    const vertices = [];

    const walk = (direction, distance = 1) => {
      let [pX, pY] = vertices[vertices.length - 1];
      vertices.push([
        pX + (SIZE * distance * p.cos(direction)),
        pY + (SIZE * distance * p.sin(direction)),
      ])
    };

    vertices.push(origin);
    walk(DOWN);
    walk(RIGHT);
    walk(UP);
    walk(LEFT);
   
    return vertices;
  };
        
  const calcSides = (topFace) => {
    // iterate through points in top face and calc vertices for all sides
    const sides = [];
    topFace.forEach(([x, y], i) => {
      let nextPoint = i + 1 >= topFace.length ? topFace[0] : topFace[i + 1];
            
      if (x <= nextPoint[0]) {
        sides.push([
          [x, y],
          nextPoint,
          [nextPoint[0], p.windowHeight + 10],
          [x, p.windowHeight + 10],
        ]);
      }
    });
    return sides;
  };

  const drawTower = (origin) => {
    const topFace = calcTopFace(origin);
    const sides = calcSides(topFace);

    const sortedSides = sides.sort((a, b) => {
      let hAy = p.min(a[0][1], a[1][1]);
      let lAy = p.max(a[0][1], a[1][1]);
      let hBy = p.min(b[0][1], b[1][1]);
      let lBy = p.max(b[0][1], b[1][1]);
      if (hAy > hBy && lAy < lBy) {
        // edge case
        return -1;
      }
      return hAy - hBy;
    })
    
    sortedSides.forEach((vertices) => {
      // if visible face, fill & draw, else skip
      if (vertices[0][1] < vertices[1][1]) {
        p.fill(30);
      } else {
        p.fill(60);
      }
      drawShape(vertices);
    });
    
    // fill in top face
    p.fill(255);
    drawShape(topFace);
  };
  
  p.setup = () => {
    p.colorMode(p.HSL);
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.strokeWeight(STROKE_WEIGHT);
    p.strokeJoin(p.ROUND);
  };
  
  p.draw = () => {
    p.background(BG, 50, 40);
    for (let i = 0; i < COUNT; i++) {
      drawTower([
        (i * TOWER_WIDTH * 0.5),
        (p.windowHeight / 2) + (p.sin(p.map((p.frameCount * 0.01 + i) % COUNT, 0, COUNT, 0, (360 * PERIOD))) * (p.windowHeight / 2)),
      ])
    }
  };
};
