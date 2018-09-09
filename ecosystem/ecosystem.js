let school = [], c_water, c_fish;

function setup() {
    createCanvas(windowWidth, windowHeight);
    c_water = color(50, 126, 206);
    c_fish  = color(232, 109, 31);
    let total = 1; //random(5,15);
    for (let i = 0; i < total; i++) {
        school[i] = new Fish(50, 25);
    }
}

function draw() {
    background(c_water);
    for (let fish of school) {
        fish.update();
        fish.checkEdges();
        fish.draw();
    }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

let Fish = function(w, h) {
    const LEFT = -1;
    const RIGHT = 1;
    this.width = w;
    this.height = h;
    this.tankHeight = height;
    this.tankWidth = width;
    this.location = createVector(this.tankWidth/2, this.tankHeight/2);
    this.prevLocation = this.location;
    this.velocity = createVector(0, 0);
    this.acceleration;
    this.topspeed = 3;
    this.a = 0;
    this.b = 10000;
    this.orientation;

    this.update = function() {
        this.prevLocation = createVector(this.location.x, this.location.y);
        // Perlin noise acceleration
        // X-axis motion should be much greater than y-axis motion

        this.acceleration = this.getAcceleration();
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.topspeed);
        this.location.add(this.velocity);

        // Determine orientation
        if (this.prevLocation.x < this.location.x) {
            this.orientation = RIGHT;
        } else {
            this.orientation = LEFT;
        }
        this.a += 0.01;
        this.b += 0.01;
    }

    this.getAcceleration = function() {
        // Make copies of the velocity and position vectors for testing
        let v = createVector(this.velocity.x, this.velocity.y);
        let p = createVector(this.location.y, this.location.y);
        let i = 0;
        // fix this
        while (true) {
            let candidate = createVector(
                map(noise(this.a), 0, 1, -1, 1), 
                map(noise(this.b), 0, 1, -0.1, 0.1)
            );
            v.add(candidate);
            p.add(v);
            // Calculate the distance from the center horizontal that this 
            // candidate vector would result in scored on on a scale of 0 - 1 
            // (1 is edge of screen; 0 is on the center horizontal).
            let yDist = Math.abs(this.tankHeight/2 - p.y) / 100;
            console.log('yDist: ', yDist);
            let r = random();
            // The lower the yDist score, the higher the chance of this vector
            // being returned.
            if (r > yDist) {
                return candidate;
            }
            return candidate;
        }

    }

    this.draw = function() {
        noStroke();
        fill(c_fish);
        translate(this.location.x, this.location.y);
        if (this.orientation == RIGHT) {
            rotate(PI);
        }
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
    }

    this.checkEdges = function() {
        if (this.location.x + this.width/2 > this.tankWidth) {
          this.location.x = this.prevLocation.x;
        } else if (this.location.x - this.width/2 < 0) {
          this.location.x = this.prevLocation.x;
        }
     
        if (this.location.y + this.height/2 > this.tankHeight) {
          this.location.y = this.prevLocation.y;
        } else if (this.location.y - this.height/2 < 0) {
          this.location.y = this.prevLocation.y;
        }
    }
}
