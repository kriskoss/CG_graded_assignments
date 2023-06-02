class Particle {

    constructor(locX,locY){
      this.location = new createVector(locX, locY);
      this.maxAge= 300
      this.age = 300
      
      this.size = random(10,25);
      
      this.velocity = new createVector(random(-3,3), random(-3,3));
      this.acceleration = new createVector(0, 0);
      
      this.friction_skalar = random(0.0015,0.035) // Adds randomness to the friction
     }
  
    run(){
      this.draw();
      this.move();
    }
  
    /////////////////////////////////////////////////
    draw(){
      push()
      this.size =  map(this.age,this.maxAge,0, 10,random(20,65));
      this.stylePartcle()
      ellipse(this.location.x, this.location.y, this.size, this.size);
      pop()
    }
  
    move(){
      this.velocity.add(this.acceleration);
      this.location.add(this.velocity);
      this.acceleration.mult(0); // Clears the acceleration to be ready for next frame
      this.velocity.limit(7)
    }
    
    
  
    applyForce(force){
      this.acceleration.add(force);
    }
    
    stylePartcle(){
      noStroke()
      var r =   map(this.age, this.maxAge,0,255,0 );
      var g =   map(this.age, this.maxAge,0,200,0);
      var b =   map(this.age, this.maxAge,0,255,100);
      var alpha = map(this.age, this.maxAge,0,125,0);

      fill(r,g,b,alpha);
            
            
    }
  
  }