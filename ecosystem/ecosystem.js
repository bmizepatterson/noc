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
    hooks.push(new Hook(100, 100, 100, 295));
}

function draw() {
    background(c_water);

    for (let hook of hooks) {
        hook.draw();
    }

    for (let fish of school) {
        let hMovement = fish.getDirection();
        let wander = createVector(
            map(noise(fish.a), 0, 1, hMovement.min, hMovement.max), 
            map(noise(fish.b), 0, 1, -0.1, 0.1)
        );
        fish.a += random(0.001, 10);
        fish.b += random(0.001, 0.1);
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
    const LEFT        = -1;
    const RIGHT       = 1;
    this.width        = w;
    this.height       = h;
    this.mass         = w * h / 100;
    this.tankHeight   = height;
    this.tankWidth    = width;
    this.position     = createVector(
        this.tankWidth / 2 + random(-200, 200),
        this.tankHeight / 2 + random(-200, 200)
    );
    this.prevPosition = this.position.copy();
    this.velocity     = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.topspeed     = 3;
    this.a            = random(1000);
    this.b            = random(1001, 10000);
    this.orientation  = LEFT;

    this.update = function() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.topspeed);
        this.prevPosition = this.position.copy();
        this.position.add(this.velocity);
        // Determine orientation
        if (this.prevPosition.x < this.position.x) {
            this.orientation = RIGHT;
        } else {
            this.orientation = LEFT;
        }        
    }

    this.draw = function() {
        push();
        noStroke();
        fill(c_fish);
        translate(this.position.x, this.position.y);
        // Get the heading of the velocity vector and rotate toward current direction
        rotate(this.velocity.heading() - PI);
        ellipse(
            0 - this.width * 0.1, 
            0,
            this.width * 0.8, 
            this.height
        );
        triangle(
            0,
            0,
            0 + this.width * 0.5,
            0 - this.height * 0.5,
            0 + this.width * 0.5,
            0 + this.height * 0.5,
        );
        pop();
    }

    this.checkEdges = function() {
        // Bump against the edges of the tank.
        // Calculate edge as a circle around the fish of diameter equal to
        // the fish's larger dimension.
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
        // Negative values accelerate to the left; positive values to the right.
        let p = random();
        // Fish within the left/right buffer will definintely turn around
        let buffer = 100;
        if ((this.position.x < buffer && this.orientation == LEFT) ||
            (this.position.x > this.tankWidth - buffer && this.orientation == RIGHT)) {
            p += 0.5;
        }

        if (p > 0.5) {
            // Return positive range to start moving to the right
            if (this.orientation == LEFT) return {min: 0.01, max: 1};
            // Return negative range to start moving to the left
            else return {min: -1, max: 0};
        } else {
            // Keep going the same direction
            if (this.orientation == LEFT) return {min: -1, max: -0.01};
            else return {min: 0, max: 1};
        }
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

let Hook = function(x, y, w, h) {
    this.position = createVector(x, y);
    this.width = w;
    this.height = h;

    this.draw = function() {
        push();
        image(hookpng, this.position.x, this.position.y, this.width, this.height);
        pop();
    }

}
