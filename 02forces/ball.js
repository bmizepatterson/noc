let balls = [], pockets = [], liquid;

function setup() {
    createCanvas(windowWidth, windowHeight);
    for (let i = 0; i < 20; i++) {
        let mass = random(1, 5);
        let col = color(random(255), random(255), random(255), 100);
        balls[i] = new Ball(mass, col, i * width/20, random(400));
    }

    // Pockets of friction
    let pocketNumber = 0;
    for (let j = 0; j < pocketNumber; j++) {
        let w = random(100,300);
        let h = random(100,300);
        pockets[j] = new Pocket(
            random(width - w),
            random(height - h),
            w,
            h,
            random(0.01, 0.5)
        );
    }

    // Liquid
    liquid = new Liquid(0, height/2, width, height/2, 0.1);
}

function draw() {
    clear();

    liquid.draw();

    for (let pocket of pockets) {
        pocket.draw();
    }

    for (let b of balls) {
        let gravity = createVector(0, 0.1 * b.mass);
        b.applyForce(gravity);
        // Wind
        // let wind = createVector(0.01, 0);
        // b.applyForce(wind);

        // Left and right edge forces
        // if (b.position.x < b.r*2) {
        //     b.applyForce(createVector(1,0));
        // }
        // if (b.position.x > width - b.r*2) {
        //     b.applyForce(createVector(-1,0));
        // }

        // Regular friction
        let c = 0.01;   // coefficient of friction
        let friction = b.velocity.copy();
        friction.mult(-1);
        friction.normalize();
        friction.mult(c);
        b.applyForce(friction);

        // Pockets of friction
        for (let p of pockets) {
            // If ball is in the pocket 
            if (b.isInside(p)) {
                // Add more friction
                b.applyForce(p.getFriction(b.velocity));
            }
        }

        // Liquid
        if (b.isInside(liquid)) b.drag(liquid);

        b.update();
        b.checkEdges();
        b.display();
    }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

let Ball = function(mass, color, x, y) {
    this.position     = createVector(x, y);
    this.velocity     = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.bounce       = random(-0.9, -0.5);
    this.mass         = mass;
    this.r            = mass*16
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
        ellipse(this.position.x, this.position.y, this.r*2, this.r*2);
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

    this.isInside = function(rect) {
        // works for any object with position vector and width/height properties
        return (this.position.x + this.r > rect.position.x && 
                this.position.x - this.r < rect.position.x + rect.width &&
                this.position.y + this.r > rect.position.y &&
                this.position.y - this.r < rect.position.y + rect.height);
    }

    this.drag = function(liquid) {
        // calculates and applies the drag against a liquid object
        if (liquid instanceof Liquid) {
            let speed = this.velocity.mag();
            let dragMag = liquid.friction * speed * speed;
            let drag = this.velocity.copy();
            drag.mult(-1);
            drag.normalize();
            drag.mult(dragMag);
            this.applyForce(drag);
        }
    }
}

let Pocket = function(x, y, w, h, friction) {
    this.position = createVector(x, y);
    this.width = w;
    this.height = h;
    this.friction = friction;
    this.color = color((1-friction) * 255);

    this.draw = function() {
        noStroke();
        fill(this.color);
        rect(this.position.x, this.position.y, this.width, this.height);
    }

    this.getFriction = function(velocity) {
        let friction = velocity.copy();
        friction.mult(-1);
        friction.normalize();
        return friction.mult(this.friction);
    }
}

let Liquid = function(x, y, w, h, friction) {
    this.position = createVector(x, y);
    this.width = w;
    this.height = h;
    this.friction = friction;

    this.draw = function() {
        noStroke();
        fill(175);
        rect(this.position.x, this.position.y, this.width, this.height);
    }
}
