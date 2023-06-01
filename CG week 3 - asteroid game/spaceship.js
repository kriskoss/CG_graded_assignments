class Spaceship {

  constructor(){
    this.reset()
  }

  reset(){
    this.velocity = new createVector(0, 0);
    this.location = new createVector(width/2, height/2);
    this.acceleration = new createVector(0, 0);
    this.maxVelocity = 5;
    this.bulletSys = new BulletSystem();
    this.size = 50;
    this.collisionRadius = this.size/2
  }


  run(){
    this.bulletSys.run();
    this.draw();
    this.move();
    this.edges();
    this.interaction();
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
    if (this.location.x<0) this.location.x=width;
    else if (this.location.x>width) this.location.x = 0;
    else if (this.location.y<0) this.location.y = height;
    else if (this.location.y>height) this.location.y = 0;
  }

  setNearEarth(earthLoc){
    console.log("NEAR EARTH!!!")
  
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
