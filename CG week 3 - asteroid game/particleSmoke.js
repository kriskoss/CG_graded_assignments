class ParticleSmoke extends Particle{
  // Modifies the base class for the smoke particles
  
  constructor(locX,locY,velocityX,velocityY){
    super(locX,locY)
    this.velocity = createVector(velocityX,velocityY)

    this.maxAge = 50
    this.age = 50
    this.size = random(3,6);
    
    }
  
  
}
