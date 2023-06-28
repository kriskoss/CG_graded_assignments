// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter
// add also Benedict Gross credit

var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Body = Matter.Body;
var Constraint = Matter.Constraint;
var Mouse = Matter.Mouse;
var MouseConstraint = Matter.MouseConstraint;

var engine;
var propeller;
var boxes = [];
var birds = [];
var colors = [];
var ground;
var slingshotBird, slingshotConstraint;
var angle=0;
var angleSpeed=0;
var canvas;

// MY GLOBAL VARIABLES
var maxAngleSpeed = 0.4;
var birdSize = 20;
var boxSize = 80
var slingshotBirdInitPos;

var Events = Matter.Events
////////////////////////////////////////////////////////////
function setup() {
  canvas = createCanvas(1000, 600);

  engine = Engine.create();  // create an engine

  setupGround();

  setupPropeller();

  setupTower();

  setupSlingshot();

  setupMouseInteraction();

  setupCollisionDetections();
}

function shouldSplit(bodyA,bodyB){
  
  if ((bodyB.label == "slingshotBird" && bodyA.label =="towerBox") ){
    // Check the collision speed threshold here
    const collisionSpeedThreshold = 15; // Adjust this value as per your needs
    const relativeVelocity = Matter.Vector.sub(bodyA.velocity, bodyB.velocity);
    const collisionSpeed = Matter.Vector.magnitude(relativeVelocity);
    console.log("MUST SPLIT");
    return collisionSpeed >= collisionSpeedThreshold;
  }
  else if(bodyB.label == "slingshotBird" && bodyA.label =="smallBox"){
    console.log("SPLIT SMALL!!!!")
  }
  else{
    return false
  }
}

function splitBody(bodyA){
  
  
}

function removeFromBoxes(body) {
  let index = boxes.indexOf(body); // gets the index of the box in the boxes array
  
  if (index !== -1) { // box exists in the boxes array
    boxes.splice(index, 1); // removes box from the boxes array
    colors.splice(index, 1); // removes colour from the colours array
  }
}

function replaceWithStack(originalBox) {
  // Get the position and velocity of the original box
  const position = originalBox.position;
  const velocity = originalBox.velocity;
  const angularVelocity = originalBox.angularVelocity;

  // Remove the original box from the world
  Matter.World.remove(engine.world, originalBox);
  removeFromBoxes(originalBox);

  // Create a stack of rectangles
  const stackWidth = 3; // Width of the stack (number of rectangles)
  const stackHeight = 3; // Height of the stack (number of rectangles)
  const stackSize = boxSize / stackWidth; // Size of each rectangle in the stack
  const stack = [];
  for (let i = 0; i < stackHeight; i++) {
    for (let j = 0; j < stackWidth; j++) {
      const x = position.x + j * stackSize;
      const y = position.y + i * stackSize;
      const rectangle = Bodies.rectangle(x, y, stackSize, stackSize,{label:"smallBox"});
      stack.push(rectangle);
    }
  }

  // Add the stack to the world
  Matter.World.add(engine.world, stack);

  // Adjust the position and velocity of each rectangle in the stack
  stack.forEach((rectangle, index) => {
    const x = position.x + ((index % stackWidth) - 0.5) * stackSize;
    const y = position.y + (Math.floor(index / stackWidth) - 0.5) * stackSize;
    Body.setPosition(rectangle, { x, y });
    Body.setVelocity(rectangle, velocity);
    Body.setAngularVelocity(rectangle, angularVelocity);
  });

  // Update the boxes and colors arrays with the new rectangles
  boxes = boxes.concat(stack);
  colors = colors.concat(Array(stack.length).fill(boxColor));
}
////////////////////////////////////////////////////////////
function draw() {
  background(0);

  Engine.update(engine);

  drawGround();

  drawPropeller();

  drawTower();

  drawBirds();

  drawSlingshot();
}
////////////////////////////////////////////////////////////
//use arrow keys to control propeller
function keyPressed(){
  if (keyCode == LEFT_ARROW){
    // Decrease angle speed and go counetr-clockwise
    if (angleSpeed > -maxAngleSpeed){
      angleSpeed -= 0.04;
    }
  }
  else if (keyCode == RIGHT_ARROW){
    // Increase angle speed and go clockwise
    if (angleSpeed < maxAngleSpeed){
      angleSpeed += 0.04;
    }
  }
}
////////////////////////////////////////////////////////////
function keyTyped(){
  //if 'b' create a new bird to use with propeller
  if (key==='b'){
    setupBird();
  }

  //if 'r' reset the slingshot
  if (key==='r'){
    removeFromWorld(slingshotBird);
    removeFromWorld(slingshotConstraint);
    setupSlingshot();
  }
}


//////////////////// MY CODE ///////////////////////
function setupPropeller(){
  // creates a propeller
  propeller = Bodies.rectangle(150, 480, 200, 15, {isStatic: true, angle: angle});

  // adds propeller to the world
World.add(engine.world, [propeller]);
}

function drawPropeller(){
  // update angle
  angle += angleSpeed;
  
  //set angle to the propeller
  Body.setAngle(propeller, angle);
  
  // assign anlgeSpeed to the propeller
  Body.setAngularVelocity(propeller, angleSpeed);

  drawVertices(propeller.vertices);
}

