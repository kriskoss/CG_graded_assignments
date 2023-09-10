var imgs = [];
var avgImg;
var numOfImages = 30;

// My variables
var img
var averageFace;
var canvasWidth;
var canvasHeight;
var transitImg;
var timeout;
    
//////////////////////////////////////////////////////////
function preload() { // preload() runs once
   // I wrote this code 
    for (let i = 0; i<30;i++){
        // Iterating over the images in the assets folder pushing preloaded images into the imgs array
        let filename = str(i) + ".jpg"
        let folder = "assets/" 
        let path = folder + filename
        let img = loadImage(path)
        // console.log(path)
        imgs.push(img)
        
    }
    console.log('---images preloaded---')
    // end of the code I wrote
    
}
//////////////////////////////////////////////////////////
function setup() {
    
   // I wrote this code 
    
    noStroke()
    // Setting the size of the canvas to fit two images next to each other - first image is used to get the size
    canvasWidth = imgs[0].width*2
    canvasHeight = imgs[0].height
    
    createCanvas(canvasWidth, canvasHeight );
    pixelDensity(1);

    // Creating the offset buffers for average and transit images
    avgImg = createGraphics(canvasWidth/2,canvasHeight)
    transitImg = createGraphics(canvasWidth/2,canvasHeight)

    // instance of the AverageFace class is created
    averageFace = new AverageFace();

    // end of the code I wrote
}
//////////////////////////////////////////////////////////
function draw() {
    background(125);

    // I wrote this code 

    // LOADING PIXELS
    averageFace.loadPixelsOfAllImagsAndAvgImg()
        
    // LEFT IMAGE
    averageFace.drawRandomImage()
    
    // UPDATING PIXELS
    averageFace.updateAvgImgForAverageOfAllImages()
    
    // RIGHT IMAGE
    averageFace.drawRightImage()
    
    noLoop()

    // end of the code I wrote
}



// I wrote this code 
function keyPressed(){
    // Key press handler for the averageFace object
    averageFace.keyPressedHandler()
}

function mouseMoved(){
    // Mouse moved handler for the average face object
    averageFace.mouseMovedHandler()
}


class AverageFace{
    // Class contains all the codee
    constructor(){
        
        this.firstImage = imgs[0]   
        this.currentImgIndex = int(random(0,imgs.length-1)) // Random image index
        this.transition = 100 // Range 0-100, indicates transition between LEFT and RIGHT IMAGE
        // Flags
        this.newImageLoaded = true 
        this.readyToDrawAllImages = false
    }

    drawRandomImage(){
        // Function draws the random image when the space is pressed
        let currentImg = imgs[this.currentImgIndex]
        image(currentImg,0,0,currentImg.width,currentImg.height)
    }

    loadPixelsOfAllImagsAndAvgImg(){
        // This fucntion is called whe A is pressed - all images are displayed which were used to generate the average image - this is simple extension
        avgImg.loadPixels()
        transitImg.loadPixels();
        
        for (let i=0;i<imgs.length;i++){
            imgs[i].loadPixels()
        }
    }

    updateAvgImgForAverageOfAllImages(){
        for (let y=0;y<this.firstImage.height;y++){     // Moving along y-axis
            for (let x=0;x<this.firstImage.width;x++){  // Moving along x-axis
                let index = ((y*this.firstImage.width)+x)*4; // Index of the current pixel
                
                ///// Calculating average value for each pixel in avgImg from all images
                
                let sumR =0
                let sumG =0
                let sumB =0
                let sumA =0
                

                for (let i=0;i<imgs.length;i++){        // Iterating through all of the images
                    sumR += imgs[i].pixels[index+0];        // Red
                    sumG += imgs[i].pixels[index+1];        // Green
                    sumB += imgs[i].pixels[index+2];        // Blue
                    sumA += imgs[i].pixels[index+3];        // Alpha
                }   
                // Calculating averages for each pixel
                let avgR  = sumR/imgs.length
                let avgG  = sumG/imgs.length
                let avgB  = sumB/imgs.length
                let avgA  = sumA/imgs.length

                //// Updating avgImg pixels
                avgImg.pixels[index] = avgR 
                avgImg.pixels[index+1] = avgG 
                avgImg.pixels[index+2] = avgB 
                avgImg.pixels[index+3] = avgA 
            }
        }
        
        avgImg.updatePixels()
    }

