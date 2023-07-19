///////////// emitterExplosion.js //////////////

class EmitterExplosion extends Emitter{
    constructor(astColor){
        super()
    this.bulletVelocity= createVector(0,0)
    this.offset= createVector(0,0)
    this.astVelocity= createVector(0,0)
    this.explosionParitcles = []
        
    }
    run(){
        this.draw()
      }

      
    explode(locX,locY, velocityX,velocityY, astColor, j,bulletSys,burning,numExplodingParticles){ //OVERRIDE

        //// NEW VECTORS
        this.bulletVelocity = createVector(bulletSys.velocity.x, bulletSys.velocity.y) // bullet velocity
        this.offset = createVector(bulletSys.bullets[j].x-locX, bulletSys.bullets[j].y-locY) // offset vector  from bullet to asteroid
        this.astVelocity = createVector(velocityX, velocityY) // asteroid velocity
        
        // Add all vectors together
        let newParticleVelocit = p5.Vector.add(this.bulletVelocity, this.offset)
        newParticleVelocit = p5.Vector.add(newParticleVelocit , this.astVelocity)
        
        let randomMagn = random(1,5)
        let randomNum = random(100,300)
        let burnFactor = 1
        if (burning){
            burnFactor = 2
        }
        
        for (var i=0; i< randomNum*burnFactor/int(1+numExplodingParticles/150);i++){
            // Create new particle with velocity based on bullet and asteroid velocity and offset at the time of collision
            var randVector = createVector(random(-5,5),random(-5,5))
            var randSkalar = random(0.01,1)
            let v = createVector(0,0)
            
            v.add(this.astVelocity)  // Adds asteroid velocity - neglible effect due to friciton 
            v.add(randVector)
            
            v.add(p5.Vector.mult(newParticleVelocit,-randSkalar)) // Adds new partile vector - sum of bullet speed, offset and asteroid speed
            
            if (i%6==0){ // Bullet trace effect when hit - some paricles fill go straight up
                v.y +=-abs(v.x)
                v.x =0 
                v.rotate((random(-0.3,0.3)**1))
            }
            else if (i%2==0){ // Offset effect - some paricles will go in the direction indicated by newParticleVelocity -- like bounced biliard ball
                v.rotate(random(-0.5,0.5))
                v.mult(0.3)
            }
            else { // Remaining particle will propagate in every direction
                
                v.rotate(random(-PI,PI))
                v.mult((random(0.1,0.5)**1/2))
            }
            v.mult(randomMagn)
            
            
            this.particles.push(new ParticleExplosion(locX,locY,v.x,v.y, astColor))
            
        }
        
    }
  
}