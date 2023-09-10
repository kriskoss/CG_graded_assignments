// Image of Husky Creative commons from Wikipedia:
// https://en.wikipedia.org/wiki/Dog#/media/File:Siberian_Husky_pho.jpg

// INTRODUCTION: I extended the functionality of this assignment by introducing buttons which enable to turn of or on each filter separately
var centerX;
var centerY;
var imgIn;
// I wrote this code
var buffer;
var buttonBlur;
var buttonVignetting;
var buttonBorder;
var buttonSepia;
var buttonsState={
  "sepia": true,
  "vignetting": true,
  "blur": true,
  "border":true
}

// end of the code I wrote

var matrix = [
  
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64]
];

/////////////////////////////////////////////////////////////////
function preload() {
    imgIn = loadImage("assets/husky.jpg");
}
/////////////////////////////////////////////////////////////////
function setup() {
  createCanvas((imgIn.width * 2), imgIn.height);
  // I wrote this code
  buffer = createGraphics(imgIn.width, imgIn.height)

  // Creating instances of myButton
  buttonBlur = new myButton("blur", 20,40)
  buttonSepia = new myButton("sepia", 20,70);
  buttonVignetting = new myButton("vignetting",20,100);
  buttonBorder = new myButton("border",20,130)

  // end of the code I wrote
}
/////////////////////////////////////////////////////////////////
function draw() {
    background(125);
    image(imgIn, 0, 0);
    image(earlyBirdFilter(imgIn), imgIn.width, 0);
    noLoop();
}
/////////////////////////////////////////////////////////////////
function mousePressed(){
  loop();
}
/////////////////////////////////////////////////////////////////
function earlyBirdFilter(img){
  var resultImg = createImage(imgIn.width, imgIn.height);
  
  // I wrote this code
  centerX = floor(img.width / 2)
  centerY = floor(img.height / 2)
  resultImg = imgIn

  // SEPIA FILTER
  if (buttonSepia.state) {
    resultImg = sepiaFilter(imgIn);
  }

  // VIGNETTING FILTER
  if (buttonVignetting.state){
    resultImg = darkCorners(resultImg);
  }
  // BLUR FILTER
  if (buttonBlur.state){
    resultImg = radialBlurFilter(resultImg);
  }
  
  // BORDER FILTER
  if (buttonBorder.state){
    resultImg = borderFilter(resultImg)
  }

  // end of the code I wrote
  return resultImg;
}
// I wrote this code
function sepiaFilter(img){
  // Sepia filter code - modifies each channel to give the sepia effect
  imgOut = createImage(img.width,img.height)
  
  img.loadPixels();
  imgOut.loadPixels()

  for(let x=0;x<img.width;x++){
    for(let y=0;y<img.height;y++){
      // Traversing the pixels array 
      
      let index = (img.width*y+x)*4;

      // Getting the each chanell values
      let oldRed = img.pixels[index + 0]
      let oldGreen = img.pixels[index + 1]
      let oldBlue = img.pixels[index + 2]

      // Creating new values of each channel based on the original values
      newRed = (oldRed * .393) + (oldGreen *.769) + (oldBlue * .189)
      newGreen = (oldRed * .349) + (oldGreen *.686) + (oldBlue * .168)
      newBlue = (oldRed * .272) + (oldGreen *.534) + (oldBlue * .131)

      // Modifying the pixels array
      imgOut.pixels[index+0] = newRed;
      imgOut.pixels[index+1] = newGreen;
      imgOut.pixels[index+2] = newBlue;
      imgOut.pixels[index+3] = 255;
    }
  }
  
  // Letting know the p5.js that the pixels were modified
  imgOut.updatePixels()
  return imgOut
}

