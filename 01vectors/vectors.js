let center, mouse_v, off = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    center = createVector(width/2, height/2);
}

function draw() {
    clear();
    let x = mouseX ? mouseX : width/2;
    let y = mouseY ? mouseY : height/2;
    mouse_v = createVector(x, y);
    mouse_v.sub(center);
    mouse_v.mult(noise(off) * 2);

    let mag = mouse_v.mag();
    fill(255);
    rect(0,0,mag,10);

    translate(center);
    stroke(255);
    line(0,0,mouse_v.x, mouse_v.y);
    off += 0.05;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  center = createVector(width/2, height/2);
}
