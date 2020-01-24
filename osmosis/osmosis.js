let particles = [];
const app = {
    active: false,
    settings: {
        population: {
            value: 200,
            control: null,
            type: 'number'
        },
        spring: {
            value: 0.05,
            control: null,
            type: 'number'
        },
        friction: {
            value: -0.98,
            control: null,
            type: 'number'
        },
        placement: {
            value: 'random',
            control: null,
            type: 'radio'
        }
    },
    stats: {
        left: {
            value: 0,
            el: null
        },
        right: {
            value: 0,
            el: null
        },
        groups: new Map(),
        els: new Map()
    },
    groups: [
        {
            name: 'red',
            color: '#ff0000',
            ratio: 1,
            population: 0,
            radius: 10,
        },
        {
            name: 'blue',
            color: '#0000ff',
            ratio: 10,
            population: 0,
            radius: 5,
        }
    ]
}

function init() {
    document.getElementById('appStart').addEventListener('click', start);
    document.getElementById('appStop').addEventListener('click', stop);
    document.getElementById('appReset').addEventListener('click', () => {
        app.settings.population.value = 200;
        app.settings.spring.value = 0.05;
        app.settings.friction.value = -0.98;
        app.settings.placement.value = 'random';
        readSettings();
    });

    const { population, friction, spring, placement } = app.settings;
    population.control = document.getElementById('setPopulation');
    friction.control = document.getElementById('setFriction');
    spring.control = document.getElementById('setSpring');
    placement.control = document.getElementsByName('setPlacement');

    for (const property in app.settings) {
        if (app.settings.hasOwnProperty(property)) {
            const setting = app.settings[property];
            if (setting != null) {
                if (setting.type === 'number') {
                    setting.control.addEventListener('input', writeSettings);
                } else if (setting.type === 'radio') {
                    setting.control.forEach(option => option.addEventListener('change', writeSettings));
                }
            }
        }
    }
    readSettings();

    const { left, right } = app.stats;
    left.el = document.getElementById('statsLeft');
    right.el = document.getElementById('statsRight');

    // Initialize the group stats
    app.stats.groups = new Map();
    app.groups.forEach(group => {
        app.stats.groups.set(group.name, 0);
        app.stats.els.set(group.name, document.getElementById(group.name + 'Stats'));
        app.stats.els.get(group.name).innerHTML = app.stats.groups.get(group.name);
    });
}

function setup() {
    const canvas = createCanvas(500, 500);
    canvas.parent('canvas-wrapper');
    frameRate(40);
}

function populate() {
    particles = [];
    const population = parseInt(app.settings.population.value, 10);

    // Calculate the population of each group based on the set ratio of each.
    let ratioWhole = app.groups.reduce((acc, g) => acc + g.ratio, 0);
    app.groups.forEach(g => g.population = floor(population * g.ratio / ratioWhole));
    while (app.groups.reduce((acc, g) => acc + g.population, 0) < population) {
        // If even distribution of the total population is not possible,
        // randomly assign an extra particle to a group until we reach
        // the total population.
        const randomIndex = floor(random(0, app.groups.length));
        app.groups[randomIndex].population++;
    }

    // Now create the particles in each group.
    app.groups.forEach(group => {
        for (let i = 0; i < group.population; i++) {
            const particle = new Particle(group, i);
            particles.push(particle);
            particle.place(particles);
        }
    });

    recordGroupStats();
}

function recordGroupStats() {
    app.groups.forEach((group, index) => {
        // Count the % particles in this group who have wandered outside their sector.
        const sectorWidth = width / app.groups.length;
        const min = sectorWidth * index;
        const max = min + sectorWidth;
        const numOutsideSector = particles.filter(p => {
            return p.group === group && (p.position.x < min || p.position.x > max);
        }).length;
        app.stats.groups.set(group.name, numOutsideSector / group.population);
        app.stats.els.get(group.name).innerHTML = formatPercent(app.stats.groups.get(group.name));
    });
}

function formatPercent(float) {
    return nfc(parseFloat(float) * 100, 0) + '%';
}

