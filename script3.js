var canvasX = 0;
var canvasY = 0;

function mobile() {
  const toMatch = [
    /Android/i, /iPhone/i, /BlackBerry/i, /Windows Phone/i
  ];
  return toMatch.some((toMatchItem) => {
    return navigator.userAgent.match(toMatchItem);
  });
}
function isChrome() {
  const toMatch = [/Chrome/i];
  return toMatch.some((toMatchItem) => {  return navigator.userAgent.match(toMatchItem)
  });
}
if (mobile()) {
  canvasX = 325;
  canvasY = 500;
} else if (isChrome()) {
  canvasX = 1000;
  canvasY = 600;
}

function setup() {
  createCanvas(canvasX,canvasY);
}

let blockData = {
  locationX: [],
  locationY: [],
  rotation: [],
  velocityX: [],
  velocityY: [],
  spin: [],
  colorRed: [],
  colorGreen: [],
  colorBlue: []
}
function spawnBlocks() {
blockData = {
  locationX: [],
  locationY: [],
  rotation: [],
  velocityX: [],
  velocityY: [],
  spin: [],
  colorRed: [],
  colorGreen: [],
  colorBlue: []
}
  for (var i = 0; i < amount+1; i ++) {
    blockData.locationX.push(Math.floor(Math.random()*canvasX));
    blockData.locationY.push(Math.floor(Math.random()*canvasY));
    blockData.rotation.push(45);
    blockData.velocityX.push(0);
    blockData.velocityY.push(0);
    blockData.spin.push(0);
    blockData.colorRed.push(Math.floor(Math.random()*256));
    blockData.colorGreen.push(Math.floor(Math.random()*256));
    blockData.colorBlue.push(Math.floor(Math.random()*256));
  }
}

var amount = 10;
var gravityX = 0;
var gravityY = 0.5;
var bounciness = 0.7;
var friction = 0.98;
var hitStrength = 1;
var punchRadius = 25;
var randomness = 2.5;
var isHighRate = false;

spawnBlocks();

function simplyfyRotation(index) {
  blockData.rotation[index] = blockData.rotation[index]%360;
}

console.log(blockData);
console.error("Ah shitten, here we go again");

