var video;
var threshold = 20;
var thresholdSlider;
var button;
var prevImg;
var currImg;
var diffImg;
var grid;

// MY CODE 
// All modifications to my code were implemented in the Grid.js file. The only modification in this file is the scale factor below.
// Additionally, I had to download newer versions of the p5.sound and p5.sound.min files, as the older versions contained a bug that prevented sound from being generated correctly.
// My apologies for terrible sound effects . I was doing my best ; - )
var vScale = 1 // Using scale to reduce the size of the video due to performance of my machine = for debugging only

function setup() {
    createCanvas(640*2*vScale, 480*vScale);
    pixelDensity(1)
    video = createCapture(VIDEO)
    video.hide()
    noStroke()

    thresholdSlider = createSlider(0, 255, 20)
    thresholdSlider.position(20, 20)
    // I wrote this code
    grid = new Grid(640*vScale, 480*vScale);
    monoSynth = new p5.MonoSynth();

    // end of the code I wrote
}

function draw() {
    background(0)
    image(video, 0,0, 640*vScale, 480*vScale)

    currImg = createImage(video.width, video.height)
    currImg.copy(video, 
        0,0, video.width, video.height, 
        0,0, video.width, video.height)
    
    let scaleFactor = 2
    // scaleFactor = 8  // FOR TESTING ONLY - due to performace of my local machine
    currImg.filter(BLUR,3)
    currImg.resize(currImg.width/scaleFactor, currImg.height/scaleFactor)

    diffImg = createImage(video.width, video.height)
    diffImg.resize(diffImg.width/scaleFactor,diffImg.height/scaleFactor)
    diffImg.loadPixels()

    threshold = thresholdSlider.value()

    if (prevImg){ // We only perform the loop if the prevImg exists
        prevImg.loadPixels()
        currImg.loadPixels()
        for (var x = 0; x < video.width; x++) {
            for (var y = 0; y < video.height; y++) {
                var index = (y * video.width + x) * 4;

                // Here is where all the computer vision happens
                var redSource = currImg.pixels[index + 0]
                var greenSource = currImg.pixels[index + 1]
                var blueSource = currImg.pixels[index + 2]

                var redBack = prevImg.pixels[index + 0]
                var greenBack = prevImg.pixels[index + 1]
                var blueBack = prevImg.pixels[index + 2]

                var d = dist(redSource, greenSource, blueSource, 
                    redBack, greenBack, blueBack)

                if (d > threshold) {
                    diffImg.pixels[index +0] = 0;
                    diffImg.pixels[index +1] = 0;
                    diffImg.pixels[index +2] = 0;
                    diffImg.pixels[index +3] = 255;
                }
                else {
                    diffImg.pixels[index +0] = 255;
                    diffImg.pixels[index +1] = 255;
                    diffImg.pixels[index +2] = 255;
                    diffImg.pixels[index +3] = 255;
                }
            }
        }
    }
    
    diffImg.updatePixels()
    image(diffImg, 640*vScale, 0, 640*vScale,480*vScale)

    // Storing current image to be used as previous frame in the next draw iteration
    prevImg = createImage(currImg.width, currImg.height)
    prevImg.copy(currImg,
        0, 0, currImg.width, currImg.height,
        0, 0, currImg.width, currImg.height)

    grid.run(diffImg)
}
