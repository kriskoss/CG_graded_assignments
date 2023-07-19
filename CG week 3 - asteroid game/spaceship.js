//////// spaceship.js //////////////

class Spaceship {

  constructor(){
    this.emitterSmoke = new EmitterSmoke();  // EmitterSmoke is a subclass of Emitter - it is responsible for drawing the particles from the thrusters
    this.reset() // Sets the spaceship to its initial state
    
  }
  
  reset(){  
    // This function resets the spaceship to its initial state

    this.velocity = new createVector(0, 0);
    this.location = new createVector(width/2, height/2);
    this.acceleration = new createVector(0, 0);
    this.maxVelocity = 5;
    this.bulletSys = new BulletSystem();
    this.size = 50;
    this.collisionRadius = this.size/2

    this.thrusterRight = false;
    this.thrusterLeft = false;
    this.thrusterUp = false;
    this.thrusterDown = false;

    this.emitterSmoke.reset()
  }


  run(){
    // Runs the spaceship
    this.bulletSys.run();
    this.draw();
    this.move();
    this.edges();
    this.interaction();
    this.drawThrusters();
    this.emitterSmoke.run()
  }

  draw(){
    fill(125);
    triangle(this.location.x - this.size/2, this.location.y + this.size/2,
        this.location.x + this.size/2, this.location.y + this.size/2,
        this.location.x, this.location.y - this.size/2);
    
    /// FOR TESTING ONLY !!
    this.shipCollisionCircle()
  }

  move(){
      this.velocity.add(this.acceleration);
      this.velocity.limit(this.maxVelocity);
      this.location.add(this.velocity);
      
      this.acceleration.mult(0);
  }

  applyForce(f){
    this.acceleration.add(f);
  }

  interaction(){
      if (keyIsDown(LEFT_ARROW)){
        this.applyForce(createVector(-0.1, 0));
      }
      if (keyIsDown(RIGHT_ARROW)){
        this.applyForce(createVector(0.1, 0));
      }
      if (keyIsDown(UP_ARROW)){
        this.applyForce(createVector(0, -0.1));
      }
      if (keyIsDown(DOWN_ARROW)){
        this.applyForce(createVector(0, 0.1));
      }
  }

  fire(){
    this.bulletSys.fire(this.location.x, this.location.y);
  }

  edges(){
    if (this.location.x<0) {
      this.velocity.x *= random(-0.8,-1); 
      this.location.x = 3;
      this.velocity.y += random(-2,3);
      }
    else if (this.location.x>width) {
        this.location.x = width-3;
        this.velocity.x *= random(-0.8,-1);
        this.velocity.y += random(-2,3);
      }
    else if (this.location.y<0) this.location.y = height;
    else if (this.location.y>height) this.location.y = 0;
    // if (this.location.x<0) this.location.x=width;
    // else if (this.location.x>width) this.location.x = 0;
    // else if (this.location.y<0) this.location.y = height;
    // else if (this.location.y>height) this.location.y = 0;
  }

  setNearEarth(earthLoc){
    // var gravity= createVector(0,0.05)
    var gravity = p5.Vector.sub(earthLoc, this.location).normalize().mult(0.05)
    var dir = gravity.copy().mult(20)  // dir is used to draw gravity vector
    
    var airResistance = this.velocity.copy().mult(-1/30)
    
    this.applyForce(gravity)
    this.applyForce(airResistance)
  
    // DRAW FORCE VECTORS
    this.drawGravityVector(dir)  
    this.drawAirResistanceVector(airResistance)
  }

  drawThrusters(){
    // This function draws the thrusters - it uses the particle system to draw it
    if (this.thrusterRight==true){
        this.emitterSmoke.addParticle(this.location.x,this.location.y, this.velocity.x-10,0); 
      }
      if (this.thrusterLeft==true){
        this.emitterSmoke.addParticle(this.location.x,this.location.y, this.velocity.x+10,0); 
      }
      if (this.thrusterUp==true){
        this.emitterSmoke.addParticle(this.location.x,this.location.y, 0,this.velocity.y+10); 
      }
      if (this.thrusterDown==true){
        this.emitterSmoke.addParticle(this.location.x,this.location.y, 0,this.velocity.y-10); 
      } 
  }

  keyPressed(){
    if (keyCode === RIGHT_ARROW){
      this.thrusterRight = true;
    }
    if (keyCode === LEFT_ARROW){ 
      this.thrusterLeft = true;
    }
    if (keyCode === UP_ARROW){
      this.thrusterUp = true;
    }
    if (keyCode === DOWN_ARROW){
      this.thrusterDown = true;
    }
  }

  keyReleased(){ 
    if (keyCode === RIGHT_ARROW){
      this.thrusterRight = false;
    }
    if (keyCode === LEFT_ARROW){
      this.thrusterLeft = false;
    }
    if (keyCode === UP_ARROW){
      this.thrusterUp = false;
    }
    if (keyCode === DOWN_ARROW){
      this.thrusterDown = false;
    }

  }


  //// MY FUNCITONS FOR DRAWING VECTORS ////
  drawGravityVector(dir){
    push()
    stroke("yellow")
    strokeWeight(4)
    translate(this.location.x,this.location.y)
    line(0,0, dir.x*30,dir.y*30)
    pop()
  }
  
  drawAirResistanceVector(airResistance){
    push()
    stroke("red")
    strokeWeight(4)
    translate(this.location.x, this.location.y)
    line(0,0,airResistance.x*300,airResistance.y*300)
    pop()
  }

  // NEW METHODS
  

 

  /// MY TESTERS !!!////
  shipCollisionCircle()
  {
    push()
    noFill()
    strokeWeight(2)
    stroke("red")
    ellipse(this.location.x,this.location.y,this.collisionRadius,this.collisionRadius)
    pop()    
  }
}
