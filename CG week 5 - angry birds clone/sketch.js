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
var boxes;
var birds;
var colors;
var ground;
var slingshotBird, slingshotConstraint;
var angle;
var angleSpeed;
var canvas;

// MY GLOBAL VARIABLES
var maxAngleSpeed = 0.4;
var birdSize = 20;
var boxSize;
var slingshotBirdInitPos;
var Events = Matter.Events
var score;
var towerHeight;
var towerWidth;


var ifGameOver;;
////////////////////////////////////////////////////////////
function setup() {
  canvas = createCanvas(1000, 600);

  birdBoxCollisionDetector = new birdBoxCollisionDetector();
  initializeGame();
}

////////////////////////////////////////////////////////////
function draw() {
  
  Engine.update(engine);
  
  background(0);

  drawGround();

  drawPropeller();

  drawTower();

  drawBirds();

  drawSlingshot();

  drawScore();

  checkForGameOver();

  
}
////////////////////////////////////////////////////////////
function initializeGame(){
  boxes = [];
  birds = [];
  colors = [];
  score = -3;
  angle=0;
  angleSpeed=0;
  boxSize= random(50,80)
  towerHeight = random(6,8);
  towerWidth = random(3,5);

  engine = Engine.create();  // create an engine

  setupGround();

  setupPropeller();

  setupTower();

  setupSlingshot();

  setupMouseInteraction();
  
  birdBoxCollisionDetector.setup();
}

//use arrow keys to control propeller
function keyPressed(){
  if (keyCode == ENTER){
    restartGame();
    
  }
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

function restartGame(){
  initializeGame()

  
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
  let bird = Bodies.polygon(mouseX, mouseY, 1, birdSize,{restitution:0.8, friction:0.5, label:"bird"});
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
      score++;
    }
  }
}


