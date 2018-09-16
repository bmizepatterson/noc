let angle = 0, aVelocity = 0.05;

function setup() {
    createCanvas(windowWidth, windowHeight);
    // period = 120;
}

function draw() {
    background(255);
    // let y = cos(TWO_PI * frameCount / period);
    let y = cos(angle);
    y = map(y, -1, 1, 100, height-100);

    fill(0);
    stroke(0);
    strokeWeight(3);
    translate(width/2, 0);
    line(0, 0, 0, y);
    ellipse(0,y,100,100);

    angle += aVelocity;

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
