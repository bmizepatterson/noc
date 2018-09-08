let tx = 0;
let ty = 10000;

function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();
    fill(0);
}

function draw() {
    clear();
    let x = map(noise(tx), 0, 1, 0, width);
    let y = map(noise(ty), 0, 1, 0, height);
    let d = 20;

    ellipse(x, y, d, d);
    tx += 0.01;
    ty += 0.01;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
