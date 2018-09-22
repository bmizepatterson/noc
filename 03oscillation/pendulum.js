let p;
function setup() {
    createCanvas(windowWidth, windowHeight);
    p = new Pendulum(400, width/2, 0);
}

function draw() {
    background(0);
    p.update();
    p.draw();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}


let Pendulum = function(r, x, y) {
    this.r = r;
    this.origin = createVector(x, y);
    this.angle = PI/2;
    this.aVelocity = 0;
    this.aAcceleration = 0;
    this.position = createVector(this.r*sin(this.angle), this.r*cos(this.angle));
    this.damping = 0.995;

    this.update = function() {
        let gravity = 0.4;
        this.aAcceleration = (-1 * gravity * sin(this.angle)) / this.r;
        this.aVelocity += this.aAcceleration;
        this.aVelocity *= this.damping;
        this.angle += this.aVelocity;
        this.position.set(this.r*sin(this.angle), this.r*cos(this.angle));
        this.position.add(this.origin);
    }

    this.draw = function() {
        stroke(255);
        fill(255);
        line(this.origin.x, this.origin.y, this.position.x, this.position.y);
        ellipse(this.position.x, this.position.y, 32, 32);
    }
}
