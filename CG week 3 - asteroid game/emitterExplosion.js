class EmitterExplosion extends Emitter{
    constructor(astColor){
        super()
        
    }
    
    explode(locX,locY, velocityX,velocityY, astColor, j,bulletSys){ //OVERRIDE
        console.log("EXPLODE")
        // Adds multiple particles
        
        // bullet = spaceship.bulletSys.bullets[bulletIndex]
        console.log(bulletSys.bullets[j].x, bulletSys.bullets[j].y, bulletSys.velocity.x, bulletSys.velocity.y)
        for (var i=0; i< 200;i++){
            // Adds randomness to the location and velocity
            let vec = createVector(velocityX, velocityY)
            vec.rotate(random(0,360))
            velocityX = vec.x
            velocityY = vec.y
            var vX= velocityX+random(-10,10)
            var vY= velocityY*(-1.2)+random(-10,10)
            
            

            this.particles.push(new ParticleExplosion(locX,locY,vX,vY, astColor))
        }
    }
}