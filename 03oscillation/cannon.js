let balls = [], c;

function setup() {
    createCanvas(windowWidth, windowHeight);
    c = new Cannon(100, height/2);
}

function draw() {
    background(200);

    for (let i = 0; i < balls.length; i++) {
        let ball = balls[i];
        let gravity = createVector(0, 0.2);
        ball.applyForce(gravity);

        let friction = ball.velocity.copy();
        friction.normalize();
        friction.mult(-0.01);
        ball.applyForce(friction);

        ball.update();
        ball.draw();
        if (ball.position.y > height) {
            balls.splice(i, 1);
        }
    }
    // Always draw the cannon last so it appears on top
    c.draw();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    c = new Cannon(100, height/2);
}

let Cannonball = function(x, y) {
    this.position      = createVector(x, y);
    this.velocity      = createVector(0, 0);
    this.acceleration  = createVector(0, 0);
    this.radius        = 20;
    this.angle         = 0;
    this.aVelocity     = 1;
    this.aAcceleration = -0.01;

    this.update = function() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);

        this.aVelocity += this.aAcceleration;
        this.aVelocity = constrain(this.aVelocity, 0, 1);
        this.angle += this.aVelocity;
        this.acceleration.mult(0);
    }

    this.draw = function() {
        noStroke();
        fill(0);
        push();
        translate(this.position.x, this.position.y);
        rotate(this.angle);
        ellipse(0, 0, this.radius*2, this.radius*2);
        stroke(255);
        arc(0, 0, this.radius, this.radius, 0, PI/2);
        pop();
    }

    this.applyForce = function(force) {
        this.acceleration.add(force);
    }
}

let Cannon = function(x, y) {
    this.position = createVector(x, y);
    this.angle    = -PI/4;

    this.draw = function() {
        stroke(0);
        push();
        rectMode(CENTER);
        translate(this.position.x, this.position.y);
        push();
        rotate(this.angle);
        fill(175);
        rect(0, 0, 80, 40);
        pop();
        fill(0);
        rect(0, 30, 20, 40);
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
        let ball = new Cannonball(c.position.x, c.position.y);
        balls.push(ball);
        let force = p5.Vector.fromAngle(c.angle);
        force.mult(10);
        ball.applyForce(force);
    }
}
