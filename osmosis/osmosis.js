let particles = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();
    for (let i = 0; i < 10; i++) {
        let col = color(random(255), random(255), random(255), 100);
        particles[i] = new Particle(i, 30, col);
    }
}

function draw() {
    clear();
    particles.forEach(particle => {
        particle.place(particles);
        // particle.update();
        // particle.checkCollisions();
        // particle.checkEdges();
        particle.display();
    });
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

let Particle = function(id, radius, color) {
    this.position = createVector(random() * width, random() * height);
    this.velocity = createVector(0,0); //createVector(random(5), random(5));
    this.r = radius;
    this.color = color;
    this.id = id;
    this.hit = true;

    this.place = function (objArray) {

        for (i = 0; i < objArray.length; i++) {
            if (this.id != i) { //dont do the check if it is looking at itself

                this.hit = collideCircleCircle(this.position.x, this.position.y, this.r, objArray[i].position.x, objArray[i].position.y, objArray[i].r);

                if (this.hit) { // if we ever get a true we have to try again, this works since we iterate down through the objects one by one.
                    //try again:
                    this.position = createVector(random(width), random(height));
                }
            }
        }
    }

    this.update = function() {
        this.position.add(this.velocity);
    }

    this.checkCollisions = function() {
        particles.forEach(p => {
            // if (p5.Vector.sub(p.position, this.position).mag() <= p.r + this.r) {
            //     this.velocity.mult(-1);
            //     p.velocity.mult(-1);
            // }
            const hit = collideCircleCircle(p.position.x, p.position.y, p.r, this.position.x, this.position.y, this.r);
            if (hit) {
                this.velocity.mult(-1);
                p.velocity.mult(-1);
            }
        })
    }

    this.checkEdges = function() {
        // Bounce off the top edge
        if (this.position.y < this.r) {
            this.velocity.y *= -1;
            this.position.y = this.r;
        }
        // Bounce off the bottom edge
        if (this.position.y > (height - this.r)) {
            this.velocity.y *= -1;
            this.position.y = height - this.r;
        }
        // Bounce of the right edge
        if (this.position.x > (width - this.r)) {
            this.velocity.x *= -1;
            this.position.x = width - this.r;
        }
        // Bounce off the left edge
        if (this.position.x < this.r) {
            this.velocity.x *= -1;
            this.position.x = this.r;
        }
    }

    this.display = function () {
        fill(this.color);
        ellipse(this.position.x, this.position.y, 2 * this.r, 2 * this.r);
    }
}

function getParticleCount() {
    return this.particles.length;
}
