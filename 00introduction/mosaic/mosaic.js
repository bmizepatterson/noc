let z = 50000, w = 10;

function setup() {
    // createCanvas(100,100);
    createCanvas(windowWidth, windowHeight);
    w = width/100;
    
    // Uniform Random Noise
    // uniformRandom();

    // frameRate(10);
    noStroke();


}

function draw() {
    // Perlin Random Noise
    let xoff = 0;
    for (let x = 0; x < width; x += w) {
        let yoff = 1000;
        for (let y = 0; y < height; y += w) {
            fill(noise(xoff,yoff,z) * 255);
            rect(x, y, w, w);
            yoff += 0.01;
        }
        xoff += 0.01;
    }
    z += 0.001;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function uniformRandom() {
    let d = pixelDensity();
    let image = 4 * (width * d) * (height * d);
    for (let i = 0; i < image; i += 4) {
        let bright = random(256);
        pixels[i]     = bright;
        pixels[i + 1] = bright;
        pixels[i + 2] = bright;
        pixels[i + 3] = bright;
    }
}

function perlinRandom(zoff) {
    let xoff = 0, d = pixelDensity();
    loadPixels();
    noiseDetail(4, 0.5);
    for (let x = 0; x < width; x++) {
        let yoff = 1000;
        for (let y = 0; y < height; y++) {
            let bright = map(noise(xoff,yoff,zoff),0,1,0,255);
            for (let i = 0; i < d; i++) {
                for (let j = 0; j < d; j++) {
                    let idx = 4 * ((y * d + j) * width * d + (x * d + i));
                    pixels[idx] = bright;
                    pixels[idx+1] = bright;
                    pixels[idx+2] = bright;
                    pixels[idx+3] = bright;
                }
            }
            yoff += 0.1;
        }
        xoff += 0.1;
    }
    updatePixels();
}
