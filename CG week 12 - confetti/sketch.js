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
    
    confetti.update()
    confetti.draw()
    
    boxes.draw()
    
    myCamera.flyAround()
    
}


class Camera{
    constructor(){}

    static(){
        camera(0,-500,800)
    }   
    flyAround(){
        let locX = sin(frameCount/2)*800
        let locZ = cos(frameCount/2)*800
        camera(locX,-500,locZ)
    }
}

class Confetti{
    constructor(){
        this.confLocs =[]
        this.confTheta =[]
        this.setup()
        this.size = 25

    }
    setup(){
        for (let i=0;i<200;i++){
            // Single confetti loc
            let rX = int(random(-500,500))
            let rY = int(random(-800,0))
            let rZ = int(random(-500,500))
            let vec3d = createVector(rX, rY, rZ)
            this.confLocs.push(vec3d)
    
            // Single confetti angle
            this.confTheta.push(int(random(0,360)))
        }
    }
    draw(){
        for (let i=0;i<this.confLocs.length;i++){
            // Creating single confetti
            push()
                translate(this.confLocs[i])
                let nY = noise(i, frameCount/50)
                
                let rY = map(nY, 0, 1, 0, 360)
                rotateX(this.confTheta[i])
                rotateY(rY)
                noStroke()
                let c = map(i, 0, this.confLocs.length, 0, 255)
                ambientMaterial(c,255-c,0)
                plane(this.size, this.size)
            pop()
        }
    }

    update(){
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
    constructor(){
        this.boxSize = 75
    }

    draw(){
        for(let i=-400; i<=400;i+=this.boxSize){
            for(let j=-400; j<=400;j+=this.boxSize){
                let distance = dist(0,0,0,i,0,j)
                let nF = noise(i/300,j/300,frameCount/50)
                let deltaH = map(nF, 0, 1, 50, 250)
                // let length = (sin(distance/2-frameCount*6)+2)*50 + deltaH
                let length = (sin(distance/2-nF*600- frameCount*3)+2)*50 
                
                push()
                    translate(i,0,j)
                    if (length>130){
                        pointLight(255, 255, 255, i, -400, j)
                        
                    }
                    
                    // normalMaterial()
                    let cR = map(length, 0, 200, 0, 255)
                    // specularMaterial(cR/2,0,255-cR/2)
                    ambientMaterial(cR/2,0,255-cR/2)
                    
                    stroke(0)
                    strokeWeight(2)
                    box(this.boxSize,length,this.boxSize)    
                    
                pop()
            }
        }
    }
}
