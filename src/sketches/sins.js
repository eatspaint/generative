export default (p) => {
  const sins = [];

  const dx = 10; // x distance between points
  const cy = p.windowHeight / 2; // vertical center
  const newSin = ({ amp, freq, pha }) => {
    let sin = [];

    for (let x = 0; x <= p.windowWidth + dx; x += dx) {
      sin.push([
        x,
        (amp * p.sin(freq * (x + pha))) + cy,
      ]);
    }

    return sin;
  };

  const drawSin = (points) => {
    p.stroke(0, 0, 0, 0.05)
    points.forEach((point, i) => {
      if (i >= points.length - 1) {
        return;
      }
      p.line(...point, ...points[i + 1]);
    });
  };

  const gradientVal = (colorIndex, gradientPosition) => {
    let colorOne = p.color(...COLORS[colorIndex % 3]);
    let colorTwo = p.color(...COLORS[(colorIndex + 1) % 3]);
    let position = (gradientPosition * dx) / p.windowWidth;
    let color = p.lerpColor(colorOne, colorTwo, position);
    color.setAlpha(0.01);
    return color;
  };

  const drawSins = () => {
    // connect each point to every other point
    sins.forEach((sin, i) => {
      drawSin(sin);
      sin.forEach((point, j) => {
        p.stroke(gradientVal(i, j));
        sins.forEach(otherSin => {
          otherSin.forEach(otherPoint => {
            p.line(...point, ...otherPoint);
          });
        });
      });
    });
  };

  const AMP_MOD = [1, 10];
  const FREQ_MOD = [0, 20];
  const PHA_MOD = [-20, 20];
  const COLORS = [
    [293, 100, 52],
    [204, 100, 65],
    [24, 100, 60],
  ];
  p.setup = () => {
    p.colorMode(p.HSL);
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(10);
    p.background(100);

    p.stroke(0, 0, 0, 0.005);

    sins.push(newSin({ amp: p.windowHeight / p.random(...AMP_MOD), freq: p.random(...FREQ_MOD) * 0.001, pha: p.windowWidth / p.random(...PHA_MOD) }));
    sins.push(newSin({ amp: p.windowHeight / p.random(...AMP_MOD), freq: p.random(...FREQ_MOD) * 0.001, pha: p.windowWidth / p.random(...PHA_MOD) }));
    sins.push(newSin({ amp: p.windowHeight / p.random(...AMP_MOD), freq: p.random(...FREQ_MOD) * 0.001, pha: p.windowWidth / p.random(...PHA_MOD) }));
  };
  
  p.draw = () => {
    drawSins();
    p.noLoop();
  };
};
