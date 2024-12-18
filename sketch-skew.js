const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const catppuccinColors = require('./catppuccin-colors');
const Color = require('canvas-sketch-util/color');
const risoColors = require('riso-colors');

//const seed = Date.now();
const seed = random.getRandomSeed();


const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: seed
};

const sketch = ({context, width, height}) => {
  random.setSeed(seed);
  console.log(random.value())
  console.log(random.value())
  console.log(random.value())

  let x, y, w, h, fill, stroke, blend;

  const num = 40;
  const degrees = -30;
  const numStars = 50;
  const rects = []
  const stars = []

  const rectColors = [
    random.pick(catppuccinColors),
    random.pick(catppuccinColors),
  ]

  const starColors = [
    random.pick(catppuccinColors),
    random.pick(catppuccinColors),
  ]

  const bgColor = random.pick(catppuccinColors).hex
  const starSize = random.range(70, 150)

  const mask = {
    radius: width * 0.4,
    sides: 3,
    x: width * 0.5,
    y: height * 0.58
  }

  for (let i = 0; i < num; i++){
    x = random.range( 0, width);
    y = random.range( 0, height);
    w = random.range( 600, width);
    h = random.range( 40, 200);

   fill = random.pick(rectColors).hex;
  //fill =  `rgba(${random.range(133, 242)} , ${random.range(158, 213)}, ${random.range(207, 230)}, 1)`;
   stroke = random.pick(rectColors).hex;
  // stroke = "#292c3c";
    blend = (random.value() > 0.5) ? 'overlay' : 'source-over';

    rects.push({x, y, w, h, fill, stroke, blend});
  }

  for (let i = 0; i < num; i++){
    x = random.range( 0, width);
    y = random.range( 0, height);
    w = random.range( 600, width);
    h = random.range( 40, 200);

   fill = random.pick(starColors).hex;
  //fill =  `rgba(${random.range(133, 242)} , ${random.range(158, 213)}, ${random.range(207, 230)}, 1)`;
   stroke = random.pick(starColors).hex;
  // stroke = "#292c3c";
  const blend = random.pick(['overlay', 'source-over', 'soft-light']);

    stars.push({x, y, w, h, fill, stroke, blend});
  }

  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    context.save();

    context.translate(mask.x , mask.y)
  
    drawPolygon({context, radius:mask.radius, sides:mask.sides});
  
    context.clip();

    rects.forEach(rect => { 
    const {x, y, w , h, fill, stroke, blend} = rect;
    let shadowColor;

    context.save();

    context.translate(-mask.x , -mask.y);
    context.translate(x , y);

    context.strokeStyle = stroke;
    context.fillStyle = fill;
    context.lineWidth = 15;
    //drawOffsetCircles({ context, x: 400, y: 400, maxRadius: 150, rings: 5 });

    context.globalCompositeOperation = blend

    drawSkewedRect({context, w, h, degrees})

    shadowColor = Color.offsetHSL(fill, 0, 0, -20)
    shadowColor.rgba[3] = 0.5;

    context.shadowColor = Color.style(shadowColor.rgba);
    context.shadowOffsetX = -10;
    context.shadowOffsetY = 20;


    context.fill();

    context.shadowColor = null

    context.stroke();
    context.globalCompositeOperation = 'source-over'

    context.lineWidth = 2;
    context.strokeStyle = '#292c3c'
    context.stroke();

   context.restore();
  });

  stars.forEach(rect => { 
    const {x, y, w , h, fill, stroke, blend} = rect;
    let shadowColor;

    context.save();
    context.translate(-mask.x , -mask.y);
    context.translate(x , y);

    context.strokeStyle = stroke;
    context.fillStyle = fill;
    context.lineWidth = 15;
    //drawOffsetCircles({ context, x: 400, y: 400, maxRadius: 150, rings: 5 });

    context.globalCompositeOperation = blend

    drawStar({ context, x: x * 0.75, y: y * 0.5, radius: starSize, points: 5 });

    shadowColor = Color.offsetHSL(fill, 0, 0, -20)
    shadowColor.rgba[3] = 0.5;

    context.shadowColor = Color.style(shadowColor.rgba);
    context.shadowOffsetX = -10;
    context.shadowOffsetY = 20;


    context.fill();

    context.shadowColor = null

    context.stroke();
    context.globalCompositeOperation = 'source-over'

    context.lineWidth = 2;
    context.strokeStyle = '#292c3c'
    context.stroke();

   context.restore();
  });
  context.restore();

  //Polygon Outline
  context.save();
  context.translate(mask.x, mask.y);
  context.lineWidth = 20;

  drawPolygon({context, radius:mask.radius - context.lineWidth, sides:mask.sides});

  context.globalCompositeOperation = 'color-burn'
  context.strokeStyle = rectColors[0].hex
  //context.strokeStyle = '#292c3c'
  context.stroke();

  context.restore();
  };
};

const drawSkewedRect = ({context, w = 600, h = 200, degrees = -45}) => {
 const angle = math.degToRad(degrees);
 const rx = Math.cos(angle) * w;
 const ry = Math.sin(angle) * w;

 context.save();
 context.translate(rx * -0.5, (ry + h) * -0.5);

 context.beginPath();
 context.moveTo(0 , 0);

 context.lineTo(rx , ry);
 context.lineTo(rx , ry + h );
 context.lineTo(0 , h);
 context.closePath();

 context.stroke();

 context.restore();
}

const drawPolygon = ({context, radius = 100, sides = 3}) => {
  const slice = Math.PI * 2 / sides;

  context.beginPath();
  context.moveTo(0 , -radius);
  for (let i = 0; i < sides; i++){
    const theta = i * slice - Math.PI * 0.5
    context.lineTo(Math.cos(theta) * radius, Math.sin(theta) * radius);
  }
  context.closePath();

}

const drawOffsetCircles = ({ context, x, y, maxRadius, rings }) => {
  for (let i = 0; i < rings; i++) {
    const radius = maxRadius * (1 - i / rings);
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.stroke();
  }
};

const drawStar = ({ context, x, y, radius, points }) => {
  const innerRadius = radius * 0.5;
  const slice = Math.PI * 2 / points;

  context.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = i * slice * 0.5 - Math.PI * 0.5;
    const r = i % 2 === 0 ? radius : innerRadius;
    context.lineTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r);
    context.stroke();

  }
  context.closePath();
};






canvasSketch(sketch, settings);
