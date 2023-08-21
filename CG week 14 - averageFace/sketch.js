var imgs = [];
var avgImg;
var numOfImages = 30;

// My variables
var img
var averageFace;
let canvasWidth;
let canvasHeight;
    
//////////////////////////////////////////////////////////
function preload() { // preload() runs once
    
    for (let i = 0; i<30;i++){
        let filename = str(i) + ".jpg"
        let folder = "assets/" 
        let path = folder + filename
        let img = loadImage(path)
        // console.log(path)
        imgs.push(img)
        
    }
    console.log('---images preloaded---')

    
}
//////////////////////////////////////////////////////////
function setup() {
    
    
    noStroke()
    averageFace = new AverageFace;
    
    canvasWidth = imgs[0].width*2
    canvasHeight = imgs[0].height
    
    createCanvas(canvasWidth, canvasHeight );
    pixelDensity(1);

    avgImg = createGraphics(canvasWidth,canvasHeight)

}
//////////////////////////////////////////////////////////
function draw() {
    background(125);
    
    // averageFace.drawAllImages()
    averageFace.drawFirstImage()
    
    
    // LOADING PIXELS
    avgImg.loadPixels()
    averageFace.loadPixelsOfAllImags()
    // averageFace.getFirsImagesPixels()    
        
    averageFace.drawFirstImagePixels()

    console.log("END LOOP")
    noLoop()
}




/////////// MY CODE ////////////////////
class AverageFace{
    constructor(){
        this.firstImage = imgs[0]
    }

    drawAllImages(){
        // For testing: draws all preloaded images on the canvas
        let widthNum = 10
        let heightNum = 30/widthNum
        let imgSize = width/widthNum
        for (let i =0; i<heightNum;i++){
            for (let j=0; j<widthNum;j++){
                
                image(imgs[i*heightNum+j],j*imgSize,i*imgSize,imgSize,imgSize)
            }
        }
    }

    drawFirstImage(){
        
        image(this.firstImage,0,0,this.firstImage.width, this.firstImage.height)
    }


    /// DELETE THIS !!!! /////
    getFirsImagesPixels(){
        this.firstImage.loadPixels()
        let imgLength = this.firstImage.pixels.length
        for (let i=0;i<imgLength;i++){
            
            if (i==imgLength-1){
                console.log("this is it" + str(imgLength))
                console.log(this.firstImage.pixels[i])
            }
        }
    
    }

    loadPixelsOfAllImags(){
        for (let i=0;i<imgs.length;i++){
            imgs[i].loadPixels()
        }
        console.log("---imgs pixels loaded---")
        // Checks if the pixels are loaded into memory by checking the pixels length for each image after loadPixels function used
        
        // for (let i=0;i<imgs.length;i++){
        //     console.log(`img${i}.len = ${imgs[0].pixels.length} `)
        // }
        
    }

    drawFirstImagePixels(){
        /*Step 5: Create a nested for-loop looping over all pixels on the first image in the array. Convert the x and y coordinates from the for-loop to a pixel index value and use that value to set the corresponding pixel in the avgImg to red.

        After exiting the nested for loop, update the pixels of the avgImg to let p5js know that the image has had its data changed, and draw the avgImg to the right of the existing image. If you’ve done things right, the left side of the canvas should have the face of the first image in the array and the right side should be bright red.

        Also add a noLoop() at the end of the draw() function as the calculations we are about to do are intense and we only really need to do them once. No need for looping. */
        console.log(this.firstImage.width,this.firstImage.height)
        for (let y=0;y<this.firstImage.height;y++){
            
            for (let x=0;x<this.firstImage.width;x++){
                let index = ((y*this.firstImage.width)+x)*4;
                let R = this.firstImage.pixels[index+0];
                let G = this.firstImage.pixels[index+1];
                let B = this.firstImage.pixels[index+2];
                let A = this.firstImage.pixels[index+3];
                push()
                    fill(R,G,B)
                    rect(x+canvasWidth/2,y,1,1)
                pop()
                
            }
        }
    }
}
