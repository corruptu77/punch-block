// SETUP
var Canvaswidth = 400;
var Canvasheight = 400;
function setup() {
  createCanvas(Canvaswidth, Canvasheight);
}
// DATA
var blockData = {
  locationX:[],
  locationY:[],
  rotation:[],
  velocityX:[],
  velocityY:[],
  spin:[]
};
// Crosshair (Goes to mouse position, turns red when mouse is pressed, and has lines coming out of it when mouse is pressed ok copilot, thanks mr obvious. I know that it has lines coming out of it when the mouse is pressed, but I just wanted to make sure that you know that I know that it has lines coming out of it when the mouse is pressed, so I just wanted to say that it has lines coming out of it when the mouse is pressed, ok? Thanks, copilot.)
function crosshair() {
  noFill();
  strokeWeight(4);
  stroke(0);
  ellipse(mouseX,mouseY,50,50);
  if (mouseIsPressed) {
  stroke(255,0,0);
  ellipse(mouseX,mouseY,50,50);
  line(mouseX+12.5,mouseY,mouseX+37.5,mouseY);
  line(mouseX-12.5,mouseY,mouseX-37.5,mouseY);
  line(mouseX,mouseY+12.5,mouseX,mouseY+37.5);
  line(mouseX,mouseY-12.5,mouseX,mouseY-37.5);
  }
}
// Block Entity Data List
function blockEntities(Number,index) {
  // Build the four corner points relative to center
  var base = calculateVector(index);
  var point1 = createVector(base[0], base[1]);
  var point2 = createVector(base[1], -base[0]);
  var point3 = createVector(-base[0], -base[1]);
  var point4 = createVector(-base[1], base[0]);
  var cx = blockData.locationX[index];
  var cy = blockData.locationY[index];
  // Draw a filled polygon so the block is clearly visible
  stroke(0);
  strokeWeight(2);
  fill(200, 120, 80, 200);
  beginShape();
  vertex(cx + point1.x, cy + point1.y);
  vertex(cx + point2.x, cy + point2.y);
  vertex(cx + point3.x, cy + point3.y);
  vertex(cx + point4.x, cy + point4.y);
  endShape(CLOSE);
  
}
// Block Entity Functions
  // calculate velocity
function calculateVelocity(index) {
  // Remove horizontal acceleration derived from rotation so gravity only pulls down.
  // Keep a small vertical component if desired (currently unchanged).
  // Horizontal component was causing drift to the right when rotation was non-zero.
  // blockData.velocityX[index] += Math.cos(calculateRadiansFromDegrees(blockData.rotation[index])) * 0.1;
  blockData.velocityY[index] += Math.sin(calculateRadiansFromDegrees(blockData.rotation[index])) * 0.1;
}
  // calculate spin
function calculateSpin(index) {
  // Apply current spin to rotation, then decay spin over time
  blockData.rotation[index] += blockData.spin[index];
  blockData.spin[index] *= 0.98;
}
  // calculate location
function calculateLocation(index) {
  blockData.locationX[index] += blockData.velocityX[index];
  blockData.locationY[index] += blockData.velocityY[index];
}
  // calculate gravity
