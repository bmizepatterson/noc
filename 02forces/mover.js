let movers = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    for (let i = 0; i < 10; i++) {
        movers[i] = new Mover();
    }
}

function draw() {
    clear();
    for (let mover of movers) {
        // Accelerate towards the mouse
        let mouse = createVector(mouseX, mouseY);
        let dir = p5.Vector.sub(mouse, mover.location);
        let mag = dir.mag();
        dir.normalize();
        dir.mult(10/mag);
        mover.applyForce(dir);

        mover.update();
        mover.checkEdges();
        mover.display();
    }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

let Mover = function() {
    this.factor       = Math.abs(randomGaussian(1, 0.2));
    this.location     = createVector(random() * width, random() * height);
    this.velocity     = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.topspeed     = 10 * this.factor;
    this.r            = 50 * this.factor;

    this.update = function() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.topspeed);
        this.location.add(this.velocity);
        this.acceleration.mult(0);  // Reset acceleration
    }

    this.display = function() {
        stroke(255);
        fill(255, 20);
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

    this.applyForce = function(force) {
        if (force instanceof p5.Vector) {
            this.acceleration.add(force);
        }
    }
}
