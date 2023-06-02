class EmitterExplosion extends Emitter{
    constructor(astColor){
        super()
        
    }
    
    explode(locX,locY, velocityX,velocityY, astColor, j,bulletSys){ //OVERRIDE
        console.log("EXPLODE")
        
        //// NEW VECTORS
        let bulletVelocity = createVector(bulletSys.velocity.x, bulletSys.velocity.y) // bullet velocity
        let offset = createVector(bulletSys.bullets[j].x-locX, bulletSys.bullets[j].y-locY) // offset vector  from bullet to asteroid
        let astVelocity = createVector(velocityX, velocityY) // asteroid velocity
        
        // Add all vectors together
        let newParticleVelocit = p5.Vector.add(bulletVelocity, offset, astVelocity)
        
        for (var i=0; i< 200;i++){
            // Create new particle with velocity based on bullet and asteroid velocity and offset at the time of collision
            var vX= velocityX+random(-5,5) - newParticleVelocit.x*random(0.1,0.5)
            var vY= velocityY+random(-5,5) - newParticleVelocit.y*random(0.02,0.04)

            this.particles.push(new ParticleExplosion(locX,locY,vX,vY, astColor))
        }
    }
}