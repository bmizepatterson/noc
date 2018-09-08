function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();
}

function draw() {
    let x = mouseX ? mouseX : width/2;
    let y = mouseY ? mouseY : height/2;
    x = randomGaussian(x, 20);
    y = randomGaussian(y, 20);
    let d = Math.abs(randomGaussian(10, 5));
    // let e = Math.abs(randomGaussian(0, 5));
    let r = Math.abs(randomGaussian(0, 20));
    let g = Math.abs(randomGaussian(0, 10));
    let b = Math.abs(randomGaussian(255, 50));
    if (b > 255) b = 255;
    let a = randomGaussian(255/2, 20);

    fill(r, g, b, a);
    ellipse(x, y, d, d);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
