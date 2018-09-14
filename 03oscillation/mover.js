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
    for (let i = 0; i < movers.length; i++) {
        for (let j = 0; j < movers.length; j++) {
            if (i !== j) movers[i].applyForce(movers[j].attract(movers[i]));
        }

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
    this.aVelocity     = 0;
    this.aAcceleration = 0;

    this.update = function() {
        this.aAcceleration = this.acceleration.x / 10;

        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);

        this.aVelocity += this.aAcceleration;
        this.aVelocity = constrain(this.aVelocity,-0.1,0.1);
        this.angle += this.aVelocity;

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

    this.checkEdges = function() {
        if (this.position.x > width) {
          this.position.x = 0;
        } else if (this.position.x < 0) {
          this.position.x = width;
        }
     
        if (this.position.y > height) {
          this.position.y = 0;
        } else if (this.position.y < 0) {
          this.position.y = height;
        }
    }

    this.applyForce = function(force) {
        if (force instanceof p5.Vector) {
            f = force.copy();
            // acceleration = force / mass
            f.div(this.mass);
            this.acceleration.add(f);
        }
    }

    this.attract = function(mover) {
        // returns the force of attraction between this attractor and a mover object
        let force = p5.Vector.sub(this.position, mover.position);
        let distance = force.mag();
        distance = constrain(distance,5,25);
        force.normalize();
        let strength = (0.4 * this.mass * mover.mass) / (distance * distance);
        force.mult(strength);
        return force;
    }
}
