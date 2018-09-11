let movers = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    for (let i = 0; i < 10; i++) {
        movers[i] = new Mover(
            random(width), 
            random(height), 
            random(0.1, 2)
        );
    }
}

function draw() {
    clear();
    let x = mouseX ? mouseX : width/2;
    let y = mouseY ? mouseY : height/2;
    for (let i = 0; i < movers.length; i++) {
        for (let j = 0; j < movers.length; j++) {
            if (i !== j) movers[i].applyForce(movers[j].repel(movers[i]));
        }

        movers[i].applyForce(movers[i].attract(x, y));
        movers[i].update();
        movers[i].draw();
    }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

let Mover = function(x, y, mass) {
    const G           = 0.4;
    this.position     = createVector(x, y);
    this.velocity     = createVector(0, 0);
    // this.velocity     = createVector(random(-1, 1), random(-1, 1));
    this.acceleration = createVector(0, 0);
    this.mass         = mass;
    this.trail        = [];

    this.update = function() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.trail.push(createVector(this.position.x, this.position.y));
        if (this.trail.length > 100) this.trail.shift();
        this.acceleration.mult(0);
    }

    this.draw = function() {
        stroke(150);
        for (let p = 0; p < this.trail.length - 1; p++) {
            line(this.trail[p].x, this.trail[p].y, this.trail[p+1].x, this.trail[p+1].y);
        }
        noStroke();
        fill(255);
        ellipse(this.position.x, this.position.y, this.mass*24, this.mass*24);
    }

    this.applyForce = function(force) {
        if (force instanceof p5.Vector) {
            f = force.copy();
            // acceleration = force / mass
            f.div(this.mass);
            this.acceleration.add(f);
        }
    }

    this.attract = function(x, y) {
        let attractionFactor = G * 100;
        let origin = createVector(x,y);
        let force = p5.Vector.sub(origin, this.position);
        let distance = force.mag();
        distance = constrain(distance, 5, 50);
        force.normalize();
        let strength = (attractionFactor * this.mass) / (distance * distance);
        force.mult(strength);
        return force;
    }

    this.repel = function(mover) {
        // returns the force of attraction between this attractor and a mover object
        let repulsionFactor = G;
        let force = p5.Vector.sub(this.position, mover.position);
        let distance = force.mag();
        distance = constrain(distance,5,25);
        force.normalize();
        let strength = (repulsionFactor * this.mass * mover.mass) / (distance * distance);
        force.mult(strength);
        force.mult(-1); // repel
        return force;
    }
}
