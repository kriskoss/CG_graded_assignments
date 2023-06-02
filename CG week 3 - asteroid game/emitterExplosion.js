class EmitterExplosion extends Emitter{
    constructor(astColor){
        super()
        
    }
    
    explode(locX,locY, velocityX,velocityY, astColor){ //OVERRIDE
        console.log("EXPLODE")
        // Adds multiple particles
        for (var i=0; i< 200;i++){
            // Adds randomness to the location and velocity
            velocityX= random(-10,10)
            velocityY= random(-10,10)
            
            

            this.particles.push(new ParticleExplosion(locX,locY,velocityX,velocityY, astColor))
        }
    }
}