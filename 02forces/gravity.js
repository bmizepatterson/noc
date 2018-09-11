let attractors = [], movers = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    for (let a = 0; a < 3; a++) {
        // attractors[a] = new Attractor(width/2, height/2, 20);
        attractors[a] = new Attractor(random(width), random(height), 20);
    }
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
    for (let m of movers) {
        for (let a of attractors) {
            m.applyForce(a.attract(m));
        }
        m.update();
        m.draw();
    }
    for (let a of attractors) {
        a.drag();
        a.hover(mouseX, mouseY);
        a.draw();        
    }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

let Attractor = function(x, y, mass) {
    const G = 1;     // gravitational constant
    this.position = createVector(x, y);
    this.mass = mass;
    this.dragging = false;
    this.rollover = false;
    this.dragOffset = createVector(0, 0);

    this.draw = function() {
        ellipseMode(CENTER);
        noStroke();
        if (this.dragging) fill(50);
        else if (this.rollover) fill(100);
        else fill(255, 255, 0);
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

    this.clicked = function(mx, my) {
        let d = dist(mx, my, this.position.x, this.position.y);
        if (d < this.mass) {
          this.dragging = true;
          this.dragOffset.x = this.position.x-mx;
          this.dragOffset.y = this.position.y-my;
        }
    }

    this.hover = function(mx, my) {
        let d = dist(mx, my, this.position.x, this.position.y);
        if (d < this.mass) {
          this.rollover = true;
        } 
        else {
          this.rollover = false;
        }
    }

    this.stopDragging = function() {
        this.dragging = false;
    }

    this.drag = function() {
        if (this.dragging) {
          this.position.x = mouseX + this.dragOffset.x;
          this.position.y = mouseY + this.dragOffset.y;
        }
    }
}

let Mover = function(x, y, mass) {
    this.position     = createVector(x, y);
    this.velocity     = createVector(1, 0);
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

// function mousePressed() {
//     for (let a of attractors) {
//         a.clicked(mouseX, mouseY); 
//     }
// }

// function mouseReleased() {
//     for (let a of attractors) {
//         a.stopDragging();
//     }
// }
