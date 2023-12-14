export default (p) => {
  p.colorMode(p.HSL);
  const {
    windowWidth,
    windowHeight,
  } = p;

  const PADDING = 100;
  const SIDES = {
    top: 0 + PADDING,
    bottom: windowHeight - PADDING,
    left: 0 + PADDING,
    right: windowWidth - PADDING,
  };

  const drawBackground = () => {
    const { top, bottom, left, right } = SIDES;
    p.noStroke();
    p.vertex(left, top);
    p.vertex(right, top);
    p.vertex(right, bottom);
    p.vertex(left, bottom);
  };

  const drawContour = () => {
    const { top, bottom, left, right } = SIDES;
    p.beginContour();
    p.vertex(left + PADDING, top + PADDING);
    p.bezierVertex(
      ...[left + (2 * PADDING), top + PADDING],
      ...[left + PADDING, top + (2 * PADDING)],
      ...[left + (2 * PADDING), top + (2 * PADDING)],
    );
    p.bezierVertex(
      ...[left + (2 * PADDING), top],
      ...[left, top + (2 * PADDING)],
      ...[left + PADDING, top + PADDING],
    );
    p.endContour();
  };

  const drawCutout = () => {
    p.fill(30, 50, 50);
    p.beginShape();
    drawBackground();
    drawContour();
    p.endShape();
  };

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    drawCutout();
  };
};
