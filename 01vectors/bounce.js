let position, velocity, r = 50;

function setup() {
    createCanvas(windowWidth, windowHeight);
    position = createVector(width/2, height/2);
    velocity = createVector(1, 3.3);
    noStroke();
    fill(255);
}

function draw() {
    clear();
    position.add(velocity);

    if (position.x+r > width || position.x-r < 0) {
        velocity.x *= -1;
    }
    if (position.y+r > height || position.y-r < 0) {
        velocity.y *= -1;
    }

    ellipse(position.x, position.y, 2*r, 2*r);
    // dx *= 1.001;
    // dy *= 1.001;
}
