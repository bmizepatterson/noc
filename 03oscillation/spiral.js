let r = 0, theta = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);
}

function draw() {
    let x = r * cos(theta);
    let y = r * sin(theta);

    noStroke();
    fill(0);
    translate(width/2, height/2);
    ellipse(x, y, 16, 16);
    theta += 0.01;
    r += 0.5;

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
