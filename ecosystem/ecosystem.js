let tanks = [], hookpng;

function preload() {
    hookpng = loadImage('hook.png');    
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    // Create one tank this size of the window
    let tank = new Tank(0, 0, width, height, color(50, 126, 206));
    // Create fish
    let total = random(10, 30);
    for (let i = 0; i < total; i++) {
        let size = createVector(50, 25);
        size.mult(random(0.5, 2));
        tank.addFish(size.x, size.y);
    }    
    tanks.push(tank);
}

function draw() {
    clear();
    for (let tank of tanks) {
        // First draw the tank, since it goes behind everything else.
        tank.draw();
        // We're going to iterate over all the fish and hooks in this tank.
        let items = tank.fish.concat(tank.hooks);
        // Order items according to zIndex property
        items.sort((a,b) => {
            if (a.zIndex == undefined || b.zIndex == undefined) return 0;
            return a.zIndex - b.zIndex;
        });
        // Now draw each item
        for (let item of items) {
            if (item.processFrame !== undefined) {
                item.processFrame();
            }
        }
        // Randomly create fish hooks
        if (random() < 0.001) {
            let size = random(0.2, 0.8);
            let lineLength = random(100, tank.height-100);
            tank.addHook(size, lineLength);
        }
        tank.updateHooks();
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

let Fish = function(w, h, tank) {
    const LEFT = -1, RIGHT = 1, UP = -10, DOWN = 10;   // Orientations
    this.width        = w;
    this.height       = h;
    // Mass is proportional to area, in arbitrary fashion
    this.mass         = w * h / 100;
    this.tank         = tank;
    this.position     = createVector(random(this.tank.width), random(this.tank.height));
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
    // Draw fish that are farther away darker.
    let lightness     = floor(map(this.zIndex, 0, 1000, 25, 53));
    this.col          = color(`hsl(23, 81%, ${lightness}%)`);

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
        const RIGHT_MIN = 0.1, RIGHT_MAX = 10, LEFT_MIN = -10, LEFT_MAX = -0.1;
        const DOWN_MIN = 0.1, DOWN_MAX = 10, UP_MIN = -10, UP_MAX = -0.1;
        // The buffer is equal to the fish's larger dimension.
        let buffer = this.width > this.height ? this.width : this.height;
        let p, direction = {};

        // HORIZONTAL MOVEMENT
        // Negative values accelerate to the left; positive values to the right.
        p = random();        
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
        // Fish too close to the left/right edge should definintely turn around
        if (this.position.x < buffer) {
            direction.hMin += 100;
            direction.hMax += 100;
        } else if (this.position.x > this.tank.width - buffer) {
            direction.hMax -= 100;
            direction.hMax -= 100;
        }
        
        // VERTICAL MOVEMENT
        // Negative values accelerate up; positive values down.
        p = random();
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
        // Fish too close to the top/bottom edge should definintely turn around
        if (this.position.y < buffer) {
            direction.vMax += 100;
            direction.vMin += 100;
        } else if (this.position.y > this.tank.height - buffer) {
            direction.vMax -= 100;
            direction.vMin -= 100;
        }

        // The more hooks in the tank, the crazier the movement should be.
        let frenzyLevel = this.tank.hooks.length + 1;
        // Speed should be inversely proportional to mass.
        let sizeFactor = 1 / (10 * this.mass);
        for (let property in direction) {
            direction[property] *= frenzyLevel;
            direction[property] *= sizeFactor;
        }
        return direction;
    }

    this.attractMouse = function(x, y) {
        let origin = createVector(x, y);
        let force = p5.Vector.sub(origin, this.position);
        let distance = force.mag();
        force.normalize();
        let strength = 0;
        if (distance < 200) strength = 1000 / (this.mass * distance * 0.5);
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
        
        // Flee fish hooks
        for (let hook of this.tank.hooks) {
            this.applyForce(hook.repelFish(this));
        }

        this.update();
        this.draw();
    }
}

let Hook = function(size, maxLine, tank) {
    // Size should be a factor between 0 and 1 by which to scale the hook image
    this.size         = constrain(size, 0, 1);
    this.width        = 100 * size;
    this.height       = 295 * size;
    this.tank         = tank;
    this.position     = createVector(
        random(this.tank.width - this.width),
        -this.height
    );
    this.prevPosition = this.position.copy();
    this.velocity     = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.maxLine      = constrain(maxLine, this.height, this.tank.height - this.height);
    this.zIndex       = random(1000);
    // Save initial start/end points of the fishing line
    this.lineStart    = createVector(
        this.position.x + (this.width * 0.9),
        this.position.y + 5
    );
    this.lineEnd      = this.lineStart.copy();
    this.ascend       = false;

    this.update = function() {
        this.prevPosition = this.position.copy();
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.lineEnd.add(this.velocity);
        this.acceleration.mult(0);
    }

    this.draw = function() {
        push();
        stroke(100, 100);
        strokeWeight(2);
        line(this.lineStart.x, this.lineStart.y, this.lineEnd.x, this.lineEnd.y);
        image(hookpng, this.position.x, this.position.y, this.width, this.height);
        pop();
    }

    this.checkLength = function() {
        let lineLength = this.lineEnd.copy();
        lineLength.sub(this.lineStart);
        lineLength = lineLength.mag();
        if (lineLength > this.maxLine) {
            this.velocity.y *= -0.2;
            this.position = this.prevPosition.copy();
        }
    }

    this.processFrame = function() {
        // Randomly switch to ascend mode
        if (random() < 0.001) this.ascend = true;
        let force = createVector(0, 0.01);
        if (this.ascend) force.mult(-1);
        this.acceleration = force;
        this.update();
        this.checkLength();
        this.draw();
    }
    
    this.repelFish = function(fish) {
        if (fish instanceof Fish) {
            let force = p5.Vector.sub(fish.position, this.position);
            let distance = force.mag();
            force.normalize();
            let strength = 5000 / (fish.mass * distance);
            force.mult(strength);
            return force;
        }
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

    this.addFish = function(w, h) {
        this.fish.push(new Fish(w, h, this));
    }

    this.addHook = function(size, maxLine) {
        this.hooks.push(new Hook(size, maxLine, this));
    }

    this.updateHooks = function() {
        for (let i = 0; i < this.hooks.length; i++) {
            // If the hook has ascended back up all the way then delete it
            if (this.hooks[i].ascend && this.hooks[i].position.y < -this.hooks[i].height) {
                this.hooks.splice(i, 1);
            }
        }
    }
}
