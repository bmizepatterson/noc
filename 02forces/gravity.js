let a, m;

function setup() {
    createCanvas(windowWidth, windowHeight);
    a = new Attractor(width/2, height/2, 20);
    m = new Mover(
        width/2 + random(-100, 100), 
        height/2 +random(-100,100), 
        random(0.1, 2)
    );
}

function draw() {
    clear();
    a.draw();
    let force = a.attract(m);
    m.applyForce(force);
    m.update();
    m.draw();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

let Attractor = function(x, y, mass) {
    const G = 1;     // gravitational constant
    this.position = createVector(x, y);
    this.mass = mass;

    this.draw = function() {
        noStroke();
        fill(255);
        ellipse(this.position.x, this.position.y, this.mass*2, this.mass*2);
    }

    this.attract = function(mover) {
        // returns the force of attraction between this attractor and a mover object
        let force = p5.Vector.sub(this.position, mover.position);
        let distance = force.mag();
        distance = constrain(distance,5,25);
        force.normalize();
        let strength = (G * this.mass * mover.mass) / (distance * distance);
        force.mult(strength);
        return force;
    }
}

let Mover = function(x, y, mass) {
    this.position     = createVector(x, y);
    this.velocity     = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.mass         = mass;

    this.update = function() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }

    this.draw = function() {
        noStroke();
        fill(255);
        ellipse(this.position.x, this.position.y, this.mass*16, this.mass*16);
    }

    this.applyForce = function(force) {
        if (force instanceof p5.Vector) {
            f = force.copy();
            // acceleration = force / mass
            f.div(this.mass);
            this.acceleration.add(f);
        }
    }
}
