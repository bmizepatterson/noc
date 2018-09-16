let ship;

function setup() {
    createCanvas(windowWidth, windowHeight);
    ship = new Spaceship(width/2, height/2);
}

function draw() {
    background(0);
    if (keyIsDown(RIGHT_ARROW)) {
        ship.angle += 0.1;
    }
    if (keyIsDown(LEFT_ARROW)) {
        ship.angle -= 0.1;
    }
    if (keyIsDown(UP_ARROW)) {
        let thrust = p5.Vector.fromAngle(ship.angle);
        thrust.normalize();
        thrust.div(10);
        ship.applyForce(thrust);
    } 

    ship.update();
    ship.draw();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    ship = new Spaceship(width/2, height/2);
}

let Spaceship = function(x, y) {
    this.position      = createVector(x, y);
    this.velocity      = createVector(0, 0);
    this.acceleration  = createVector(0, 0);
    this.angle         = -PI/2;

    this.update = function() {
        this.velocity.add(this.acceleration);
        if (this.velocity.mag() < 0) this.velocity.mult(0);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }

    this.draw = function() {
        stroke(0);
        fill(255, 150);
        push();
        translate(this.position.x, this.position.y);
        rotate(this.angle);
        triangle(20, 0, -20, 20, -20, -20);
        if (keyIsDown(UP_ARROW)) {
            noStroke();
            fill('red');
            rect(-25, 10, 5, 5);
            rect(-25, -15, 5, 5);
        }
        pop();
    }

    this.applyForce = function(force) {
        this.acceleration.add(force);
    }
}

function keyPressed() {
    if (keyCode === UP_ARROW) {
        let thrust = p5.Vector.fromAngle(ship.angle);
        thrust.mult(2);
        ship.applyForce(thrust);
    } else if (keyCode === DOWN_ARROW) {
        // let thrust = p5.Vector.fromAngle(ship.velocity.heading());
        // thrust.mult(-2);
        // ship.applyForce(thrust);
        ship.velocity.mult(0);
            
    }
}
