let tanks = [], hookpng;

function preload() {
    hookpng = loadImage('hook.png');    
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    // Create one tank this size of the window
    let tank = new Tank(0, 0, width, height, color(50, 126, 206));
    // Create fish
    let total = 10;
    for (let i = 0; i < total; i++) {
        tank.add(new Fish(50, 25, color(232, 109, 31), tank));
    }
    // Create hooks
    tank.add(new Hook(100, 100, 0.5, random(100, tank.height-100), tank));
    tanks.push(tank);
}

function draw() {
    clear();

    for (let tank of tanks) {
        // First draw the tank, since it goes behind everything else.
        tank.draw();
        // We're going to iterate over all the fish and hooks in this tank.
        let items = tank.fish.concat(tank.hooks);
        // Order items according to zIndex property (largest to smallest)
        items.sort((a,b) => {
            if (a.zIndex == undefined || b.zIndex == undefined) return 0;
            return b.zIndex - a.zIndex;
        });
        // Now draw each item
        for (let item of items) {
            if (item.processFrame !== undefined) {
                item.processFrame();
            }
        }
    }
}

function windowResized() {
    let oldW = width, oldH = height;
    resizeCanvas(windowWidth, windowHeight);
    // Update any tanks that were set to the window height/width
    for (let tank of tanks) {
        if (tank.width = oldW) tank.width = width;
        if (tank.height = oldH) tank.height = height;
    }
}

let Fish = function(w, h, color, tank) {
    const LEFT = -1, RIGHT = 1, UP = -10, DOWN = 10;   // Orientations
    this.width        = w;
    this.height       = h;
    // Mass is proportional to area, in arbitrary fashion
    this.mass         = w * h / 100;
    this.col          = color;
    this.tank         = tank;
    // Fish start somewhere in the middle of the tank
    this.position     = createVector(
        this.tank.width / 2 + random(-200, 200),
        this.tank.height / 2 + random(-200, 200)
    );
    this.velocity     = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.topspeed     = 5;
    this.a            = random(1000);
    this.b            = random(1001, 10000);
    // The orientation property is an object with two properties:
    // h = LEFT|RIGHT
    // v = UP|DOWN
    this.orientation  = {h: LEFT, v: UP};
    this.zIndex       = random(1000);

    this.update = function() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.topspeed);
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
        fill(this.col);
        translate(this.position.x, this.position.y);
        // Fish is drawn facing left by default. Get the heading of the velocity 
        // vector and rotate toward current direction.
        rotate(this.velocity.heading() - PI);
        ellipse(0 - this.width * 0.1, 0, this.width * 0.8, this.height);
        triangle(0, 0, 0 + this.width * 0.5, 0 - this.height * 0.5, 0 + this.width * 0.5, 0 + this.height * 0.5);
        pop();
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
        const RIGHT_MIN = 0, RIGHT_MAX = 10, LEFT_MIN = -10, LEFT_MAX = 0;
        const DOWN_MIN = 0, DOWN_MAX = 10, UP_MIN = -10, UP_MAX = 0;
        // The buffer is equal to the fish's larger dimension.
        let buffer = this.width > this.height ? this.width : this.height;
        let p, direction = {};

        // HORIZONTAL MOVEMENT
        // Negative values accelerate to the left; positive values to the right.
        p = random();
        // Fish too close to the left/right edge will definintely turn around
        if ((this.position.x < buffer && this.orientation.h == LEFT) ||
            (this.position.x > this.tank.width - buffer && this.orientation.h == RIGHT)) {
            p++;
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
        // Fish too close to the top/bottom edge will definintely turn around
        if ((this.position.y < buffer && this.orientation.v == UP) ||
            (this.position.y > this.tank.height - buffer && this.orientation.v == DOWN)) {
            p++;
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

    this.processFrame = function() {
        let dir = this.getDirection();
        let wander = createVector(
            map(noise(this.a), 0, 1, dir.hMin, dir.hMax),
            map(noise(this.b), 0, 1, dir.vMin, dir.vMax)
        );
        this.a += random(0.001, 10);
        this.b += random(0.001, 10);
        this.applyForce(wander);

        // Attract toward mouse
        if (mouseX && mouseY) {
            this.applyForce(this.attractMouse(mouseX, mouseY));
        }

        this.update();
        this.draw();
    }
}

let Hook = function(x, y, size, lineLength, tank) {
    // Size should be a factor between 0 and 1 by which to scale the hook image
    this.size         = constrain(size, 0, 1);
    this.width        = 100 * size;
    this.height       = 295 * size;
    this.tank         = tank;
    this.position     = createVector(
        random(this.tank.width - this.width),
        -this.height
    );
    this.velocity     = createVector(0, 1);
    this.acceleration = createVector(0, 0);
    this.lineLength   = lineLength;
    this.zIndex       = random(1000);

    this.update = function() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.position.y = constrain(this.position.y, -this.height, this.lineLength);
        this.acceleration.mult(0);
    }

    this.draw = function() {
        push();
        stroke(100, 100);
        strokeWeight(2);
        line(this.position.x + (this.width * 0.9), this.position.y+5, this.position.x + (this.width*0.9), 0);
        image(hookpng, this.position.x, this.position.y, this.width, this.height);
        pop();
    }

    this.applyForce = function(force) {
        if (force instanceof p5.Vector) {
            f = force.copy();
            // Not gonna bother with mass of hook
            this.acceleration.add(f);
        }
    }

    this.processFrame = function() {
        this.update();
        this.draw();
    }
}

let Tank = function(x, y, w, h, color) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.col = color;
    this.fish = [];
    this.hooks = [];

    this.draw = function() {
        push();
        noStroke();
        fill(this.col);
        rect(this.x, this.y, this.width, this.height);
        pop();
    }

    this.add = function(thing) {
        if (thing instanceof Fish) {
            this.fish.push(thing);
        } else if (thing instanceof Hook) {
            this.hooks.push(thing);
        } else {
            console.log('Cannot add ', thing, ' to tank.');
        }
    }
}
