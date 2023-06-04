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
    this.burinigEmitter = []
    this.colours =[]
    this.score = 0
    
    this.numBurnParcicles = 0
    this.numExplosionParticles = 0

    this.isBurning = []

  }
  run(){
      this.spawn();
      this.move();
      this.draw();
      
      
  }

  // spawns asteroid at random intervals
  spawn(){
    if (random(1)<(0.005+0.0003*this.score)){
      this.accelerations.push(new createVector(0,random(0.1,1)));
      this.velocities.push(new createVector(0, 0));
      this.locations.push(new createVector(random(width), 0));
      this.diams.push(random(45,80));
      
      let astColor = [random(255),random(255),random(255)]
      this.colours.push(astColor)

      
      this.explosions.push(new EmitterExplosion())
      this.burinigEmitter.push(new EmitterBurn)
      
      this.isBurning.push(false)
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
    
    for (var i = 0; i<this.runingExplosions.length; i++)
    { 
      this.runingExplosions[i].run()
    }

    for  (var i=0; i<this.burinigEmitter.length; i++)
    {
      this.burinigEmitter[i].run()
    }

    // this.countBurningParicles()
    this.countExplosionParticles()
    this.coutnScore()
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
      bulletSys,
      this.isBurning[index],
      this.numExplosionParticles)
    this.runingExplosions.push(this.explosions[index])
    this.explosions.splice(index,1)

    this.locations.splice(index,1);
    this.velocities.splice(index,1);
    this.accelerations.splice(index,1);
    this.diams.splice(index,1);
    this.colours.splice(index,1);
    this.burinigEmitter.splice(index,1)
    this.isBurning.splice(index,1)
    
    this.score += 1
  }


  burn(index){
    this.isBurning[index] = true
    this.colours[index] = [255,50,50]
    
    if (frameCount%(2+int(this.numBurnParcicles/60))==0){ //reduce number of particles if there are too many asteroids burning for performance
      this.burinigEmitter[index].addParticle(this.locations[index].x+random(-this.diams[index]/2, 
                                          this.diams[index]/2),
                                          this.locations[index].y,
                                          random(-2,2),0)}
  }
  countExplosionParticles(){ //counts number of explosion particles
    if (frameCount%5==0){
      let particles = 0
      this.runingExplosions.forEach(function(EmitterExplosion){
        particles += EmitterExplosion.particles.length
      })
      this.numExplosionParticles= particles
      
    }
  }
   
  countBurningParicles(){ //counts number of burning particles
    if (frameCount%5==0){
      let particles = 0
      this.burinigEmitter.forEach(function(EmitterBurn){
        particles += EmitterBurn.particles.length
      })
      this.numBurnParcicles= particles
      
    }
  }

  coutnScore(){
    fill("orange")
    textSize(40)
    // change font to boxy one
    textFont ("Consolas")

    
    
    text("Score: "+this.score, 50, 50)
  } 
  
}
