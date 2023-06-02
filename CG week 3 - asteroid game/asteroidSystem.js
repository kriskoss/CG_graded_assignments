class AsteroidSystem {

  //creates arrays to store each asteroid's data
  constructor(){
    
    this.reset()
  }
  reset(){
    this.locations = [];
    this.velocities = [];
    this.accelerations = [];
    this.diams = [];
    this.explosions =[]
    this.runingExplosions = []

    this.colours =[]
    
  }
  run(){
      this.spawn();
      this.move();
      this.draw();
      
      
  }

  // spawns asteroid at random intervals
  spawn(){
    if (random(1)<0.01){
      this.accelerations.push(new createVector(0,random(0.1,1)));
      this.velocities.push(new createVector(0, 0));
      this.locations.push(new createVector(random(width), 0));
      this.diams.push(random(30,50));
      
      let astColor = [random(255),random(255),random(255)]
      this.colours.push(astColor)

      this.explosions.push(new EmitterExplosion())
    }
  }

  //moves all asteroids
  move(){
    for (var i=0; i<this.locations.length; i++){
      this.velocities[i].add(this.accelerations[i]);
      this.locations[i].add(this.velocities[i]);
      this.accelerations[i].mult(0);
    }
  }

  applyForce(f){
    for (var i=0; i<this.locations.length; i++){
      this.accelerations[i].add(f);
    }
  }

  //draws all asteroids
  draw(){
    noStroke();
    fill(200);
    for (var i=0; i<this.locations.length; i++){
      push()
      fill(this.colours[i][0]/2,this.colours[i][1]/2,this.colours[i][2]/2)
      ellipse(this.locations[i].x, this.locations[i].y, this.diams[i], this.diams[i]);
      pop()
    }
    
    for (var i = 0; i<this.runingExplosions.length; i++){ 
      
      this.runingExplosions[i].run()
    }

  }

  //function that calculates effect of gravity on each asteroid and accelerates it
  calcGravity(centerOfMass){
    for (var i=0; i<this.locations.length; i++){
      var gravity = p5.Vector.sub(centerOfMass, this.locations[i]);
      gravity.normalize();
      gravity.mult(.001);
      this.applyForce(gravity);
    }
  }

  //destroys all data associated with each asteroid
  destroy(index, bulletIndex,bulletSys){
    this.explosions[index].explode(
      this.locations[index].x,
      this.locations[index].y,
      this.velocities[index].x,
      this.velocities[index].y, 
      this.colours[index],
      bulletIndex,
      bulletSys)
    this.runingExplosions.push(this.explosions[index])
    this.explosions.splice(index,1)

    this.locations.splice(index,1);
    this.velocities.splice(index,1);
    this.accelerations.splice(index,1);
    this.diams.splice(index,1);
    this.colours.splice(index,1);
    
    
    
    

  }

  drawExplosion(){
    this.emitterExplosion.explode(asteroids.locations[0].x,asteroids.locations[0].y,0,0)
  }
}
