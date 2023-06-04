class EmitterBurn extends Emitter{
    constructor(){
        super()

        
    }

    addParticle(locX,locY,velocityX,velocityY){ //OVERRIDE
        // Adds multiple particles
        for (var i=0; i< 2;i++){
            // Adds randomness to the location and velocity
            locX += random(-1,1)
            locY += 5
            velocityX += 0
            velocityY += 0

            this.particles.push(new ParticleBurn(locX,locY,velocityX,velocityY))
        }
    }
    

    burn(index){
        this.colours[index] = [255,50,50]
        this.burinigEmitter[index].addParticle(this.locations[index].x+random(-this.diams[index]/2, this.diams[index]/2),this.locations[index].y)
    }

    stylePartcle(){  //OVERIDE
        noStroke()
        
        var alpha = map(this.age, this.maxAge,0,125,0);
  
        fill(this.r,this.g,this.b,alpha);
              
              
    }
    
    
}