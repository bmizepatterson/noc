let angle = 0, aVelocity = 0, aAcceleration = 0.001;

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    clear();
    translate(width/2, height/2);
    rotate(angle);
    stroke(255);
    fill(255);
    line(-100, -100, 100, 100);
    ellipse(-100, -100, 20, 20);
    ellipse(100, 100, 20, 20);

    aVelocity += aAcceleration;
    angle += aVelocity;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
