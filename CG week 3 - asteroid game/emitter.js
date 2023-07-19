//////////emitter.js//////////////

class Emitter{
  // Class based on the particle system introduced in the WEEK 3 lecture
  
  constructor(){
    this.particles = []
  }
  run(){
    this.draw()
  }
  draw(){
    for (var i=0; i< this.particles.length;i++){  
      var paritcle = this.particles[i]
      
      this.particleGravity(paritcle)
      this.particleFriction(paritcle)
      

      // RUN PARTICLES
      paritcle.run();
      
      paritcle.age -=1
      this.removeOldParticle(paritcle)
    }
  }

  addParticle(locX,locY){
    this.particles.push(new Particle(locX,locY))
    
  }

  clearParticles(){
    this.particles =[]
  }
  
  removeOldParticle(particle){
    if ( this.particles.length>0 && particle.age <0){
      this.particles.shift()
    }
  }

  particleGravity(particle){
    // GRAVITY
    var gravity = createVector(0,0.0);
    particle.applyForce(gravity);
  }

  particleFriction(particle){
    // FIRCTION
    var friction = particle.velocity.copy()
    friction.mult(-1)
    friction.normalize();
    friction.mult(particle.friction_skalar + map(particle.age,300,0, 0,0.15));
    
    particle.applyForce(friction);
  }

  reset(){
    this.clearParticles()
  }

  

  
}
  