function drawCursor() {
  stroke(0);
  strokeWeight(4);
  noFill();
  ellipse(mouseX,mouseY,punchRadius*2,punchRadius*2);
}
function pickValueFromRandom() {
  return((Math.random()-0.5)*randomness);
}
function drawBlock(index) {
  strokeWeight(4);
  stroke(0);
  fill(blockData.colorRed[index],blockData.colorGreen[index],blockData.colorBlue[index],50);
  calculatePosition(index);
  calculateVelocity(index);
  doWalls(index);
  var base = calculateVector(index);
  var point1 = createVector(base[0],base[1]);
  var point2 = createVector(base[1],-base[0]);
  var point3 = createVector(-base[0],-base[1]);
  var point4 = createVector(-base[1],base[0]);
  var centerX = blockData.locationX[index];
  var centerY = blockData.locationY[index];
  beginShape();
  vertex(centerX + point1.x, centerY + point1.y);
  vertex(centerX + point2.x, centerY + point2.y);
  vertex(centerX + point3.x, centerY + point3.y);
  vertex(centerX + point4.x, centerY + point4.y);
  endShape(CLOSE);
}
function doPunch(index) {
  var punchX = -((mouseX - blockData.locationX[index])*hitStrength);
  var punchY = -((mouseY - blockData.locationY[index])*hitStrength);
  var punchSpin= -((punchX+punchY)/2);
  blockData.velocityX[index] += punchX;
  blockData.velocityY[index] += punchY;
  blockData.spin[index] += punchSpin;
  
}
function calculateFriction(index) {
  blockData.velocityX[index] *= friction;
  blockData.velocityY[index] *= friction;
  blockData.spin[index] *= friction;
}
function doWalls(index) {
  if (blockData.locationX[index]<10) {
    blockData.locationX[index] = 10;
    if (blockData.velocityX[index]<0) {
      blockData.velocityX[index] = ((-blockData.velocityX[index]+blockData.spin[index])+(pickValueFromRandom()*blockData.velocityX[index]))*bounciness;
    }
    spinOnWallBounce(index,"x");
  }
  if (blockData.locationY[index]<10) {
    blockData.locationY[index] = 10;
    if (blockData.velocityY[index]<0) {
      blockData.velocityY[index] = ((-blockData.velocityY[index]+blockData.spin[index])+(pickValueFromRandom()*blockData.velocityY[index]))*bounciness;
    }
    spinOnWallBounce(index,"y");
  }
  if (blockData.locationX[index]>canvasX-10) {
    blockData.locationX[index] = canvasX-10;
    if (blockData.velocityX[index]>0) {
      blockData.velocityX[index]=((-blockData.velocityX[index])+(pickValueFromRandom()*blockData.velocityY[index]))*bounciness;
    }
    spinOnWallBounce(index,"x");
  }
  if (blockData.locationY[index]>canvasY-10) {
    blockData.locationY[index] = canvasY-10;
    if (blockData.velocityY[index]>0) {
      blockData.velocityY[index]=((-blockData.velocityY[index]+blockData.spin[index])+(pickValueFromRandom()*blockData.velocityX[index]))*bounciness;
    }
    spinOnWallBounce(index,"y");
  }
}
function spinOnWallBounce(index,d) {
  if (d === "x") {
    blockData.spin[index] += -(blockData.velocityY[index]*2+blockData.spin[index])*bounciness+(pickValueFromRandom()*blockData.velocityY[index]);
  } else if (d === "y") {
    blockData.spin[index] += -(blockData.velocityX[index]+blockData.spin[index])*bounciness+(pickValueFromRandom()*blockData.velocityX[index]);
  }
}
function calculateVelocity(index) {
  blockData.velocityX[index] += gravityX;
  blockData.velocityY[index] += gravityY;
  calculateFriction(index);
}
function calculatePosition(index) {
  blockData.locationX[index] += blockData.velocityX[index];
  blockData.locationY[index] += blockData.velocityY[index];
  blockData.rotation[index] += blockData.spin[index];
  simplyfyRotation(index);
}
function calculateVector(index) {
  var rotationalPoint = blockData.rotation[index]
  var vectorAngle = 180 - rotationalPoint;
  var vectorLength = 25;
  var vectorX = Math.cos(calculateRadiansFromDegrees(vectorAngle)) * vectorLength;
  var vectorY = Math.sin(calculateRadiansFromDegrees(vectorAngle)) * vectorLength;
  return [vectorX,vectorY];
}
function draw() {
  background(220);
  drawCursor();
  for (var i = 0; i < amount; i ++) {
    drawBlock(i);
    if (dist(mouseX, mouseY, blockData.locationX[i], blockData.locationY[i]) < punchRadius&&mouseIsPressed) {
  doPunch(i);
}
  }
  
}
function calculateDegreesFromRadians(radians) {
  return radians * (180/Math.PI);
}
function calculateRadiansFromDegrees(degrees) {
  return degrees * (Math.PI/180);
}
document.getElementById("gravitySliderX").addEventListener("input",function() {
  gravityX = Number(this.value);
  document.getElementById("gnX").textContent = gravityX;
});
document.getElementById("gravitySliderY").addEventListener("input",function() {
  gravityY = Number(this.value);
  document.getElementById("gnY").textContent = gravityY;
});
document.getElementById("frictionSlider").addEventListener("input",function() {
  friction = Number(this.value);
  document.getElementById("fn").textContent = friction;
});
document.getElementById("bouncinessSlider").addEventListener("input",function() {
  bounciness = Number(this.value);
  document.getElementById("bn").textContent = bounciness;
});
document.getElementById("amountSlider").addEventListener("input",function() {
  amount = Number(this.value);
  document.getElementById("an").textContent = amount;
  spawnBlocks();
});
document.getElementById("punchRadius").addEventListener("input",function() {
  punchRadius = document.getElementById("punchRadius").value;
  document.getElementById("pr").textContent = punchRadius;
});
document.getElementById("randomnessSlider").addEventListener("input", function() {
  randomness = document.getElementById("randomnessSlider").value;
  document.getElementById("rn").textContent = randomness;
});
document.getElementById("start").addEventListener("click",function() {
  loop();
});
document.getElementById("stop").addEventListener("click",function() {
  noLoop();
});
document.getElementById("punchSlider").addEventListener("input",function() {
  hitStrength = Number(this.value);
  document.getElementById("ps").textContent = hitStrength;
});
document.getElementById("scatter").addEventListener("click",function() {
  for (var i = 0; i < amount; i ++) {
    blockData.velocityX[i] += (Math.random()-0.5)*20;
    blockData.velocityY[i] += (Math.random()-0.5)*20;
    blockData.spin[i] += (Math.random()-0.5)*10;
  }
});
document.getElementById("stopMovement").addEventListener("click",function() {
  for (var i = 0; i < amount; i ++) {
    blockData.velocityX[i] = 0;
    blockData.velocityY[i] = 0;
    blockData.spin[i] = 0;
  }
});
document.getElementById("resetRotation").addEventListener("click",function() {
  for (var i = 0; i < amount; i ++) {
    blockData.rotation[i] = 45;
    blockData.spin[i] = 0;
  }
});
document.getElementById("highRateValues").addEventListener("click",function() {
  if (!(isHighRate)) {
    if (!confirm("Are you sure you want to set values to high rate? Your device may not handle it if you aren't careful. If the simulation crashes, click 'reset values', then 'stop the script' then 'start the script' ")) {
      return;
    }
  document.getElementById("gravitySliderX").max= 100;
  document.getElementById("gravitySliderX").min= -100;
  document.getElementById("gravitySliderY").max= 100;
  document.getElementById("gravitySliderY").min= -100;
  document.getElementById("frictionSlider").max= 10;
  document.getElementById("bouncinessSlider").max= 10;
  document.getElementById("punchSlider").max= 10;
  document.getElementById("amountSlider").max= 100000;
  document.getElementById("punchRadius").max= 500;
  document.getElementById("randomnessSlider").max= 100;
  isHighRate = true;
} else if (isHighRate) {
  document.getElementById("gravitySliderX").max=3;
  document.getElementById("gravitySliderX").min=-3;
  document.getElementById("gravitySliderY").max=3;
  document.getElementById("gravitySliderY").min=-3;
  document.getElementById("frictionSlider").max= 2;
  document.getElementById("bouncinessSlider").max= 1;
  document.getElementById("punchSlider").max= 2;
  document.getElementById("amountSlider").max= 1000;
  document.getElementById("punchRadius").max= 100;
  document.getElementById("randomnessSlider").max= 10;
  isHighRate = false;
}
});
document.getElementById("resetValues").addEventListener("click",function() {
  gravityX = 0;
  gravityY = 0.5;
  bounciness = 0.7;
  friction = 0.98;
  hitStrength = 1;
  amount = 10;
  punchRadius = 25;
  randomness = 2.5
  document.getElementById("gnX").textContent = gravityX;
  document.getElementById("gnY").textContent = gravityY;
  document.getElementById("fn").textContent = friction;
  document.getElementById("bn").textContent = bounciness;
  document.getElementById("ps").textContent = hitStrength;
  document.getElementById("an").textContent = amount;
  document.getElementById("pr").textContent = punchRadius;
  document.getElementById("rn").textContent = randomness;
  
  document.getElementById("gravitySliderX").value = gravityX;
  document.getElementById("gravitySliderY").value = gravityY;
  document.getElementById("frictionSlider").value = friction;
  document.getElementById("bouncinessSlider").value = bounciness;
  document.getElementById("punchSlider").value = hitStrength;
  document.getElementById("amountSlider").value = amount;
  document.getElementById("punchRadius").value = punchRadius;
  document.getElementById("randomnessSlider").value = randomness;
  spawnBlocks();
});