class Grid {
  /////////////////////////////////
  constructor(_w, _h) {
    this.gridWidth = _w;
    this.gridHeight = _h;
    this.noteSize = 40;
    this.notePos = [];
    this.noteState = [];

    // MY CODE  
    this.polySynth = new p5.PolySynth(); // Creating instances of Poly- and MonoSynth to be able to synthetize the sound. polySynth object required the latest latest version of p5.sound and p5.sound.min to function correctly.
    this.monoSynth = new p5.MonoSynth()
    
    this.noteInitiated = []; // The array that indicates if the sufficient motion in the area appeared to initiate the sound genereation - it stores boolean values. The value is true only when the motion was detected where previously was not present.
    this.notesArr = []; // The array that contain notes names e.g. A5, C7. It is populated by generateNotesArr() method. It is being used by polySynth object to gereate the sound.
    this.generateNotesArr(); // The function mentioned above.
    // END OF MY CODE
    
    
    // initalise grid structure and state
    for (var x = 0; x < _w; x += this.noteSize) {
      var posColumn = [];
      var stateColumn = [];
      var noteColumn = []; // MY CODE - temporary array used to populete noteInitated array below

      for (var y = 0; y < _h; y += this.noteSize) {
        posColumn.push(createVector(x + this.noteSize / 2, y + this.noteSize / 2));
        stateColumn.push(0);
        noteColumn.push(false) // MY CODE - each column contains initally false values only
      }
      this.notePos.push(posColumn);
      this.noteState.push(stateColumn);
      this.noteInitiated.push(noteColumn) //MY CODE - noteInitiated array is being populated by false value.
    }
  }
  /////////////////////////////////
  run(img) {
    img.loadPixels();
    this.findActiveNotes(img);
    this.drawActiveNotes(img);

    this.playActiveNote(); //MY CODE - runs the logic responsible for genereating sound
  }
  /////////////////////////////////
  drawActiveNotes(img) {
    // draw active notes
    fill(255);
    noStroke();
    for (var i = 0; i < this.notePos.length; i++) {
      for (var j = 0; j < this.notePos[i].length; j++) {
        var x = this.notePos[i][j].x;
        var y = this.notePos[i][j].y;
        if (this.noteState[i][j] > 0) {
          var alpha = this.noteState[i][j] * 200;
          var c1 = color(255, 0, 0, alpha);
          var c2 = color(0, 255, 0, alpha);
          var mix = lerpColor(c1, c2, map(i, 0, this.notePos.length, 0, 1));
          fill(mix);
          var s = this.noteState[i][j];
          ellipse(x, y, this.noteSize * s, this.noteSize * s);
        }
        this.noteState[i][j] -= 0.25;
        this.noteState[i][j] = constrain(this.noteState[i][j], 0, 1);
      }
    }
  }
  /////////////////////////////////
  findActiveNotes(img) {
    for (var x = 0; x < img.width; x += 1) {
      for (var y = 0; y < img.height; y += 1) {
        var index = (x + (y * img.width)) * 4;
        var state = img.pixels[index + 0];
        if (state == 0) { // if pixel is black (ie there is movement)
          // find which note to activate
          var screenX = map(x, 0, img.width, 0, this.gridWidth);
          var screenY = map(y, 0, img.height, 0, this.gridHeight);
          var i = int(screenX / this.noteSize);
          var j = int(screenY / this.noteSize);
          this.noteState[i][j] = 1;
        }
      }
    }
  }
  playActiveNote() {
    // Method responsible for calling playSyth and showNote function
    for (var i = 0; i < this.notePos.length; i++) {
      for (var j = 0; j < this.notePos[i].length; j++) {
        var x = this.notePos[i][j].x;
        var y = this.notePos[i][j].y;
        // Until this point nested loop is the same as in the drawActiveNotes method
        var s = this.noteState[i][j];
        if (s > 0.7) { // The area will be activated only if the motion is sufficently large

          if (this.noteInitiated[i][j] == false) {
            // The both function will be genereated only if the area was not active in the previous frame 
            this.noteInitiated[i][j] = true
            this.playSynth(i, j)
            this.showNote(x, y, i, j, s)
          }
        }
        else {
          this.noteInitiated[i][j] = false
        }
      }
    }
  }
  playSynth(i,j) {
    userStartAudio();
    // This function was created based on https://p5js.org/reference/#/p5.PolySynth
    let index = (i*this.notePos.length+j) // The row and column of the areas is converted to the index to be used in recognising which note shoud be played
    
    // console.log("PLAYING SOUND", this.notesArr[index%(this.notesArr.length-1)])
    
    let note = this.notesArr[index%(this.notesArr.length-1)]  // The note is selected from the notesArr which contain the proper note names. The notes will repeat themselves on the canvas

    // note velocity (volume, from 0 to 1)
    let velocity = 0.5;
    // time from now (in seconds)
    let time = 0;
    // note duration (in seconds)
    let dur = random(0.3,1);

    // GERERATING SOUND
    this.polySynth.play(note, velocity, time, dur);
  }
  
  showNote(x,y,i,j,s) {
    // This code draws a border around the areas to indicate which one is the source of the sound. It also indicates which note is being generated. One are can only generate sound once while being active. It has to become inactive to be able to generate sound again.

    push()
    // Drawing border
    let c = color(i * 40, 0, j * 40)
    stroke(c)
    strokeWeight(5)
    ellipse(x, y, this.noteSize * s * 1.2, this.noteSize * s * 1.2);
    
    // Drawing text
    let index = (i*this.notePos.length+j)
    noStroke()
    fill(c)
    textSize(20)
    text(str(this.notesArr[index%(this.notesArr.length-1)]),x-10,y+10)
    pop()
  }

  generateNotesArr(){
    // Function runs once - it populates the notesArr with correct note names 
    let letters = ["A","B","C","D","E","F","G"]
    for(let k=0;k<letters.length;k++) {
      for(let m=1;m<=8;m++){
        this.notesArr.push(letters[k]+str(m))
      }
    }
  }
}
