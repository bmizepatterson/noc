let particles = [];
const spring = 0.05;
const friction = -0.98;
const numParticles = 200;

function setup() {
    const canvas = createCanvas(500, 500);
    canvas.parent('canvas-wrapper');
    noStroke();

    for (let i = 0; i < numParticles; i++) {
        const col = i < numParticles / 2 ? color(0, 0, 255) : color(255, 0, 0);
        particles[i] = new Particle(i, 5, col);
        particles[i].place(particles);
    }
}

function draw() {
    clear();
    particles.forEach(particle => {
        particle.collide();
        particle.move();
        particle.display();
    });
}

function areColliding(p1, p2) {
    let dx = p1.position.x - p2.position.x;
    let dy = p1.position.y - p2.position.y;
    let distance = sqrt(dx * dx + dy * dy);
    let minDist = p1.r + p2.r;
    return distance < minDist;
}

class Particle {
    constructor(id, radius, color) {
        this.position = createVector(random() * width, random() * height);
        this.velocity = createVector(random(1, 3), random(1, 3));
        this.r = radius;
        this.color = color;
        this.id = id;
    }

    place() {
        // Place all particles so none is on top of another.
        particles.filter(p => p.id !== this.id).forEach(p => {
            let dx = p.position.x - this.position.x;
            let dy = p.position.y - this.position.y;
            let distance = sqrt(dx * dx + dy * dy);
            let minDist = this.r + p.r;
            if (areColliding(this, p)) {
                this.position = createVector(random(width), random(height));
            }
        });
    }

    move() {
        this.position.add(this.velocity);
        // Bounce off the top edge
        if (this.position.y < this.r) {
            this.velocity.y *= friction;
            this.position.y = this.r;
        }
        // Bounce off the bottom edge
        if (this.position.y > (height - this.r)) {
            this.velocity.y *= friction;
            this.position.y = height - this.r;
        }
        // Bounce of the right edge
        if (this.position.x > (width - this.r)) {
            this.velocity.x *= friction;
            this.position.x = width - this.r;
        }
        // Bounce off the left edge
        if (this.position.x < this.r) {
            this.velocity.x *= friction;
            this.position.x = this.r;
        }
    }

    collide() {
        particles.filter(p => p.id !== this.id && areColliding(this, p)).forEach(p => {
            let dx = p.position.x - this.position.x;
            let dy = p.position.y - this.position.y;
            let angle = atan2(dy, dx);
            let targetX = this.position.x + cos(angle) * (this.r + p.r);
            let targetY = this.position.y + sin(angle) * (this.r + p.r);
            let ax = (targetX - p.position.x) * spring;
            let ay = (targetY - p.position.y) * spring;
            let bounce = createVector(ax, ay);
            this.velocity.sub(bounce);
            p.velocity.add(bounce)
        });
    }

    display() {
        fill(this.color);
        ellipse(this.position.x, this.position.y, 2 * this.r, 2 * this.r);
    }
}

