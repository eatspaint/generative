export default (p) => {
  p.setup = () => {
    p.colorMode(p.HSL);
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(10);
  };
  
  p.draw = () => {
    let cyan = [180, 50, 50];
    p.background(...cyan);
  };
};