    drawRightImage(){
        if (this.newImageLoaded){ // Loads avgImg if mouse haven't been moved since the program started
            this.newImageLoaded=false
            image(avgImg,canvasWidth/2,0, avgImg.width,avgImg.height)
            
            /// Show instructions 
            this.#drawInstructions()
            
            
        }
        else if(this.readyToDrawAllImages){
            this.#drawAllImages()
            this.readyToDrawAllImages = false

        }
        else{ // Whenever the mouse was moved the transitImg is drawn
            image(transitImg,canvasWidth/2,0,canvasWidth/2,height)
        }
    }



    /// PRIVATE METHODS ///////////////////////////////////////
    #updateRandomImageIndex(){
        // Generates the random index to be used to display the initial image
        this.currentImgIndex = int(random(0,imgs.length-1))
        console.log(`Displaying image ${this.currentImgIndex}`)
        loop()
    }
    
    #transitBetweenLeftAndRightImage(){
        // Code responsible for generating the transition between the initial image and the average image
        let mT = map(mouseX,0,width,0,1)
        this.transition = constrain(mT, 0, 1)
        
        for (let y=0;y<this.firstImage.height;y++){             // Moving along y-axis
            for (let x=0;x<this.firstImage.width;x++){          // Moving along x-axis
                let pixelIndex= ((y*this.firstImage.width)+x)*4;    // Index of the current pixel
                // Iteraing through pixel
                for(let i=0;i<4;i++){
                    let left = imgs[this.currentImgIndex].pixels[pixelIndex+i]
                    let right = avgImg.pixels[pixelIndex+i]
                    
                    let lerpVal = lerp(left,right, this.transition)
                    transitImg.pixels[pixelIndex+i] = lerpVal
                }
            }
        }
        transitImg.updatePixels()
        this.newImageLoaded = false
        loop()
    }

    #drawInstructions(){
        // Draws instruction text on the canvas at the initial state of the program
        push()
            stroke(255)
            strokeWeight(this.firstImage.width/100)
            textSize(this.firstImage.width/13)
            text("- Press 'A' to see all images. \n- Move the mouse left or right (within the canvas area)\n  to see the transition.\n- Press any key to change the image", 50, 50,)
        pop()
    }

    #drawAllImages(){
        // Draws all images instead of one
        let widthNum = 10
        let heightNum = 30/widthNum
        let imgSize = width/widthNum
        
        background(125)
        for (let i =0; i<heightNum;i++){
            for (let j=0; j<widthNum;j++){
                image(imgs[i*heightNum+j],j*imgSize,i*imgSize,imgSize,imgSize)
            }
        }
    }


    /// EVENT HANDLERS ///////////////////////////////////////////
    keyPressedHandler(){
        if (keyPressed && (key === "A" || key==="a")){
            this.readyToDrawAllImages = true
            loop()
        }
        else if (keyPressed){
            this.#updateRandomImageIndex()
            this.#transitBetweenLeftAndRightImage()
            // this.drawAvgImg();
        } 
    }
    mouseMovedHandler(){
        
        // The RIGHT image is redrawn only every 30th pixel crossed by the mouse or after 300 ms after mouse stopped moving
        if (mouseMoved && mouseX%20==0){ // Every 30th pixel block
            this.#transitBetweenLeftAndRightImage()
        }
        else{// Time out block
            clearTimeout(timeout);
            timeout = setTimeout(() => { this.#transitBetweenLeftAndRightImage(); }, 300); 
                // REFERENCE https://developer.mozilla.org/en-US/docs/Web/API/setTimeout
        }
        
    }
}
// end of the code I wrote
