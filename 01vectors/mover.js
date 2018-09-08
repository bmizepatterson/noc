let mover;

function setup() {
    createCanvas(windowWidth, windowHeight);
    mover = new Mover();
}

function draw() {
    clear();
    mover.update();
    mover.checkEdges();
    mover.display();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

let Mover = function() {
    this.location = createVector(random(width), random(height));
    this.velocity = createVector(random(-20,20),random(-20,20));
    this.r = 50;

    this.update = function() {
        this.location.add(this.velocity);
    }

    this.display = function() {
        stroke(255);
        noFill();
        ellipse(this.location.x, this.location.y, 2*this.r, 2*this.r);
    }

    this.checkEdges = function() {
        if (this.location.x > width) {
          this.location.x = 0;
        } else if (this.location.x < 0) {
          this.location.x = width;
        }
     
        if (this.location.y > height) {
          this.location.y = 0;
        } else if (this.location.y < 0) {
          this.location.y = height;
        }
    }
}
