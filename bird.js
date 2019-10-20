function Bird(brain) {
    this.y = height / 2;
    this.x = 64;

    this.gravity = 0.6;
    this.lift = -15;
    this.velocity = 0;

    this.score = 0;
    this.finess = 0;

    if (brain) {
        this.brain = brain.copy();
    } else {
        this.brain = new NeuralNetwork(5, 8, 2);
    }

    this.show = function() {
        stroke(255);
        fill(255, 100);
        ellipse(this.x, this.y, 32, 32);
    };

    this.mutate = function() {
        this.brain.mutate(0.1);
    };

    this.up = function() {
        this.velocity += this.lift;
    };

    this.offscreen = function() {
        if (this.y > height) {
            return true;
        }
    };

    this.think = function() {
        let closest = null;
        let closestD = Infinity;
        for (let i = 0; i < pipes.length; i++) {
            let d = pipes[i].x + pipes[i].w - this.x;
            if (d < closestD && d > 0) {
                closest = pipes[i];
                closestD = d;
            }
        }

        let inputs = [];
        inputs[0] = this.y / height;
        inputs[1] = closest.top / height;
        inputs[2] = closest.bottom / height;
        inputs[3] = closest.x / width;
        inputs[4] = this.velocity / 10;

        let output = this.brain.predict(inputs);
        if (output[0] > output[1] && this.velocity >= 0) {
            this.up();
        }
    };

    this.update = function() {
        this.score++;

        this.velocity += this.gravity;
        this.velocity *= 0.9;
        this.y += this.velocity;

        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
    };
}