function calculateGravity(index) {
  blockData.velocityY[index] += gravity;
  // If the block is on the ground, or gets punched upwards, gravity is reset to 0
  if (blockData.locationY[index] >= Canvasheight) {
    blockData.velocityY[index] = 0;
  }
}
// Crosshair punches block
function punchBlock(index) {
  // Finds whether the block is in the crosshair, and if it is, it adds velocity to the block, and it adds spin to the block. The more the crosshair is on the block, the stronger the punch
    // Calculate punch strength
  // Use vector from mouse to block so the block is pushed away from the crosshair
  var punchStrengthX = (blockData.locationX[index] - mouseX) / 10;
  var punchStrengthY = (blockData.locationY[index] - mouseY) / 10;
  // Apply an optional index-based multiplier if needed (strength param reserved)
  // The function signature kept simple; callers can scale velocities if desired.
  // Add punch strength to velocity
  blockData.velocityX[index] += punchStrengthX;
  blockData.velocityY[index] += punchStrengthY;
  // Add spin to the block
  blockData.spin[index] += (punchStrengthX - punchStrengthY) * 0.02;
}
var amount = 1;
var gravity = 1;
var friction = 0.98;
var bounciness = 0.7;
// Only hit the block when the crosshair is essentially over it.
// Adjust this value to make punching more/less strict (pixels).
var punchRadius = 25; // pixels (approx block half-size)
var _mouseWasPressed = false;
for (var i = 0;i < amount; i ++) {
  blockData.locationX.push(Canvaswidth/2);
  blockData.locationY.push(Canvasheight/2);
  blockData.rotation.push(0);
  blockData.velocityX.push(0);
  blockData.velocityY.push(0);
  blockData.spin.push(0);
}
// Logs the block data to the console, for debugging purposes
function mousePressed() {
  console.log('mousePressed', {x: mouseX, y: mouseY});
  for (var j = 0; j < amount; j++) {
    var cx = blockData.locationX[j];
    var cy = blockData.locationY[j];
    var dx = cx - mouseX;
    var dy = cy - mouseY;
    var d = Math.sqrt(dx*dx + dy*dy);
    var over = isMouseOverBlock(j);
    var base = calculateVector(j);
    var verts = [
      [cx + base[0], cy + base[1]],
      [cx + base[1], cy - base[0]],
      [cx - base[0], cy - base[1]],
      [cx - base[1], cy + base[0]]
    ];
    console.log('block', j, 'center=', cx, cy, 'dist=', d.toFixed(2), 'over=', over);
    console.log('poly verts=', verts);
  }
  console.log(blockData);
}
console.log(blockData);
console.error("ah, shitten, here we go again...");
function draw() {
  background(220);
  crosshair();
  // Edge-detect mouse press: trigger a single punch per click for nearby blocks
  if (mouseIsPressed && !_mouseWasPressed) {
    for (var j = 0; j < amount; j++) {
      var dx = blockData.locationX[j] - mouseX;
      var dy = blockData.locationY[j] - mouseY;
      var d = Math.sqrt(dx*dx + dy*dy);
      if (d <= punchRadius) {
        // inside proximity — apply punch scaled by proximity to center
        var scale = 1 - Math.min(d / (punchRadius || 1), 1);
        blockData.velocityX[j] += (dx / 10) * scale * 1.5;
        blockData.velocityY[j] += (dy / 10) * scale * 1.5;
        blockData.spin[j] += ((dx - dy) * 0.02) * scale;
        console.log('punch at', j, 'scale', scale.toFixed(2));
      }
    }
  }
  _mouseWasPressed = mouseIsPressed;
  for (var i = 0; i < amount; i++) {
    calculateVelocity(i);
    calculateSpin(i);
    calculateLocation(i);
    calculateGravity(i);
    border(i);
    // Draws the block entity
    blockEntities(amount, i);
      if (Math.abs(blockData.locationY[i]) < 1e-6) {
        console.error("WHY THE FUCK IS IT MICROSCOPIC")
      }
      // Debug: draw the block center so we can see where it is
      noStroke();
      fill(150,0,150,200);
      ellipse(blockData.locationX[i], blockData.locationY[i], 6, 6);
      // Highlight polygon and vertices when mouse is over (debug)
      var over = isMouseOverBlock(i);
      if (over) {
        // compute polygon vertices
        var base = calculateVector(i);
        var verts = [
          [blockData.locationX[i] + base[0], blockData.locationY[i] + base[1]],
          [blockData.locationX[i] + base[1], blockData.locationY[i] - base[0]],
          [blockData.locationX[i] - base[0], blockData.locationY[i] - base[1]],
          [blockData.locationX[i] - base[1], blockData.locationY[i] + base[0]]
        ];
        noFill();
        stroke(0,200,0);
        strokeWeight(2);
        beginShape();
        for (var vi = 0; vi < verts.length; vi++) vertex(verts[vi][0], verts[vi][1]);
        endShape(CLOSE);
        // draw small dots at vertices
        noStroke();
        fill(0,200,0);
        for (var vi = 0; vi < verts.length; vi++) ellipse(verts[vi][0], verts[vi][1], 4, 4);
      }
  }
}
function calculateDegreesFromRadians(radians) {
  return radians * (180/Math.PI);
}
function calculateRadiansFromDegrees(degrees) {
  return degrees * (Math.PI/180);
}
function calculateVector(index) {
  var rotationalPoint = blockData.rotation[index]
  var vectorAngle = 180 - rotationalPoint;
  var vectorLength = 25;
  var vectorX = Math.cos(calculateRadiansFromDegrees(vectorAngle)) * vectorLength;
  var vectorY = Math.sin(calculateRadiansFromDegrees(vectorAngle)) * vectorLength;
  return [vectorX,vectorY];
}

// Point-in-polygon using ray-casting algorithm. `pt` is [x,y], poly is array of [x,y]
function pointInPolygon(pt, poly) {
  var x = pt[0], y = pt[1];
  var inside = false;
  for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    var xi = poly[i][0], yi = poly[i][1];
    var xj = poly[j][0], yj = poly[j][1];
    var intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi + 0.0) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Return true if current mouse position is inside the rotated block polygon
function isMouseOverBlock(index) {
  var base = calculateVector(index);
  var p1 = [blockData.locationX[index] + base[0], blockData.locationY[index] + base[1]];
  var p2 = [blockData.locationX[index] + base[1], blockData.locationY[index] - base[0]];
  var p3 = [blockData.locationX[index] - base[0], blockData.locationY[index] - base[1]];
  var p4 = [blockData.locationX[index] - base[1], blockData.locationY[index] + base[0]];
  return pointInPolygon([mouseX, mouseY], [p1, p2, p3, p4]);
}

// Border (The block does not go through the border, it bounces off of it, and it loses velocity when it bounces off of it.) Holy sentence generating
function border(index) {
  if (blockData.locationX[index] > Canvaswidth) {
    blockData.locationX[index] = Canvaswidth;
    blockData.velocityX[index] *= -bounciness;
    blockData.velocityY[index] *= friction;
  }
  if (blockData.locationX[index] < 0) {
    blockData.locationX[index] = 0;
    blockData.velocityX[index] *= -bounciness;
    blockData.velocityY[index] *= friction;
  }
  if (blockData.locationY[index] > Canvasheight) {
    blockData.locationY[index] = Canvasheight;
    blockData.velocityY[index] *= -bounciness;
    blockData.velocityX[index] *= friction;
  }
  if (blockData.locationY[index] < 0) {
    blockData.locationY[index] = 0;
    blockData.velocityY[index] *= -bounciness;
    blockData.velocityX[index] *= friction;
  }
}

// why the fuck is the block stuck in the corner

console.log("FUCK");