function setupBird(){
  // creates a bird
  let bird = Bodies.polygon(mouseX, mouseY, 1, birdSize,{restitution:0.8, friction:0.5});
  Body.setMass(bird,1)
  
  // keeps track of the bird object
  birds.push(bird);
  
  // adds bird to the world
  World.add(engine.world, [bird]);
}

function drawBirds(){
  // iterate through the birds array to draw individual birds
  for (let i=0; i<birds.length; i++){
    push()
    fill("red")
    drawVertices(birds[i].vertices);
    pop()

    // remove birds that went off screen
    if (isOffScreen(birds[i])){
      removeFromWorld(birds[i]);
      birds.splice(i,1);
      i--;
    }
  }
}


function setupTower(){
  // Creating tower elements
  for (let i=0;i<6;i++){    // tower height in boxes
    for (let j=0;j<3;j++){  // tower width in boxes
      
      // Creatng single box
      let box = Bodies.rectangle(width*0.7+j*boxSize, 620-i*boxSize, boxSize,boxSize, {label:"towerBox"})
      boxes.push(box);
      World.add(engine.world,[box])
      
      // Generatig random colour for the box
      boxColor = color(50,random(50,200),50)
      colors.push(boxColor)
    }
  }
}

function drawTower(){
  // Loops through the individual boxes of the tower and draws them
  for (let i=0;i<boxes.length;i++){
    push();
    fill(color(colors[i]));
    drawVertices(boxes[i].vertices);
    pop();

    // any box off screen is deleted
    if (isOffScreen(boxes[i])){
      removeFromWorld(boxes[i])
      boxes.splice(i,1);
      colors.splice(i,1)
      i--
    }
  }
}


function setupSlingshot(){
  // Creating vector containing slingshotBird inital position 
  var slingshotBirdInitPos = new createVector(200, 200);
  
  // Renames for simplification
  var sBirdiPos = slingshotBirdInitPos;
  slingshotBird = Bodies.circle(sBirdiPos.x,sBirdiPos.y,30, {friction:0, restitution:0.95, label:"slingshotBird"})
  Body.setMass(slingshotBird,10)
  World.add(engine.world, [slingshotBird])
  
  // Creating a contraint that is fixed to the world and to the slingshotBird - constraint is destroyed when mouse released after dragging the slingshotBird (implemented in mouseReleased function)
  slingshotConstraint = Constraint.create({
    pointA:{x:sBirdiPos.x, y:sBirdiPos.y},
    bodyB: slingshotBird,
    pointB:{x:0,y:0},
    stiffness: 0.01,
    damping: 0.0001
  });
  World.add(engine.world, [slingshotConstraint])

}

function drawSlingshot(){
  // Draws Slingshot Bird
  push()
  fill("yellow")
  drawVertices(slingshotBird.vertices)
  pop()

  // Draw slingshot constraint
  drawConstraint(slingshotConstraint)
}


function setupCollisionDetections(){
  Events.on(engine, 'collisionStart', function(event) {
    let pairs = event.pairs;
    
    // Loop over the pairs of objects that collided
    for (let i = 0; i < pairs.length; i++) {
      let bodyA = pairs[i].bodyA;
      let bodyB = pairs[i].bodyB;

      // Check if bodyA should be split
      if (shouldSplit(bodyA,bodyB)) { 
                // Remove the original body from the world
        Matter.World.remove(engine.world, bodyA); 
        removeFromBoxes(bodyA)
        replaceWithStack(bodyA)
      }
    }
  });
}



//**********************************************************************
//  HELPER FUNCTIONS - DO NOT WRITE BELOW THIS line
//**********************************************************************

//if mouse is released destroy slingshot constraint so that
//slingshot bird can fly off
function mouseReleased(){
  setTimeout(() => {
    slingshotConstraint.bodyB = null;
    slingshotConstraint.pointA = { x: 0, y: 0 };
  }, 100);
}
////////////////////////////////////////////////////////////
//tells you if a body is off-screen
function isOffScreen(body){
  var pos = body.position;
  return (pos.y > height || pos.x<0 || pos.x>width);
}
////////////////////////////////////////////////////////////
//removes a body from the physics world
function removeFromWorld(body) {
  World.remove(engine.world, body);
}
////////////////////////////////////////////////////////////
function drawVertices(vertices) {
  beginShape();
  for (var i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y);
  }
  endShape(CLOSE);
}
////////////////////////////////////////////////////////////
function drawConstraint(constraint) {
  push();
  var offsetA = constraint.pointA;
  var posA = {x:0, y:0};
  if (constraint.bodyA) {
    posA = constraint.bodyA.position;
  }
  var offsetB = constraint.pointB;
  var posB = {x:0, y:0};
  if (constraint.bodyB) {
    posB = constraint.bodyB.position;
  }
  strokeWeight(5);
  stroke(255);
  line(
    posA.x + offsetA.x,
    posA.y + offsetA.y,
    posB.x + offsetB.x,
    posB.y + offsetB.y
  );
  pop();
}
