let school = [], c_water, c_fish;

function setup() {
    createCanvas(windowWidth, windowHeight);
    c_water = color(50, 126, 206);
    c_fish  = color(232, 109, 31);
    let total = 10; //random(5,15);
    for (let i = 0; i < total; i++) {
        school[i] = new Fish(50, 25);
    }
}

function draw() {
    background(c_water);
    for (let fish of school) {
        let wander = createVector(
            map(noise(fish.a), 0, 1, -1, 1), 
            map(noise(fish.b), 0, 1, -0.1, 0.1)
        );
        fish.a += 0.01;
        fish.b += 0.01;
        fish.applyForce(wander);

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
        if (this.orientation == RIGHT) rotate(PI);
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
        if (this.position.x + this.width/2 > this.tankWidth) {
          this.position.x = this.prevPosition.x;
        } else if (this.position.x - this.width/2 < 0) {
          this.position.x = this.prevPosition.x;
        }
     
        if (this.position.y + this.height/2 > this.tankHeight) {
          this.position.y = this.prevPosition.y;
        } else if (this.position.y - this.height/2 < 0) {
          this.position.y = this.prevPosition.y;
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
