let movers = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    for (let i = 0; i < 10; i++) {
        movers[i] = new Mover(
            random(width), 
            random(height), 
            random(0.5, 2)
        );
    }
}

function draw() {
    clear();
    let x = mouseX ? mouseX : width / 2;
    let y = mouseY ? mouseY : height / 2;
    for (let i = 0; i < movers.length; i++) {        
        movers[i].attractPoint(x, y);
        movers[i].update();
        movers[i].draw();
    }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

let Mover = function(x, y, mass) {
    this.position      = createVector(x, y);
    this.velocity      = createVector(0, 0);
    this.acceleration  = createVector(0, 0);
    this.mass          = mass;
    this.angle         = 0;

    this.update = function() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.angle = this.velocity.heading();
        this.acceleration.mult(0);
    }

    this.draw = function() {
        stroke(255);
        fill(255, 150);
        rectMode(CENTER);
        push();
        translate(this.position.x, this.position.y);
        rotate(this.angle);
        rect(0, 0, this.mass*20, this.mass*20);
        pop();
    }

    this.applyForce = function(force) {
        if (force instanceof p5.Vector) {
            f = force.copy();
            // acceleration = force / mass
            f.div(this.mass);
            this.acceleration.add(f);
        }
    }

    this.attractPoint = function(x, y) {
        // returns the force of attraction between this attractor and a point
        let mouse = createVector(mouseX, mouseY);
        let dir = p5.Vector.sub(mouse, this.position);
        let mag = dir.mag();
        dir.normalize();
        dir.mult(50/mag);
        this.applyForce(dir);
    }
}
