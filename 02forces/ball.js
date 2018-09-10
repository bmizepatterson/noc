let balls = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    for (let i = 0; i < 10; i++) {
        let radius = random(15, 40);
        let col = color(random(255), random(255), random(255), 100);
        balls[i] = new Ball(radius, col);
    }
}

function draw() {
    clear();

    for (let b of balls) {
        // Calculate gravity proportional to ball radius
        let gravity = createVector(0, 10);
        b.applyForce(gravity);
        let wind = createVector(1, 0);
        b.applyForce(wind);
        b.update();
        b.checkEdges();
        b.display();
    }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

let Ball = function(mass, color) {
    this.position     = createVector(randomGaussian(width/2, width/4), 0);
    this.velocity     = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.bounce       = random(-0.9, -0.5);
    this.mass         = mass;
    this.r            = mass/2;
    this.color        = color;

    this.update = function() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.topspeed);
        this.position.add(this.velocity);
        // We have to reset acceleration after each frame
        this.acceleration.mult(0);
    }

    this.display = function() {
        stroke(0);
        strokeWeight(2);
        fill(this.color);
        ellipse(this.position.x, this.position.y, this.mass, this.mass);
    }

    this.checkEdges = function() {
        // Bounce off the top edge
        if (this.position.y < this.r + 1) {
            // A little bounce
            this.velocity.y *= this.bounce;
            this.position.y = this.r + 1;
        }
        // Bounce off the bottom edge
        if (this.position.y > (height - this.r)) {
            this.velocity.y *= this.bounce;
            this.position.y = height - this.r;
        }
        // Bounce of the right edge
        if (this.position.x > (width - this.r)) {
            this.velocity.x *= this.bounce;
            this.position.x = width - this.r;
        }
        // Bounce off the left edge
        if (this.position.x < this.r) {
            this.velocity.x *= this.bounce;
            this.position.x = this.r;
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
}