function setupTower(){
  // Creating tower elements
  for (let i=0;i<towerHeight;i++){    // tower height in boxes
    for (let j=0;j<towerWidth;j++){  // tower width in boxes
      
      // Creatng single box
      let box = Bodies.rectangle(width*0.95-j*boxSize, 620-i*boxSize, boxSize,boxSize, {label:"towerBox"})
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
      score++
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


function drawScore(){
  // Shows how many boxes remain do be destroyed and total number of destroyed boxes (the score)
  push()
  // TO DESTROY
  textSize(26);
  fill("red");
  text("To destroy: " + boxes.length, 10, 30);
  
  // SCORE
  textSize(32);
  fill("yelow");
  text("Score: " + score, 10, 60);
  
  // DUST, SMALLBOX, TOWERBOX REMAINING
  textSize(20);
  fill(125);
  // show only boxes which label is "smallBox"
  let towerBoxes = boxes.filter(box => box.label == "towerBox");
  let smallBoxes = boxes.filter(box => box.label == "smallBox");
  let dusts = boxes.filter(box => box.label == "dust");
  text("TowerBoxes: " +towerBoxes.length + ", SmallBoxes: "+smallBoxes.length + ", Dust: "+dusts.length,270, 30);
  pop()
}

function checkForGameOver(){
  // noloop if no boxes left
  if (boxes.length == 0){
    // display game over message
    push()
    textSize(70);
    fill('orange');
    text("GAME OVER", width/2-150, height/2);
    
    // display the final score
    textSize(30);
    fill('green');
    text("Boxes destroyed: " + score, width/2-150, height/2+50);
    fill(125);
    textSize(20);
    text("Press ENTER to restart", width/2-150, height/2+100)
    pop()
    
    // stop the game
    ifGameOver = true;
  }

  if (ifGameOver == false){
    drawScore();
  }
}

class birdBoxCollisionDetector{
  constructor(){
    self = this; // self has to be used as the Events on has its own this
  }
  
  setup(){
    Events.on(engine, 'collisionStart', function(event) {
      let pairs = event.pairs;
      
      // Loop over the pairs of objects that collided
      for (let i = 0; i < pairs.length; i++) {
        let bodyA = pairs[i].bodyA;
        let bodyB = pairs[i].bodyB;
  
        // Check if bodyA should be split
        if (self.shouldSplit(bodyA,bodyB)) { 
        
          // Remove the original body from the world
          Matter.World.remove(engine.world, bodyA); 
          
          self.removeFromBoxes(bodyA)
          score++;
          if (bodyA.label != "dust"){
            self.replaceWithStack(bodyA)
          };
        };
      };
    });
  }

  checkSpeedThreshold(bodyA,bodyB,minSpd){
    /// Check if the collision speed is above a threshold to generate split
    let collisionSpeedThreshold = minSpd; 
    let relativeVelocity = Matter.Vector.sub(bodyA.velocity, bodyB.velocity);
    let collisionSpeed = Matter.Vector.magnitude(relativeVelocity);
    return collisionSpeed >= collisionSpeedThreshold;
  }

  shouldSplit(bodyA,bodyB){
    /// Check if body hit by a bird should split
    if (bodyB.label == "slingshotBird" || bodyB.label == "bird"){
      if (bodyA.label =="towerBox"){ // tower box hit by bird
        if (self.checkSpeedThreshold(bodyA,bodyB,25)){
          console.log("TOWER BOX" + bodyA.id + "SPLIT!");
          return true;
        }
      }
      /// Chcks if small box hit by bird should split
      else if(bodyA.label =="smallBox"){ // small box hit by bird
        if (self.checkSpeedThreshold(bodyA,bodyB,15)){
          console.log("SMAlL BOX" + bodyA.id + "SPLIT!");
          return true;
        }
      }
      else if(bodyA.label =="dust"){ // dust hit by bird
        if (self.checkSpeedThreshold(bodyA,bodyB,5)){
          console.log("DUST" + bodyA.id + "destroy!");
          return true;
        }
      }
    }
    
    else{
      return false;
    }
  }

  removeFromBoxes(body) {
    let index = boxes.indexOf(body); // gets the index of the box in the boxes array
    
    if (index !== -1) { // box exists in the boxes array
      boxes.splice(index, 1); // removes box from the boxes array
      colors.splice(index, 1); // removes colour from the colours array
    }
  }

  replaceWithStack(originalBox) {
    // Get the position and velocity of the original box
    let position = originalBox.position;
    let velocity = originalBox.velocity;
    let angularVelocity = originalBox.angularVelocity;

    // Remove the original box from the world
    Matter.World.remove(engine.world, originalBox);
    self.removeFromBoxes(originalBox);

    // Create a stack of rectangles
    
    let stackWidth = 3; // Width of the stack (number of rectangles)
    let stackHeight = 3; // Height of the stack (number of rectangles)
    
    let stackSize = boxSize / stackWidth; // Size of each rectangle in the stack
    if (originalBox.label == "smallBox"){
      stackSize = stackSize/3;
    }
    let stack = [];
    for (let i = 0; i < stackHeight; i++) {
      for (let j = 0; j < stackWidth; j++) {
        let x = position.x + j * stackSize;
        let y = position.y + i * stackSize;
        let label  = "smallBox"
        if (originalBox.label == "smallBox"){
          label = "dust"
        }
        let rectangle = Bodies.rectangle(x, y, stackSize, stackSize,{label:label});
        stack.push(rectangle);
      }
    }
    
    // Add the stack to the world
    Matter.World.add(engine.world, stack);

    // Adjust the position and velocity of each rectangle in the stack
    stack.forEach((rectangle, index) => {
      let x = position.x + ((index % stackWidth) - 0.5) * stackSize;
      let y = position.y + (Math.floor(index / stackWidth) - 0.5) * stackSize;
      Body.setPosition(rectangle, { x, y });
      Body.setVelocity(rectangle, velocity);
      Body.setAngularVelocity(rectangle, angularVelocity);
    });

    // Update the boxes and colors arrays with the new rectangles
    boxes = boxes.concat(stack);
    colors = colors.concat(Array(stack.length).fill(boxColor));
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
