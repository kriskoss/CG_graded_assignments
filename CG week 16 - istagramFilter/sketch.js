// Image of Husky Creative commons from Wikipedia:
// https://en.wikipedia.org/wiki/Dog#/media/File:Siberian_Husky_pho.jpg
var centerX;
var centerY;
var imgIn;
var buffer;
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
  buffer = createGraphics(imgIn.width, imgIn.height)
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

  centerX = floor(img.width/2)
  centerY = floor(img.height/2)
  resultImg = sepiaFilter(imgIn);

  resultImg = darkCorners(resultImg);
  resultImg = radialBlurFilter(resultImg);
  resultImg = borderFilter(resultImg)
  return resultImg;
}

function sepiaFilter(img){
  imgOut = createImage(img.width,img.height)
  
  img.loadPixels();
  imgOut.loadPixels()

  for(let x=0;x<img.width;x++){
    for(let y=0;y<img.height;y++){
      
      let index = (img.width*y+x)*4;

      let oldRed = img.pixels[index + 0]
      let oldGreen = img.pixels[index + 1]
      let oldBlue = img.pixels[index + 2]

      newRed = (oldRed * .393) + (oldGreen *.769) + (oldBlue * .189)
      newGreen = (oldRed * .349) + (oldGreen *.686) + (oldBlue * .168)
      newBlue = (oldRed * .272) + (oldGreen *.534) + (oldBlue * .131)

      imgOut.pixels[index+0] = newRed;
      imgOut.pixels[index+1] = newGreen;
      imgOut.pixels[index+2] = newBlue;
      imgOut.pixels[index+3] = 255;
    }
  }
  
  
  imgOut.updatePixels()
  return imgOut
}

function darkCorners(img){
  for(let x=0;x<img.width;x++){
    for(let y=0;y<img.height;y++){
        
      let index = (img.width*y+x)*4;

      let oldRed = img.pixels[index + 0]
      let oldGreen = img.pixels[index + 1]
      let oldBlue = img.pixels[index + 2]
      
      let d = dist(centerX,centerY,x,y)
      let dynLum =0;
      if (d<=300){
        dynLum = 1; 
      } 
      else if (d<=450){
        dynLum = map(d,300,450,1,0.4)
      }
      else
      {
        dynLum = map(d,450,600,0.4,0)
      }
      
      imgOut.pixels[index+0] = oldRed*dynLum;
      imgOut.pixels[index+1] = oldGreen*dynLum;
      imgOut.pixels[index+2] = oldBlue*dynLum;
      imgOut.pixels[index+3] = 255;

    }
  }
  imgOut.updatePixels()
  return imgOut
}

function radialBlurFilter(img){
  var imgOut = createImage(img.width, img.height)
  var matrixSize = matrix.length;

  imgOut.loadPixels() 
  img.loadPixels()
  
  for(var x=0;x<img.width;x++){ for(var y=0;y<img.height;y++){
          
          let index = (y*img.width + x) * 4

          let r = img.pixels[index + 0]
          let g = img.pixels[index + 1]
          let b = img.pixels[index + 2]

          var c = this.convolution (x, y, matrix, matrixSize, img)
          
          var d =dist(x,y,mouseX-img.width,mouseY) 
          
          var dynBlur = map(d,100,300,0,1)
          dynBlur = constrain(dynBlur,0,1)
          imgOut.pixels[index + 0] = c[0]*dynBlur + r*(1-dynBlur);
          imgOut.pixels[index + 1] = c[1]*dynBlur + g*(1-dynBlur);
          imgOut.pixels[index + 2] = c[2]*dynBlur + b*(1-dynBlur);
          imgOut.pixels[index + 3] = 255;
          // imgOut.pixels[index + 3] = 255+dynBlur*(-255); // Uncomment to see the area not affected by blur

      }
  }
  imgOut.updatePixels();
  return imgOut;
}

function convolution(x, y, matrix, matrixSize, img){
  var totalRed = 0;
  var totalGreen = 0;
  var totalBlue = 0;

  var offset = floor(matrixSize/2); // "Radius" of the kernel - floor to pass the central point

  for (var i=0; i<matrixSize;i++){  // 
      for(var j=0; j<matrixSize;j++){
          var xloc = x + i - offset;
          var yloc = y + j - offset;
          var index = (img.width*yloc+xloc)*4; 
          index = constrain(index, 0, img.pixels.length-1); // We are programming defensively here - want to be sure that the index I am going to look at is actualy in teh image
          
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