let position, velocity, r = 50;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    position = createVector(0, 0, 0);
    velocity = createVector(0,0, -0.5);
}

function draw() {
    clear();
    position.add(velocity);

    // if (position.x+r > width || position.x-r < 0) {
    //     velocity.x *= -1;
    // }
    // if (position.y+r > height || position.y-r < 0) {
    //     velocity.y *= -1;
    // }
    // if (position.z+r > 100 || position.z-r < 0) {
    //     velocity.z *= -1;
    // }
    stroke(255);
    noFill();
    translate(position);
    rotate(5+position.z);
    sphere(r);
    // dx *= 1.001;
    // dy *= 1.001;
}
