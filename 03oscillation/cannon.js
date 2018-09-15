let ball, c;

function setup() {
    createCanvas(windowWidth, windowHeight);
    c = new Cannon(100, height-100);
    ball = new Cannonball(c.position.x, c.position.y)
}

function draw() {
    background(255);

    if (c.shot) {
        let gravity = createVector(0, 0.2);
        ball.applyForce();
        ball.update();
    }
    ball.draw();
    if (ball.position.y > height) {
        ball = new Cannonball(c.position.x, c.position.y);
        c.shot = false;
    }
    // Always draw the cannon last so it appears on top
    c.draw();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    c = new Cannon(100, height-100);
}

let Cannonball = function(x, y) {
    this.position      = createVector(x, y);
    this.velocity      = createVector(0, 0);
    this.acceleration  = createVector(0, 0);
    this.topspeed      = 10;
    this.radius        = 8;
    this.angle         = 0;
    this.aVelocity     = 0;
    this.aAcceleration = 0;

    this.update = function() {

        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);

        this.aVelocity += this.aAcceleration;
        this.aVelocity = constrain(this.aVelocity,-0.1,0.1);
        this.angle += this.aVelocity;

        this.acceleration.mult(0);
    }

    this.draw = function() {
        noStroke();
        fill(0);
        push();
        translate(this.position.x, this.position.y);
        ellipse(0, 0, this.radius*2, this.radius*2);
        pop();
    }

    this.checkEdges = function() {     
        if (this.position.y > ground - this.radius) {
            this.velocity.y *= -this.mass/5;
            this.position.y = ground - this.radius;
            this.drag();
        }
    }

    this.applyForce = function(force) {
        this.acceleration.add(force);
    }

    this.drag = function() {
        let friction = this.velocity.copy();
        friction.mult(-1);
        friction.normalize();
        this.applyForce(friction.mult(0.1));
    }
}

let Cannon = function(x, y, w, h, angle) {
    this.position = createVector(x, y);
    this.shot     = false;
    this.angle    = -PI/4;

    this.draw = function() {
        stroke(0);
        push();
        rectMode(CENTER);
        translate(this.position.x, this.position.y);
        push();
        rotate(this.angle);
        fill(175);
        rect(0, 0, 40, 20);
        pop();
        fill(0);
        rect(0, 15, 10, 20);
        pop();
        noStroke();
    }
}

function keyPressed() {
    if (keyCode === RIGHT_ARROW) {
        c.angle += 0.1;
    } else if (keyCode === LEFT_ARROW) {
        c.angle -= 0.1;
    } else if (key === ' ') {
        c.shot = true;
        let force = p5.Vector.fromAngle(c.angle);
        force.mult(10);
        ball.applyForce(force);
    }
}
