class ParticleBurn extends Particle{
  // Modifies the base class for the smoke particles
  
  constructor(locX,locY,velocityX,velocityY){
    super(locX,locY)
    this.velocity = createVector(velocityX,velocityY)

    this.maxAge = 90
    this.age = 90
    this.size = random(1,3);

    
    
    }
    draw(){
      push()
      this.size =  map(this.age,this.maxAge,0, 10,random(10,20));
      this.stylePartcle()
      ellipse(this.location.x, this.location.y, this.size, this.size);
      pop()
    }

    stylePartcle(){
      noStroke()
      var r =   map(this.age, this.maxAge,0,255,200);
      var g =   map(this.age, this.maxAge,0,125,0);
      var b =   map(this.age, this.maxAge,0,0,100);
      var alpha = map(this.age, this.maxAge,0,125,50);

      fill(r,g,b,alpha);
            
            
    }

    

  
}
