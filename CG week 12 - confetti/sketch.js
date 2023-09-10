/// I have implemented the following features:
// - implemented objects such as confetti, boxes, and camera
// - implemented noise to create a random movement of the confetti
// - implemented the sine wave that also includes noise to create a some random movement of the boxes
// - implemented a point light to create a light effect on the boxes when they are high enough
// - reduced the number of boxes to improve the performance

var confetti; 
var boxes;
var myCamera;
function setup() {
    createCanvas(900, 600, WEBGL);
    angleMode(DEGREES)
    
    // CRATING AND INITATING OBJECTS
    confetti = new Confetti()
    boxes = new Boxes()
    myCamera = new Camera()

}

function draw() {
    background(0);
    ambientLight(255)
    
    // I wrote this code
    confetti.update()
    confetti.draw()
    
    boxes.draw()
    
    myCamera.flyAround()
    // end of code I wrote
}


// I wrote this code
class Camera{
    // Camera class  - contains static and fly around camera
    constructor(){}

    static(){
        // This code uses static camera instead of the fly around one - I used this for developing this code 
        camera(0,-500,800)
    }   
    flyAround(){
        // Fly around camera - used sin and cos function as per instruction
        let locX = sin(frameCount/2)*800
        let locZ = cos(frameCount/2)*800
        camera(locX,-500,locZ)
    }
}

class Confetti{
    // Confettin class - contains all functionality of the confetti
    constructor(){
        // Constructs the confetti object 
        this.confLocs =[]   // The array containing location of individula confetti
        this.confTheta =[]  // The array containing the rotation angle theta of each confetti leaf
        this.setup()    // Sets up the confetti 
        this.size = 25  // The size of the single confetti plane

    }
    setup(){
        for (let i=0;i<200;i++){
            // Single confetti location - uses random funciton to generate initial location
            let rX = int(random(-500,500))
            let rY = int(random(-800,0))
            let rZ = int(random(-500,500))
            let vec3d = createVector(rX, rY, rZ) // Single confetti location is stored in 3D vector
            this.confLocs.push(vec3d)            // Pushing the vector into the locs array
    
            // Single confetti angle
            this.confTheta.push(int(random(0,360))) // The angel is randomly generated and pushed immediately to the array
        }
    }
    draw(){
        // Method responsible for drawing the all confetti. It uses the location and theta angle arrays.
        for (let i=0;i<this.confLocs.length;i++){
            // Creating single confetti
            push()
                translate(this.confLocs[i])
                let nY = noise(i, frameCount/50) // Using Perlin noise for the movement in Y axis
                
                let rY = map(nY, 0, 1, 0, 360)  // Mapping noise to have meaingful value range
                rotateX(this.confTheta[i])
                rotateY(rY)
                noStroke()
                let c = map(i, 0, this.confLocs.length, 0, 255) // Using the number of the confettin to influence the colour of individual confetti
                ambientMaterial(c,255-c,0)
                plane(this.size, this.size)
            pop()
        }
    }

    update(){
        // Method responsible for updateing the position and the rotation of each confetti plane
        for(let i=0;i<this.confLocs.length;i++){
            // Updating single confetti vertical location and rotation
            // this.confLocs[i].y++
            let nX = noise(i, frameCount/30)
            let deltaX = map(nX, 0, 1, -2, 2)
            let nY = noise(i, frameCount/50)
            this.confLocs[i].y+=nY*3
            this.confLocs[i].x+=deltaX
            this.confTheta[i] +=10
            
            // Repositioning of the single confetti if it reaches the bottom level
            if (this.confLocs[i].y>0){
                this.confLocs[i].y =-800
            }
        }
    }


}


class Boxes{
    // This class contain all the code responsible for generating and drawing the boxes
    constructor(){
        // Constructing the boxes object
        this.boxSize = 75
    }

    draw(){
        // All boxes are generated and drawn by this method
        for(let i=-400; i<=400;i+=this.boxSize){
            for(let j=-400; j<=400;j+=this.boxSize){
                // The 2D array of boxes is being generated here by neste loop as per instruction
                let distance = dist(0,0,0,i,0,j)            // i and j represnt the position of each box.
                let nF = noise(i/300,j/300,frameCount/50)   // Introducing Perlin noise 
                let length = (sin(distance/2-nF*600- frameCount*3)+2)*50 // Generating sine wave with addition of the noise so the movement is not so uniform
                
                push()
                    translate(i,0,j)
                    if (length>130){ // Implementing the point light - it is being switched on whenever the length of the box exceed given threshold
                        pointLight(255, 255, 255, i, -400, j)
                    }
                    
                    // normalMaterial()
                    let cR = map(length, 0, 200, 0, 255)
                    ambientMaterial(cR/2,0,255-cR/2) // A box colour depends on its lenght
                    
                    stroke(0)
                    strokeWeight(2)
                    box(this.boxSize,length,this.boxSize)    
                    
                pop()
            }
        }
    }
}

// end of code I wrote