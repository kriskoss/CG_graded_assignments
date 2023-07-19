/*
In this task I was able to implement the wave funcion which uses the translate and rotate functions to give rotating motion to individual dots. The difference in angle phase creates the wave effect. The variable angle_phase use noise to introduce some randomness to the phase. 
The newColor function changes the color of dots dependingt if they are in the lowest or highest position.
The wave reacts to the mouse position 
*/
///

var amp;
let abs_angle=0
let abs_angle4=0
let mx;


function setup()
{
    createCanvas(300, 500);
    background(255);
    rectMode(CENTER);
    // noiseDetail(1)
    amp = 100
    angle = random(0,360)
    counter = 0
}

function draw()
{
    background(255);

    var noOfDots = 30;
    // var size = width/noOfDots; // FOR MIDTERM SUBMISSION
    var size = (width-100)/noOfDots;

    for (var x = 0; x < noOfDots; x++){
      for (var y = 0; y < noOfDots; y++){
        // waves2B(x,y,size) // SUBMITTED  -- WAVES EFFECT - submitted one -
        // waves4(x,y,size) // Modified after mid-term submission - WAVE EFFECT BUT A LOT OF NOISE, x and y controlled by mosue
        noiseSurface(x,y,size)  // NOISE SURFACE EFFECT
    }
    
    // Limitting angle to range of 0 to 360
    // abs_angle = abs_angle%360
    abs_angle4+= mx
    counter+=mx

    abs_angle = abs_angle%360
    abs_angle+=0.1
    
}
}


function createDot(size,c){
  // Creates a dot at 0,0 location of given size and color
  push();
    noStroke()
    fill(c)
    ellipse(0,0,size,size);
  pop();
}


function drawLine(originX,originY,endX,endY){
  // Draws line and dot indicating its beginning between two given positons 
  push()
    stroke(color("red"))
    let el_size = 4
    ellipse(originX,originY,el_size,el_size)
    line(originX,originY,endX,endY)
  pop()
}
/////////////// SUBMITTED WAVE FUNCTION ///////////////

/////////////// 2B /////////

function waves2B(x,y,size ){ 
  
  push() // POSITIONING THE DOTS
    translate(x*size,y*size) // POSITIONING THE DOTS
    
    push() // WAVE EFFECT
      n =wave2B(x, y); 
      let c = createNewColor2B(x,y,n)
      createDot(size/2,c)
    pop() // WAVE EFFECT END
    
  pop() // POSITIONING THE DOTS END
}


function wave2B(x,y){
  // mY = map(mouseY,0,height, 0, 40)
  // let amp = mY
  let amp;
  amp=40
  nA = noise(x*0.1, y*0.1 + 1, frameCount*0.005)
  amp = map(nA,0,1, 0,100)
  
  nAP = noise(x*0.5+1,y*.5+4, frameCount*0.005)
  phaseNoise = map(nAP,0,1,-4,4)
  mX= map(mouseX,-width/2,width/2,0,6)
  mY= map(mouseY,-height/2,height/2,0,6)
  
  anglePhase= x*mX +y*mY  + phaseNoise*5  
  angle = (abs_angle + anglePhase)%360
  
  let barH = amp
  rotate(radians(angle))
  // drawLine(0,0,0,-barH)
  translate(0,-barH)
  
  // FOR COLORS
  let norm_angle;
  if (angle<180){
    norm_angle=map(angle,0,180,1,0)
  }
  else{
    norm_angle=map(angle,180,360,0,1)
  }
  
  return norm_angle
}

function noiseSurface(x,y, size){
  push() // POSITIONING THE DOTS
  fill(0)
  
  translate(y*size*0.4 +x*size, 100+0.5*y*size) // POSITIONING THE DOTS
  
  push() // WAVE EFFECT
  
    n =surface(x, y); 
    let c = createNewColor2B(x,y,1-n)
    createDot(size/1.5,c)
  pop() // WAVE EFFECT END
  
pop() // POSITIONING THE DOTS END
}

function surface(x,y){
  let amp = 20
  shiftV = 0
  let mX= map(mouseX,0,width,0,3)
  let mY= map(mouseY,0,width,0,3)
  // nX= noise(x*0.1+mX, 0)
  // nY= noise(0, y*0.1 +mY)
  n= noise(x*0.1 + mX, y*0.1 + mY, frameCount*0.005)
  
  let barH = map(n,0,1,0,amp)
  
  rotate(radians(0))
  
  let barHeight = -barH
  // drawLine(0,0,0,barHeight)
  translate(0,barHeight)

    return n
}


function createNewColor2B(x,y,n){
  // Creates rnadom color using noise function

  let f = 0.1
  let fc = frameCount*0.01
  
  // let nR = noise((x+1)*f, (y+1)*f, fc)
  let R = map(n, 0,1,255,30)
  let G = 0
  let B = map(n, 0,1,30,255)
  let A = map(n, 0.0,1,255,30)
  
  let c= color(R,G,B,A)
  
  return c
}



/////////////// 4 - modified after mid-term submission/////////

function waves4(x,y,size ){
  
  push() // POSITIONING THE DOTS
    translate(x*size,y*size) // POSITIONING THE DOTS
    
    push() // WAVE EFFECT
      n =wave4(x, y); 
      let c = createNewColor4(x,y,n)
      createDot(size/2,c)
    pop() // WAVE EFFECT END
    
  pop() // POSITIONING THE DOTS END
}


