const DIR_RANDOM = 1,
      DIR_MOUSE  = 2,
      METHOD_RANDOM = 10,
      METHOD_GAUSSIAN = 20,
      METHOD_MONTECARLO = 30,
      METHOD_PERLIN = 40;
let w,
    tx = 0,
    ty = 10000;

function setup() {
    createCanvas(windowWidth, windowHeight);
    w = new Walker;
}

function draw() {
    stroke(255);
    line(w.prevX, w.prevY, w.x, w.y);

    w.step(METHOD_MONTECARLO, DIR_MOUSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function Walker(x = width/2, y = height/2) {
    this.x = x;
    this.y = y;
    this.prevX = x;
    this.prevY = y;

    this.step = function(method = METHOD_RANDOM, direction = DIR_RANDOM, vel = 1) {
        this.prevX = this.x;
        this.prevY = this.y;
        this.t = 0;

        let r;
        switch (method) {
            case METHOD_GAUSSIAN:
                r = randomGaussian(0.5);
                break;
            case METHOD_PERLIN:
                vel = this.perlin(this.t, 0, 50);
                this.t += 0.01;
                r = random();
                break;
            case METHOD_MONTECARLO:
                vel = this.montecarlo(0, 20);
                // No break
            case METHOD_RANDOM:
                r = random();            
        }

        switch (direction) {
            case DIR_MOUSE:
                if (r < 0.5) {
                    if (mouseX > this.x) this.x += vel;
                    else this.x -= vel;
                    if (mouseY > this.y) this.y += vel;
                    else this.y -= vel;
                } else {
                    this.x += random(-vel, vel);
                    this.y += random(-vel, vel);
                }
                break;
            case DIR_RANDOM:
                this.x += random(-vel, vel);
                this.y += random(-vel, vel);
        }
    }


    this.montecarlo = function(min = 0, max = 1) {
        while (true) {
            let r1 = random(min, max);
            let probability = r1;
            let r2 = random(min, max);
            if (r2 < probability) {
                return r1;
            }
        }
    }

    this.perlin = function(t, min = 0, max = 1) {
        return map(noise(t), min, max, 0, height);
    }
}
