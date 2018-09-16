let angle = 0,
    aVelocity = 0.01,
    amplitude = 100;

function setup() {
    createCanvas(windowWidth, windowHeight);
    // frameRate(7);
}

function draw() {
    background(0);
    noFill();
    stroke(255);
    strokeWeight(2);
    // translate(0, height/2);
    beginShape();
    for (let x = 0; x <= width; x += 5) {
        // let y = amplitude * sin(angle);
        // let y = map(noise(angle), 0, 1, 0, height);
        let y = map(sin(angle), -1, 1, 0, height);
        vertex(x, y);
        angle += aVelocity;
    }
    endShape();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
