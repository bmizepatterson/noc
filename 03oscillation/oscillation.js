let oscilators = [], a = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    for (i = 0; i < 10; i++) {
        oscilators.push(new Oscillator());        
    }
}

function draw() {
    background(0);
    // wind
    let wind = createVector(noise(a), 0);
    wind.div(10000);
    a += 0.001;
    for (let o of oscilators) {
        o.applyForce(wind);
        o.oscillate();
        o.draw();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

let Oscillator = function() {
    this.angle = createVector(0, 0);
    this.acceleration = createVector(0,0);
    this.velocity = createVector(random(-0.05,0.05),random(-0.05,0.05));
    this.amplitude = createVector(random(20, width/4), height/2 - 8);

    this.oscillate = function() {
        this.velocity.add(this.acceleration);
        this.angle.add(this.velocity);
        this.acceleration.mult(0);
    }

    this.draw = function() {
        let x = sin(this.angle.x) * this.amplitude.x;
        let y = sin(this.angle.y) * this.amplitude.y;
        y = map(y, -this.amplitude.y, this.amplitude.y, height/2 - 50, this.amplitude.y);
        push();
        translate(width/2, height/2);
        stroke(255);
        fill(255);
        line(0,0,x,y);
        ellipse(x,y,16,16);
        pop();
    }

    this.applyForce = function(force) {
        this.acceleration.add(force);
    }
}
