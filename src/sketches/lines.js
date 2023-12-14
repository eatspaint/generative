export default (p) => {
  // CONFIG VARS
  const DETAIL = 0.005; // how frequently points occur on line
  const MARGIN = 20; // margin between page bounds and drawing
  const SPACING = 15; // vertical space between each line
  const VARIANCE = [-1, 1]; // min & max margin for error on each new point
  const WEIGHT = 1; // stroke weight

  // UTILITY VARS
  const PADDING = (p.windowWidth % (2 * MARGIN)) / 2; // extra space for centering
  const LEFT = MARGIN + PADDING; // left bound for points
  const RIGHT = p.windowWidth - (MARGIN - PADDING); // right bound for points
  const ROUGH_LINE_COUNT = (p.windowHeight - (2 * MARGIN)) / SPACING; // used to roughly comp number of iterations
  
  const xVals = [];
  for (let i = 0; i <= 100; i += (DETAIL * 100)) {
    xVals.push(p.lerp(LEFT, RIGHT, (i / 100)));
  };

  const initialLine = xVals.map((x) => {
    return [x, MARGIN];
  });
  
  const drawLine = (points) => {
    // draw C
    p.stroke(180, 100, 50);
    p.beginShape();
    points.forEach(([x, y]) => {
      p.vertex(x, y);
    });
    p.endShape();
    // draw M
    p.stroke(300, 100, 50);
    p.beginShape();
    points.forEach(([x, y]) => {
      p.vertex(x, y + 5);
    });
    p.endShape();
    // draw Y
    p.stroke(60, 100, 50);
    p.beginShape();
    points.forEach(([x, y]) => {
      p.vertex(x, y + 10);
    });
    p.endShape();
  };

  const offset = (val) => {
    return p.map(p.noise(val * 0.03, p.frameCount * 0.05), 0, 1, ...VARIANCE);
  };
  
  const nextLine = (prevPoints) => {
    return prevPoints.map(([x, y]) => {
      return [x, (y + SPACING + offset(x))];
    });
  };
  
  p.setup = () => {
    p.colorMode(p.HSL);
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.noFill();
    p.frameRate(10);
    p.strokeWeight(WEIGHT);  
  };

  let lineCount;
  p.draw = () => {
    p.background(0);

    let currentLine = initialLine;
    let maxLines = lineCount || ROUGH_LINE_COUNT;

    for (let i = 0; i < maxLines; i++) {
      drawLine(currentLine);
      currentLine = nextLine(currentLine);
      // if lineCount has not yet been determined & the currentLine hits the bottom, set it and break
      if (!lineCount && currentLine.find((point) => point[1] > p.windowHeight - MARGIN)) {
        lineCount = i + 1;
        break;
      }
    }
  };
};