function wave4(x,y){
  // mY = map(mouseY,0,height, 0, 40)
  // let amp = mY
  let amp;
  amp=40
  nA = noise(x*0.1, y*0.1 + 1, frameCount*0.005)
  amp = map(nA,0,1, 0,100)
  
  mX= map(mouseX,-width/2,width/2,0,6)
  mx = mX*0.01
  mY= map(mouseY,-height/2,height/2,0,6)


  nAP = noise(x*0.04+1+mX/3,y*.04+4 + mY/3, frameCount*0.001)
  phaseNoise = map(nAP,0,1,-4,4)
  
  // anglePhase= x*mX +y*mY  + phaseNoise*5  
  anglePhase= phaseNoise*50
  amp = phaseNoise*100
  angle = (abs_angle4 + anglePhase)%360
  
  let barH = amp
  rotate(radians(angle))
  // drawLine(0,0,0,-barH)
  translate(0,-barH)
  
  // FOR COLORS
  let norm_angle;
  if (angle<180){
    norm_angle=map(angle,0,180,1,0)
  }
  else{
    norm_angle=map(angle,180,360,0,1)
  }
  
  return norm_angle
}

function createNewColor4(x,y,n){
  // Creates rnadom color using noise function

  let f = 0.1
  let fc = frameCount*0.01
  
  // let nR = noise((x+1)*f, (y+1)*f, fc)
  let R = map(n, 0,1,255,30)
  let G = 0
  let B = map(n, 0,1,30,255)
  let A = map(n, 0.0,1,255,30)
  
  let c= color(R,G,B,A)
  
  return c
}

////////// NOT USED FUNCTIONS ////////////////
///// 1 ///////////////
function createNewColor(x,y){
  // Creates rnadom color using noise function

  let f = 0.1
  let fc = frameCount*0.01
  
  let R = noise((x+1)*f, (y+1)*f, fc)*255
  let G = 100 -noise((x+2)*f, (y+2)*f, fc)*50
  let B = (1- noise((x+3)*f, (y+3)*f, fc))*255
  
  let c= color(R,G,B)
  
  return c
}

function waves1(x,y,size ){
  let c = createNewColor(x,y)
  push() // POSITIONING THE DOTS
    translate(x*size,y*size) // POSITIONING THE DOTS
    
    push() // WAVE EFFECT
      wave1(x, y); 
      createDot(size/2,c)
    pop() // WAVE EFFECT END
    
  pop() // POSITIONING THE DOTS END
}

function wave1(x,y){
  shiftV = 0
    shiftH = 50
    mY = map(mouseY,0,height,0.05,0.1)
    let mX = map(mouseX,0,width,0.05,0.01)
    let n = noise(x*mX,y*mY+4,frameCount*0.004)
    
    let nA = noise( + x*0.006,y*0.003+2,frameCount*mX)
        
    // let angleStep = map(nA,0,1,-0.1,0.1)
    
    // angleStep = map(nA,0,1,0.01,0.02)
    // angleStep = constrain(angleStep, 0.1, high)
    angleStep = map(mouseX,0,width,-0.02,0.02) + n*map(mouseY,0,height,-0.05,0.05)
    angle = angle + angleStep
    
    shiftH = map(n,0,1,-amp,amp)
    
    // if (x==0 && y==0){
    //   console.log(angle )
    // }
    rotate(radians(angle))
      drawLine(0,0,shiftH,shiftV)
      translate(shiftH,shiftV)
}

///////////
/*Step 4: 
To generate the wave you need to calculate the phase angle and use rotate() and translate() in your wave() function to animate. 
The angle is calculated using the x and y coordinates as well as the frameCount so that the animation change over time. Make sure you scale the input parameters of the wave function appropriately so that you get organic values out of it. Do not use framerate() to adjust the animation.\
*/



function createNewColor2(x,y,n){
  // Creates rnadom color using noise function

  let f = 0.1
  let fc = frameCount*0.01
  
  // let nR = noise((x+1)*f, (y+1)*f, fc)
  let R = map(n,0,1,0, 255)

  let nG = noise((x+2)*f, (y+2)*f, fc)
  let G = 100 -map(nG,0,1,0,255)

  // let nB = map(n,0,1,255, 255)
  let B = (1- noise((x+3)*f, (y+3)*f, fc))*255
  let A = map(n, 0.35,0.6,0,255)
  
  let c= color(R,G,B,A)
  
  return c
}

function waves2(x,y,size ){
  
  push() // POSITIONING THE DOTS
    translate(x*size,y*size) // POSITIONING THE DOTS
    
    push() // WAVE EFFECT
      n =wave2(x, y); 
      let c = createNewColor2(x,y,n)
      createDot(size/2,c)
    pop() // WAVE EFFECT END
    
  pop() // POSITIONING THE DOTS END
}

function wave2(x,y){
  let amp = 100
  shiftV = 0
  let mX= map(mouseX,0,width,0,3)
  let mY= map(mouseY,0,width,0,3)
  // nX= noise(x*0.1+mX, 0)
  // nY= noise(0, y*0.1 +mY)
  n= noise(x*0.1 + mX, y*0.1 + mY)
  
  let barH = map(n,0,1,0,amp)
  
  rotate(radians(0))
  
  let barHeight = -barH
  drawLine(0,0,0,barHeight)
  translate(0,barHeight)

    return n
}



// function wave2B(x,y){
//   mY = map(mouseY,0,height, 0, 40)
//   let amp = mY
//   let mX= map(mouseX,0,width,0,1)
//   nAP = noise(x*0.5, 0)
//   anglePhase = map(nAP,0,1,-0.2,0.2)+ mX
//   angle = (angle + anglePhase)%360
//   let barH = amp
//   rotate(radians(angle))
//   drawLine(0,0,0,-barH)
//   translate(0,-barH)
  
//   // FOR COLORS
//   let norm_angle;
//   if (angle<180){
//     norm_angle=map(angle,0,180,1,0)
//   }
//   else{
//     norm_angle=map(angle,180,360,0,1)
//   }
  
//   return norm_angle
// }