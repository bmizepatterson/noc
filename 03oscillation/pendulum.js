let p;
function setup() {
    createCanvas(windowWidth, windowHeight);
    p = new Pendulum(400, 30, width/2, 0);
}

function draw() {
    background(0);
    p.go();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}


let Pendulum = function(length, r, x, y) {
    this.length = length;
    this.r = r;
    this.origin = createVector(x, y);
    this.angle = PI/2;
    this.aVelocity = 0;
    this.aAcceleration = 0;
    this.position = createVector(this.length*sin(this.angle), this.length*cos(this.angle));
    this.damping = 0.995;
    this.held = false;

    this.update = function() {
        if (this.held) return;

        let gravity = 0.4;
        this.aAcceleration = (-1 * gravity * sin(this.angle)) / this.length;
        this.aVelocity += this.aAcceleration;
        this.aVelocity *= this.damping;
        this.angle += this.aVelocity;
    }

    this.draw = function() {
        if (this.held) {
            stroke(125);
            fill(125)
        } else {
            stroke(255);
            fill(255);
        }
        this.position.set(this.length*sin(this.angle), this.length*cos(this.angle));
        this.position.add(this.origin);
        line(this.origin.x, this.origin.y, this.position.x, this.position.y);
        ellipse(this.position.x, this.position.y, this.r*2, this.r*2);
    }

    this.hold = function() {
        if (!this.held) return;
        // Hold the pendulum in place
        let diff = p5.Vector.sub(this.origin, createVector(mouseX, mouseY));
        // Angle relative to vertical axis
        this.angle = atan2(-1*diff.y, diff.x) - radians(90);
    }

    this.letGo = function() {
        if (!this.held) return;
        this.aVelocity = 0;
        this.held = false;
    }

    this.clicked = function() {
        let d = dist(mouseX, mouseY, this.position.x, this.position.y);
        if (d < this.r) this.held = true;
    }

    this.go = function() {
        this.update();
        this.hold();
        this.draw();
    }
}

function mousePressed() {
    p.clicked();
}

function mouseReleased() {
    p.letGo();
}
