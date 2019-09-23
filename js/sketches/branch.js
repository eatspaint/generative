const SMALLEST = 1;
const START_SIZE = 5;
const SWAY = 90;

export default (p) => {
  const branch = ({ origin, size, currentAngle, length }) => {
    // exit if we've reached the minimum size
    if (size < SMALLEST) {
      return null;
    }
  
    let destination = [
      origin[0] + (length * p.sin(currentAngle)),
      origin[1] + (length * p.cos(currentAngle)),
    ]
    p.strokeWeight(size);
    p.line(...origin, ...destination);
  
    // start the next branch at the halfway point of the current branch
    let nextOrigin = [
      origin[0] + ((destination[0] - origin[0]) / 2),
      origin[1] + ((destination[1] - origin[1]) / 2),
    ];
    //  give some variance in angle, but avoid branching too close to parent
    let nextAngle = p.random([
      p.random(currentAngle - SWAY, currentAngle - (SWAY / 2)),
      p.random(currentAngle + (SWAY / 2), currentAngle + SWAY)
    ]) % 360;
    // make the next branch be somewhere between 0.25 & 0.75 of current branch length
    let nextLength = p.random(length * 0.45, length * 0.75);
    // recurse
    branch({
      origin: nextOrigin,
      size: size - 1,
      currentAngle: nextAngle,
      length: nextLength,
    });
  };

  p.setup = () => {
    // config modes
    p.colorMode(p.HSL);
    p.imageMode(p.CENTER);
    p.angleMode(p.DEGREES);
    // init canvas
    p.createCanvas(p.windowWidth, p.windowHeight);
    // move start point to center
    p.translate(p.windowWidth / 2, p.windowHeight / 2);
    branch({ 
      origin: [0, 0],
      size: START_SIZE,
      currentAngle: p.random(0, 360),
      length: 300,
    });
  };

  // p.draw = () => {

  // };
};