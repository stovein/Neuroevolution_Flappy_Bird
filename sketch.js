const TOTAL_POPULATION = 350;

var birds = [];
var savedBirds = [];
var pipes = [];
var counter = 0;
var slider;
var gen = 0;

let speedSlider;
let speedSpan;
let highScoreSpan;
let allTimeHighScoreSpan;

// All time high score
let highScore = 0;

function setup() {
    let canvas = createCanvas(400, 600);
    canvas.parent("canvascontainer");

    // Access the interface elements
    speedSlider = select("#speedSlider");
    currentGen = select("#gen");
    speedSpan = select("#speed");
    highScoreSpan = select("#hs");
    allTimeHighScoreSpan = select("#ahs");

    for (let i = 0; i < TOTAL_POPULATION; i++) {
        birds[i] = new Bird();
    }
}

function draw() {
    let cycles = speedSlider.value();
    speedSpan.html(cycles);

    for (let n = 0; n < cycles; n++) {
        if (counter % 120 == 0) {
            pipes.push(new Pipe());
        }
        counter++;

        for (let i = pipes.length - 1; i >= 0; i--) {
            pipes[i].update();

            for (let j = birds.length - 1; j >= 0; j--) {
                if (pipes[i].hits(birds[j])) {
                    savedBirds.push(birds.splice(j, 1)[0]);
                }
            }

            if (pipes[i].offscreen()) {
                pipes.splice(i, 1);
            }
        }

        for (let bird of birds) {
            bird.think(pipes);
            bird.update();
            score = bird.score;
        }

        if (birds.length === 0) {
            counter = 0;
            nextGeneration();
            gen++;
            pipes = [];
        }
    }
    let tempScore = 0;

    for (let j = birds.length - 1; j >= 0; j--) {
        if (birds[j].offscreen()) {
            savedBirds.push(birds.splice(j, 1)[0]);
        }
    }

    background(0);

    for (let bird of birds) {
        bird.show();
        if (bird.score > tempScore) {
            tempScore = bird.score;
        }
        if (tempScore > highScore) {
            highScore = tempScore;
        }
    }

    highScoreSpan.html(Math.floor(tempScore / 60));
    allTimeHighScoreSpan.html(Math.floor(highScore / 60));
    currentGen.html(gen);

    for (let pipe of pipes) {
        pipe.show();
    }
}

function keyPressed() {
    if (key === "s" || key === "S") {
        let bird = birds[0].brain;
        // let json = bird.brain.serialize();
        saveJSON(bird, "bird.json");
    }
}
