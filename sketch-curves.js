const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const catppuccinColors = require('./catppuccin-colors');
const Color = require('canvas-sketch-util/color');
const colormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

const sketch = ({width, height}) => {
const cols = 100;
const rows = 20;
const numCells = cols * rows

//grid
const gw = width * 0.8;
const gh = height * 0.8;
//cell
const cw = gw / cols;
const ch = gh / rows;
//margin
const mx = (width - gw) * 0.5;
const my = (height - gh) * 0.5;

const points = [];

let x, y, n, lineWidth, color;
let frequency = 0.0015;
let amplitude = 100;

const colors = colormap({

    colormap: 'phase',
  // colormap: 'spring',
    nshades: amplitude,
    format: 'rgbaString',
    alpha: random.range(0.8, 1),

})

for(let i = 0; i < numCells; i++){
  x = (i % cols) * cw;
  y = Math.floor(i/cols) * ch;

  n = random.noise2D(x + 200, y -10, frequency, amplitude);
  // x += n;
  // y += n;

  lineWidth = math.mapRange(n, -amplitude, amplitude, 0, 5);

  color = colors[Math.floor(math.mapRange(n, -amplitude, amplitude, 0, amplitude))];

  points.push(new Point({x, y, lineWidth, color}))
}

  return ({ context, width, height, frame }) => {
    context.fillStyle = '#292c3c';
    context.fillRect(0, 0, width, height);

    context.save();
    context.translate(mx, my);
    context.translate(cw * 0.5, ch * 0.5);
    context.strokeStyle = '#f4b8e4';
    context.lineWidth = 5;

    //update pos
    points.forEach(point =>{
      n = random.noise2D(point.ix + frame * 4, point.iy, frequency, amplitude);
      point.x = point.ix + n;
      point.y = point.iy + n;
    })

    let lastx, lasty;

     //draw lines
     for(let r = 0; r < rows; r++){

    for(let c = 0; c < cols - 1; c++){
      const curr = points[r * cols + c + 0]
      const next = points[r * cols + c + 1]

      const mx = curr.x + (next.x - curr.x) * 0.8;
      const my = curr.y + (next.y - curr.y) * 4.5;

      if (!c){
        lastx = curr.x;
        lasty = curr.y;
      }

      context.beginPath();
      context.lineWidth = curr.lineWidth;
      context.strokeStyle = curr.color;

      context.moveTo(lastx, lasty)
      context.quadraticCurveTo(curr.x, curr.y, mx, my);

      context.stroke();

      lastx = mx - c / cols * 210;
      lasty = my - r / rows * 5;

    };

  };

    //draw points
    points.forEach(point =>{
      // point.draw(context);
    })

    context.restore();
  };
};

canvasSketch(sketch, settings);

class Point {
  constructor({x, y, lineWidth, color}){
    this.x = x;
    this.y = y;
    this.lineWidth = lineWidth;
    this.color = color;

    this.ix = x;
    this.iy = y;
  }

  draw(context){
    context.save();
    context.translate(this.x, this.y);

    context.fillStyle = '#f4b8e4'

    context.beginPath();
    context.arc(0, 0, 10, 0, Math.PI * 2)
    context.fill();


    context.restore();
  }
}