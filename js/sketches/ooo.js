export default (p) => {
  // Cool chrome looking glitch fill
  // const fill = () => {
  //   p.background(0);
  //   let time = p.frameCount * 0.005;
  //   for (let x = 0; x <= p.windowWidth; x++) {
  //     for (let y = 0; y <= p.windowHeight; y++) {
  //       let val = p.noise(x * 0.005, y * 0.005, time);
  //       let grey = p.map(val, 0, 1, 0, 360 * 45) % 255;
  //       if ((val > 0.4 && val < 0.6) || val < 0.3 || val > 0.7) {
  //         p.stroke(grey);
  //       }
  //       p.point(x, y);
  //     }
  //   }
  // };

  const fill = () => {
    p.background(0);
    let time = p.frameCount * 0.005;
    for (let x = 0; x <= p.windowWidth; x++) {
      for (let y = 0; y <= p.windowHeight; y++) {
        let val = p.noise(x * 0.005, y * 0.005, time);
        let step = (val * 10);
        // let grey = p.map(val, 0, 1, 0, 360 * 45) % 255;
        // let step = p.floor(val * 10) * 10;
        // console.log(step);
        if (step <= 3 || step > 7) { // 0 - 3.0 || 6.1 - 10
          let grey = (step | 0) * 10;
          p.stroke(grey);
        } else if (step <= 3 && step > 2) { // 2.1 - 3.0
          p.stroke((p.noise((x) * 0.05, step | 0) + 0.25) * 100);
        } else if (step <= 4 && step > 3.75) { // 3.75 - 4.0
          p.stroke(100);
        } else if (step <= 3.75 && step > 3) { // 3.1 - 3.75
          p.stroke(p.random([0, 100]));
        } else if (step <= 5 && step > 4) { // 4.1 - 5.0
          p.stroke(180, 100, 70);
        } else if (step <= 6 && step > 5) { // 5.1 - 6.0
          if ((x + y) % 20 <= 10) {
            p.stroke(180, 100, 70);
          } else {
            p.stroke(0);
          }
        } else if (step <= 7 && step > 6) { // 6.1 - 7.0
          if (x % 10 < 2 && y % 10 < 2) {
            p.stroke(180, 100, 70);
          } else {
            p.stroke(0);
          }
        }
        p.point(x, y);
      }
    }
  };

  p.setup = () => {
    p.colorMode(p.HSL);
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(30);
    fill();
  };

  p.draw = () => {
    p.noLoop();
  };
};
