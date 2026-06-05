function setup() {
  createCanvas(400,400);
}
var tick = 0;
var setGravity = 1;
var setWidth = 50;
var mouseVelocity = [0,0];
var bounciness = 0.7;
var friction = 0.98;
var hitStrength = 5;
var blockData = {
  location: [175,100],
  rotation: 0,
  locationVelocity: [0,0],
  rotationVelocity: 0
};
var isPunched = false;
var blockValues = {
  pointA: [0,0],
  pointB: [0,50],
  pointC: [50,50],
  pointD: [50,0]
}
function draw() {
  tick ++;
  background(220);
  fill(220);
  strokeWeight(4);
  stroke(0);
  setGravity = Math.sin(tick/20)*0.5 + 0.5;
  ellipse(mouseX,mouseY,setWidth,setWidth);
  
  mouseVelocity[0] = mouseX - pmouseX;
  mouseVelocity[1] = mouseY - pmouseY;

  line(blockValues.pointA[0],blockValues.pointA[1],blockValues.pointB[0],blockValues.pointB[1]);
  line(blockValues.pointB[0],blockValues.pointB[1],blockValues.pointC[0],blockValues.pointC[1]);
  line(blockValues.pointC[0],blockValues.pointC[1],blockValues.pointD[0],blockValues.pointD[1]);
  line(blockValues.pointD[0],blockValues.pointD[1],blockValues.pointA[0],blockValues.pointA[1]);
  
  
  if (mouseIsPressed) {
    if (setWidth < 100) {
      setWidth += 2;
    }
  } else {
    if (setWidth > 50) {
      setWidth -= 2;
    }
  }
  
  if (mouseIsPressed && dist(mouseX,mouseY,blockData.location[0]+25,blockData.location[1]+25) < 50) {
    if (!isPunched) {
      punchBlock(hitStrength);
      isPunched = true;
    }
  } else {
    isPunched = false;
  }
  
  blockData.locationVelocity[1] += setGravity;
  blockData.location[0] += blockData.locationVelocity[0];
  blockData.location[1] += blockData.locationVelocity[1];
  
  blockData.locationVelocity[0] *= 0.95; // Friction on horizontal movement
  
if (blockData.location[1] > 350) {
  blockData.location[1] = 350;
  blockData.locationVelocity[1] *= -bounciness;
}
if (blockData.location[1] < 0) {
  blockData.location[1] = 0;
  blockData.locationVelocity[1] *= -bounciness;
}
if (blockData.location[0] < 0) {
  blockData.location[0] = 0;
  blockData.locationVelocity[0] *= -bounciness;
}
if (blockData.location[0] > 350) {
  blockData.location[0] = 350;
  blockData.locationVelocity[0] *= -bounciness;
}
  
  blockValues.pointA[0] = blockData.location[0];
  blockValues.pointA[1] = blockData.location[1];
  blockValues.pointB[0] = blockData.location[0];
  blockValues.pointB[1] = blockData.location[1]+50;
  blockValues.pointC[0] = blockData.location[0]+50;
  blockValues.pointC[1] = blockData.location[1]+50;
  blockValues.pointD[0] = blockData.location[0]+50;
  blockValues.pointD[1] = blockData.location[1];

  blockData.rotationVelocity *= friction; // Friction
  blockData.rotation += blockData.rotationVelocity;
  var center = [blockData.location[0]+25, blockData.location[1]+25];
  blockValues.pointA = rotatePoint(blockValues.pointA,blockData.rotation,center);
  blockValues.pointB = rotatePoint(blockValues.pointB,blockData.rotation,center);
  blockValues.pointC = rotatePoint(blockValues.pointC,blockData.rotation,center);
  blockValues.pointD = rotatePoint(blockValues.pointD,blockData.rotation,center);
}

function rotatePoint(point, angle, center) {
  var rotatedPoint = [0,0];
  var x = point[0] - center[0];
  var y = point[1] - center[1];
  rotatedPoint[0] = x*cos(angle) - y*sin(angle) + center[0];
  rotatedPoint[1] = x*sin(angle) + y*cos(angle) + center[1];
  return rotatedPoint;
}

function punchBlock(strength) {
  blockData.locationVelocity[0] = (blockData.location[0] - mouseX)/10 * strength;
  blockData.locationVelocity[1] = (blockData.location[1] - mouseY)/10 * strength;
  blockData.rotationVelocity = (random(-1,1)) * strength;
}
