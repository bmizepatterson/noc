let balloons = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    for (let i = 0; i < 10; i++) {
        let radius = random(15, 40);
        let col = color(random(255), random(255), random(255), 100);
        balloons[i] = new Ball(radius, col);
    }
}

function draw() {
    clear();

    for (let b of balloons) {
        // Calculate lift - affects all balloons equally
        let lift = createVector(0, -0.5);
        b.applyForce(lift);

        // Calculate wind - depends on radius (i.e. surface area) of balloon
        // Wind comes from the left and from the top. Vertical component may
        // sometimes be stronger than lift.
        let wind = createVector(
            map(noise(b.xoff), 0, 1, -1, 1), 
            map(noise(b.yoff), 0, 1, 0, 1)
        );
        wind.mult(b.r * 0.01);
        b.xoff += 0.01;
        b.yoff += 0.01;
        b.applyForce(wind);

        b.update();
        b.checkEdges();
        b.display();
    }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

let Ball = function(radius, color) {
    this.position     = createVector(randomGaussian(width/2, width/4), height);
    this.velocity     = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.bounce       = random(-0.5, -0.3);
    this.r            = radius;
    this.color        = color;
    this.xoff         = 0;
    this.yoff         = 1000;

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
        ellipse(this.position.x, this.position.y, 2*this.r, 2*this.r);
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
            this.acceleration.add(force);
        }
    }
}
