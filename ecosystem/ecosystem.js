let school = [], c_water, c_fish, hooks = [], hookpng;

function preload() {
    hookpng = loadImage('hook.png');    
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    c_water = color(50, 126, 206);
    c_fish  = color(232, 109, 31);
    let total = 10; //random(5,15);
    for (let i = 0; i < total; i++) {
        school[i] = new Fish(50, 25);
    }
    hooks.push(new Hook(100, 100, 0.5));
}

function draw() {
    background(c_water);

    for (let hook of hooks) {
        hook.draw();
    }

    for (let fish of school) {
        let dir = fish.getDirection();
        let wander = createVector(
            map(noise(fish.a), 0, 1, dir.hMin, dir.hMax), 
            map(noise(fish.b), 0, 1, dir.vMin, dir.vMax)
        );
        fish.a += random(0.001, 10);
        fish.b += random(0.001, 10);
        fish.applyForce(wander);

        // Attract toward mouse
        if (mouseX && mouseY) {
            fish.applyForce(fish.attractMouse(mouseX, mouseY));
        }

        fish.update();
        fish.checkEdges();
        fish.draw();
    }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

let Fish = function(w, h) {
    const LEFT = -1, RIGHT = 1, UP = -10, DOWN = 10;   // Orientations
    this.width        = w;
    this.height       = h;
    this.mass         = w * h / 100;    // Mass is proportional to area, in arbitrary fashion
    this.tankHeight   = height;
    this.tankWidth    = width;
    // Fish start somewhere in the middle of the tank
    this.position     = createVector(
        this.tankWidth / 2 + random(-200, 200),
        this.tankHeight / 2 + random(-200, 200)
    );
    this.prevPosition = this.position.copy();
    this.velocity     = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.topspeed     = 5;
    this.a            = random(1000);
    this.b            = random(1001, 10000);
    // The orientation property is an object with two properties:
    // h = LEFT|RIGHT
    // v = UP|DOWN
    this.orientation  = {h: LEFT, v: UP};

    this.update = function() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.topspeed);
        this.prevPosition = this.position.copy();
        this.position.add(this.velocity);

        // Update orientation
        // If heading is perfectly horizontal/vertical then the orientation doesn't change.
        let heading = this.velocity.heading();
        if (heading > 0 && heading < HALF_PI || heading < 0 && heading > -HALF_PI) this.orientation.h = RIGHT;
        if (heading > 0 && heading > HALF_PI || heading < 0 && heading < -HALF_PI) this.orientation.h = LEFT;
        if (heading > 0) this.orientation.v = DOWN;
        if (heading < 0) this.orientation.v = UP;
    }

    this.draw = function() {
        push();
        noStroke();
        fill(c_fish);
        translate(this.position.x, this.position.y);
        // Fish is drawn facing left by default. Get the heading of the velocity 
        // vector and rotate toward current direction.
        rotate(this.velocity.heading() - PI);
        ellipse(0 - this.width * 0.1, 0, this.width * 0.8, this.height);
        triangle(0, 0, 0 + this.width * 0.5, 0 - this.height * 0.5, 0 + this.width * 0.5, 0 + this.height * 0.5);
        pop();
    }

    this.checkEdges = function() {
        // Bump against the edges of the tank.
        // Calculate edge of fish as a circle around the fish of diameter equal to the fish's larger dimension.
        let radius = this.width > this.height ? this.width / 2 : this.height / 2;
        let right  = this.position.x + radius;
        let left   = this.position.x - radius;
        let bottom = this.position.y + radius;
        let top    = this.position.y - radius;

        if (right > this.tankWidth) this.position.x = this.prevPosition.x;
        else if (left < 0) this.position.x = this.prevPosition.x;
     
        if (bottom > this.tankHeight) this.position.y = this.prevPosition.y;
        else if (top < 0) this.position.y = this.prevPosition.y;
    }

    this.applyForce = function(force) {
        if (force instanceof p5.Vector) {
            f = force.copy();
            // acceleration = force / mass
            f.div(this.mass);
            this.acceleration.add(f);
        }
    }

    this.getDirection = function() {
        // Return a range of values on which to map Perlin noise.
        let p, buffer, direction = {};
        const RIGHT_MIN = 0, RIGHT_MAX = 10, LEFT_MIN = -10, LEFT_MAX = 0;
        const DOWN_MIN = 0, DOWN_MAX = 10, UP_MIN = -10, UP_MAX = 0;

        // HORIZONTAL MOVEMENT
        // Negative values accelerate to the left; positive values to the right.
        p = random();
        // Fish within the left/right buffer will definintely turn around
        buffer = 50;
        if ((this.position.x < buffer && this.orientation.h == LEFT) ||
            (this.position.x > this.tankWidth - buffer && this.orientation.h == RIGHT)) {
            p += 0.5;
        }
        if (p > 0.5) {
            if (this.orientation.h == LEFT) {
                // Set a positive range to start moving to the right
                direction.hMin = RIGHT_MIN;
                direction.hMax = RIGHT_MAX;
            } else {
                // Set a negative range to start moving to the left
                direction.hMin = LEFT_MIN;
                direction.hMax = LEFT_MAX;
            }
        } else {
            // Keep going the same direction
            if (this.orientation.h == LEFT) {
                direction.hMin = LEFT_MIN;
                direction.hMax = LEFT_MAX;
            } else {
                direction.hMin = RIGHT_MIN;
                direction.hMax = RIGHT_MAX;
            }
        }
        
        // VERTICAL MOVEMENT
        // Negative values accelerate up; positive values down.
        p = random();
        // Fish within the top/bottom buffer will definintely turn around
        buffer = 50;
        if ((this.position.y < buffer && this.orientation.v == UP) ||
            (this.position.y > this.tankHeight - buffer && this.orientation.v == DOWN)) {
            p += 0.5;
        }
        if (p > 0.5) {
            if (this.orientation.v == DOWN) {
                // Start moving up
                direction.vMin = UP_MIN;
                direction.vMax = UP_MAX;
            } else {
                // Start moving down
                direction.vMin = DOWN_MIN;
                direction.vMax = DOWN_MAX;
            }
        } else {
            // Keep going the same direction
            if (this.orientation.v == DOWN) {
                direction.vMin = DOWN_MIN;
                direction.vMax = DOWN_MAX;
            } else {
                direction.vMin = UP_MIN;
                direction.vMax = UP_MAX;
            }
        }
        return direction;
    }

    this.attractMouse = function(x, y) {
        let origin = createVector(x, y);
        let force = p5.Vector.sub(origin, this.position);
        let distance = force.mag();
        force.normalize();
        let strength = 0;
        if (distance < 200) strength = 100 / (distance * 0.5);
        force.mult(strength);
        return force;
    }
}

let Hook = function(x, y, size) {
    // Size should be a factor between 0 and 1 by which to scale the hook image
    const maxW = 100, maxH = 295;
    this.position = createVector(x, y);
    this.size = constrain(size, 0, 1);
    this.width = maxW * size;
    this.height = maxH * size;

    this.draw = function() {
        push();
        stroke(75);
        strokeWeight(2);
        line(this.position.x + (this.width * 0.9), this.position.y+5, this.position.x + (this.width*0.9), 0);
        image(hookpng, this.position.x, this.position.y, this.width, this.height);
        pop();
    }
}
