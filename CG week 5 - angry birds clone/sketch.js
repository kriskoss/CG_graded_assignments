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
////////////////////////////////////////////////////////////
function setup() {
  canvas = createCanvas(1000, 600);

  engine = Engine.create();  // create an engine

  setupGround();

  setupPropeller();

  setupTower();

  setupSlingshot();

  setupMouseInteraction();
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

  if (frameCount%60==0){
    console.log("Birds number;" + birds.length, "Boxes number" + boxes.length)
  }
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

//////////////////// ADDED CODE ///////////////////////
function setupPropeller(){
  // creates a propeller
  propeller = Bodies.rectangle(150, 480, 200, 15, {isStatic: true, angle: angle});

  // adds propeller to the world
World.add(engine.world, [propeller]);
}

function drawPropeller(){
  
  angle += angleSpeed;
  Body.setAngle(propeller, angle);
  Body.setAngularVelocity(propeller, angleSpeed);

  drawVertices(propeller.vertices);
}

function setupBird(){
  // creates a bird
  let bird = Bodies.polygon(mouseX, mouseY, 1, birdSize,{restitution:0.8, friction:0.5});
  // keeps track of the bird object
  birds.push(bird);
  // adds bird to the world
  World.add(engine.world, [bird]);


}

function drawBirds(){
  for (let i=0; i<birds.length; i++){
    drawVertices(birds[i].vertices);

    if (isOffScreen(birds[i])){
      removeFromWorld(birds[i]);
      birds.splice(i,1);
      i--;
    }
  }
}


function setupTower(){
  for (let i=0;i<6;i++){    // tower height in boxes
    for (let j=0;j<3;j++){  // tower width in boxes
      
      // Creatng single box
      let box = Bodies.rectangle(width*0.7+j*boxSize, 620-i*boxSize, boxSize,boxSize)
      boxes.push(box);
      World.add(engine.world,[box])
      
      // Generatig random colour
      boxColor = color(50,random(50,200),50)
      colors.push(boxColor)
    }
  }
  
}

function drawTower(){
  for (let i=0;i<boxes.length;i++){
    push();
    fill(color(colors[i]));
    drawVertices(boxes[i].vertices);
    pop();

    if (isOffScreen(boxes[i])){
      removeFromWorld(boxes[i])
      boxes.splice(i,1);
      i--
    }
  }
}

