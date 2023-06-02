class EmitterSmoke extends Emitter{
    constructor(){
        super()
    }

    addParticle(locX,locY,velocityX,velocityY){ //OVERRIDE
        // Adds multiple particles
        for (var i=0; i< 2;i++){
            // Adds randomness to the location and velocity
            locX += random(-3,3)
            locY += random(-3,3)
            velocityX += random(-1,1)
            velocityY += random(-0.5,0.5)

            this.particles.push(new ParticleSmoke(locX,locY,velocityX,velocityY))
        }
        
        
    }

    
}