function draw() {
    if (app.active) {
        clear();
        noStroke();
        particles.forEach(particle => {
            particle.collide();
            particle.move();
            particle.display();
        });

        // Calculate stats
        app.stats.left.value = particles.filter(p => p.position.x < width / 2).length;
        app.stats.right.value = particles.filter(p => p.position.x > width / 2).length;
        app.stats.left.el.innerHTML = app.stats.left.value;
        app.stats.right.el.innerHTML = app.stats.right.value;
        recordGroupStats();

        // Draw gridlines on top
        stroke(155);
        line(width/2, 0, width/2, height);
    }
}

function areColliding(p1, p2) {
    let dx = p1.position.x - p2.position.x;
    let dy = p1.position.y - p2.position.y;
    let distance = sqrt(dx * dx + dy * dy);
    let minDist = p1.r + p2.r;
    return distance < minDist;
}

function writeSettings() {
    for (const property in app.settings) {
        if (app.settings.hasOwnProperty(property)) {
            const setting = app.settings[property];
            if (setting.type === 'number') {
                setting.value = setting.control.value;
            } else if (setting.type === 'radio') {
                const options = setting.control;
                const selected = Array.from(options).find(opt => opt.checked);
                setting.value = selected ? selected.value : null;
            }
        }
    }
}

function readSettings() {
    for (const property in app.settings) {
        if (app.settings.hasOwnProperty(property)) {
            const setting = app.settings[property];
            if (setting.type === 'number') {
                setting.control.value = setting.value;
            } else if (setting.type === 'radio') {
                const options = setting.control;
                options.forEach(opt => opt.checked = opt.value === setting.value);
            }
        }
    }
}

function start() {
    populate();
    app.active = true;
}

function stop() {
    app.active = false;
}

class Particle {
    constructor(group, id) {
        this.position = null;
        this.velocity = createVector(random(-1, 1), random(-1, 1));
        this.r = group.radius;
        this.color = group.color;
        this.id = group.name + id;
        this.spring = parseFloat(app.settings.spring.value);
        this.friction = parseFloat(app.settings.friction.value);
        this.placement = app.settings.placement.value;
        this.sectors = app.groups.length;
        this.group = group;
    }

    place() {
        // Place all particles in accordance with the placement setting,
        // but make sure none is on top of another.
        this.position = this.getInitialPosition();
        particles.filter(p => p.id !== this.id).forEach(p => {
            if (areColliding(this, p)) {
                this.position = this.getInitialPosition();
            }
        });
    }

    getInitialPosition() {
        if (this.placement === 'random') {
            return createVector(random(width), random(height))
        }
        if (this.placement === 'grouped') {
            const sectorWidth = width / this.sectors;
            const position = createVector(random(sectorWidth), random(height));
            const offsetFactor = app.groups.findIndex(g => g === this.group);
            position.x += offsetFactor * sectorWidth;
            return position;
        }
    }

    move() {
        this.position.add(this.velocity);
        // Bounce off the top edge
        if (this.position.y < this.r) {
            this.velocity.y *= this.friction;
            this.position.y = this.r;
        }
        // Bounce off the bottom edge
        if (this.position.y > (height - this.r)) {
            this.velocity.y *= this.friction;
            this.position.y = height - this.r;
        }
        // Bounce of the right edge
        if (this.position.x > (width - this.r)) {
            this.velocity.x *= this.friction;
            this.position.x = width - this.r;
        }
        // Bounce off the left edge
        if (this.position.x < this.r) {
            this.velocity.x *= this.friction;
            this.position.x = this.r;
        }
    }

    collide() {
        particles.filter(p => p.id !== this.id && areColliding(this, p)).forEach(p => {
            let dx = p.position.x - this.position.x;
            let dy = p.position.y - this.position.y;
            let angle = atan2(dy, dx);
            let targetX = this.position.x + cos(angle) * (this.r + p.r);
            let targetY = this.position.y + sin(angle) * (this.r + p.r);
            let ax = (targetX - p.position.x) * this.spring;
            let ay = (targetY - p.position.y) * this.spring;
            let bounce = createVector(ax, ay);
            this.velocity.sub(bounce);
            p.velocity.add(bounce);
        });
    }

    display() {
        fill(this.color);
        const diameter = 2 * this.r - 1;
        ellipse(this.position.x, this.position.y, diameter, diameter);
    }
}

