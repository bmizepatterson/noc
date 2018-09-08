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
    this.acceleration; // = createVector(-0.01, 0.001);
    this.topspeed     = 10 * this.factor;
    this.r            = 50 * this.factor;
    this.a            = 0;
    this.b            = 10000;

    this.update = function() {
        // Random acceleration
        // this.acceleration = p5.Vector.random2D();
        // this.acceleration.mult(random(2));

        // Perlin noise acceleration
        // this.acceleration = createVector(
        //     map(noise(this.a), 0, 1, -1, 1), 
        //     map(noise(this.b), 0, 1, -1, 1)
        // );

        // Acceleration towards the mouse
        let mouse = createVector(mouseX, mouseY);
        let dir = p5.Vector.sub(mouse, this.location);
        let mag = dir.mag();
        dir.normalize();
        dir.mult(50/mag);
        this.acceleration = dir;

        this.velocity.add(this.acceleration);
        this.velocity.limit(this.topspeed);
        this.location.add(this.velocity);
        this.a += 0.01;
        this.b += 0.01;
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
}
