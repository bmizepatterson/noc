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
    this.location     = createVector(width/2, height/2);
    this.velocity     = createVector(0, 0);
    this.acceleration = createVector(-0.01, 0.001);
    this.topspeed     = 10;
    this.r            = 50;

    this.update = function() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.topspeed);
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