function darkCorners(img){
  // The function that gives the vignetting effect
  for(let x=0;x<img.width;x++){
    for(let y=0;y<img.height;y++){
        
      // Traversing the pixels array
      let index = (img.width*y+x)*4;

      // Getting each colour of the pixel
      let oldRed = img.pixels[index + 0]
      let oldGreen = img.pixels[index + 1]
      let oldBlue = img.pixels[index + 2]
      
      // Measuring the distance from the center
      let d = dist(centerX,centerY,x,y)
      let dynLum =0;
      
      // Reduces the intensity of each colour depending on the distance from the center

      if (d<=300){ // No change in intensity
        dynLum = 1; 
      } 
      else if (d<=450){ // Gradual reduction of the intensity 
        dynLum = map(d,300,450,1,0.4)
      }
      else
      {
        dynLum = map(d,450,600,0.4,0) // Reduction of the intensity to total darkness
      }
      
      // Modifying pixels
      imgOut.pixels[index+0] = oldRed*dynLum;
      imgOut.pixels[index+1] = oldGreen*dynLum;
      imgOut.pixels[index+2] = oldBlue*dynLum;
      imgOut.pixels[index+3] = 255;

    }
  }
  // Letting know p5.js that the imgOut pixel array was modified
  imgOut.updatePixels()
  return imgOut
}

function radialBlurFilter(img){
  // Radial blur is using convolution to blur the image. It need to use kernel - the matrix at the beginning of the code to do the calculations
  var imgOut = createImage(img.width, img.height)
  var matrixSize = matrix.length;

  // Loading pixels to gain direct access to them
  imgOut.loadPixels() 
  img.loadPixels()
  
  for(var x=0;x<img.width;x++){ 
    for(var y=0;y<img.height;y++){
          
      // Traversing pixels array
          let index = (y*img.width + x) * 4

          let r = img.pixels[index + 0]
          let g = img.pixels[index + 1]
          let b = img.pixels[index + 2]

          // Calling convolution function to blur the image
          var c = this.convolution (x, y, matrix, matrixSize, img)
          
          // Blur intensity depends on the distance from the last click of the mouse
          var d =dist(x,y,mouseX-img.width,mouseY) 
          
          var dynBlur = map(d,100,300,0,1)
          dynBlur = constrain(dynBlur,0,1)
          imgOut.pixels[index + 0] = c[0]*dynBlur + r*(1-dynBlur);
          imgOut.pixels[index + 1] = c[1]*dynBlur + g*(1-dynBlur);
          imgOut.pixels[index + 2] = c[2]*dynBlur + b*(1-dynBlur);
          imgOut.pixels[index + 3] = 255;

      }
  }
  imgOut.updatePixels();
  return imgOut;
}

function convolution(x, y, matrix, matrixSize, img){
  // The convolution function as per instruction
  var totalRed = 0;
  var totalGreen = 0;
  var totalBlue = 0;

  var offset = floor(matrixSize/2);

  for (var i=0; i<matrixSize;i++){  // 
      for(var j=0; j<matrixSize;j++){
          var xloc = x + i - offset;
          var yloc = y + j - offset;
          var index = (img.width*yloc+xloc)*4; 
          index = constrain(index, 0, img.pixels.length-1);
          
          totalRed  +=img.pixels[index +0] * matrix[i][j]
          totalGreen+=img.pixels[index +1] * matrix[i][j]
          totalBlue +=img.pixels[index +2] * matrix[i][j]
      
      }
  }
  return [totalRed,totalGreen, totalBlue]
}

function borderFilter(img){
  buffer.image(img,0,0) 
  buffer.noFill()
  buffer.strokeWeight(20)
  buffer.stroke(255)
  buffer.rect(0,0,img.width,img.height, 50) // Rounded frame
  buffer.rect(0,0,img.width,img.height)     // White background to eliminate the black corners
  
  return buffer;
}

class myButton{
  constructor(filterName, posX, posY){
    this.filterName = filterName
    this.posX = posX;
    this.posY = posY;

    this.state = true

    this.colOn = color(25, 223, 50, 50);
    this.colOff = color(225, 23, 50, 50);

    // Creating button
    this.btn = createButton(this.filterName)
    this.btn.position(this.posX, this.posY)
    
    // Styling the button
    this.btn.style('background-color', this.colOn)
    this.btn.style('font-size', '18px')
    this.btn.style('border-radius', '5px')
    
    // Button mousePressed functionality
    this.btn.mousePressed(() => {
      this.changeState(filterName)
    })
    
  }
  changeState(filterName){
    this.state = !this.state
    
    if (this.state){
      this.btn.style('background-color', this.colOn)
    } 
    else {
      this.btn.style('background-color', this.colOff)
    }
  }
}
// end of the code I wrote