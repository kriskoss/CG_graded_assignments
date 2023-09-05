var video;
var threshold = 20;
var thresholdSlider;
var button;
var backImg;
var currImg;
var diffImg;

function setup() {
    createCanvas(640*2, 480);
    pixelDensity(1)
    video = createCapture(VIDEO)
    video.hide()
    noStroke()

    thresholdSlider = createSlider(0, 255, 20)
    thresholdSlider.position(20, 20)
}

function draw() {
    background(0)
    image(video, 0,0)

    currImg = createImage(video.width, video.height)
    currImg.copy(video, 
        0,0, video.width, video.height, 
        0,0, video.width, video.height)

    diffImg = createImage(video.width, video.height)
    diffImg.loadPixels()

    threshold = thresholdSlider.value()

    if (backImg){ // We only perform the loop if the backImg exists
        backImg.loadPixels()
        currImg.loadPixels()
        for (var x = 0; x < video.width; x++) {
            for (var y = 0; y < video.height; y++) {
                var index = (y * video.width + x) * 4;

                // Here is where all the computer vision happens
                var redSource = currImg.pixels[index + 0]
                var greenSource = currImg.pixels[index + 1]
                var blueSource = currImg.pixels[index + 2]

                var redBack = backImg.pixels[index + 0]
                var greenBack = backImg.pixels[index + 1]
                var blueBack = backImg.pixels[index + 2]

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
    image(diffImg, 640, 0)
}

function keyPressed() {
    if (key == " ") {
        backImg = createImage(currImg.width, currImg.height)

        // Copying what is in the current image to the background image
        backImg.copy(currImg,
            0, 0, currImg.width, currImg.height,
            0, 0, currImg.width, currImg.height)
        console.log("UPdated background")
    }
}