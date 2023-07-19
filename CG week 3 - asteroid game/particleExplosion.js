//// particleExplosion.js //////

class ParticleExplosion extends Particle{
    constructor(locX,locY,velocityX,velocityY, astColor){
        super(locX,locY,velocityX,velocityY)
        this.velocity.x = velocityX
        this.velocity.y = velocityY
        this.maxAge = 60
        this.age = 60
        this.size = random(20,40);
        this.astColor = astColor
        this.r =   map(this.age, this.maxAge,0,this.astColor[0],0 );
        this.g =   map(this.age, this.maxAge,0,this.astColor[1],0);
        this.b =   map(this.age, this.maxAge,0,this.astColor[2],0);
    }

    

    stylePartcle(){  //OVERIDE
        noStroke()
        
        var alpha = map(this.age, this.maxAge,0,125,0);
  
        fill(this.r,this.g,this.b,alpha);
              
              
    }

    
}