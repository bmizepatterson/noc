let car, carpng;

function preload() {
    carpng = loadImage('car.png');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    car = new Car(width/2, height/2);
}

function draw() {
    background(255);
    car.update();
    car.draw();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  car = new Car(width/2, height/2);
}

let Car = function(x, y) {
    this.position      = createVector(x, y);
    this.velocity      = createVector(0, 0);
    this.acceleration  = createVector(0, 0);
    this.angle         = 0;

    this.update = function() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.angle = this.velocity.heading();
        this.acceleration.mult(0);
    }

    this.draw = function() {
        stroke(0);
        fill(255, 150);
        imageMode(CENTER);
        push();
        translate(this.position.x, this.position.y);
        rotate(this.angle);
        image(carpng, 0, 0, 100, 50);
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
        this.acceleration.add(force);
    }
}

function keyPressed() {
    let speed = 1;
    if (keyCode === RIGHT_ARROW) {
        car.applyForce(createVector(speed, 0));
    } else if (keyCode === LEFT_ARROW) {
        car.applyForce(createVector(-speed, 0));
    } else if (keyCode === UP_ARROW) {
        car.applyForce(createVector(0, -speed));
    } else if (keyCode == DOWN_ARROW) {
        car.applyForce(createVector(0, speed));
    }
}
