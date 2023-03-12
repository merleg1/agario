const Blob = require('./blob.js')

class Player extends Blob {

    constructor(name, x, y, r, id, canvasWidth, canvasHeight) {
        super(x, y, r);

        this.id = id;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.color = '#' + Math.random().toString(16).slice(-6);
        this.name = name;

    }

    eats(other) {
        if (this.collides(other) && this.r > other.r) {
            var sum = Math.PI * this.r * this.r + Math.PI * other.r * other.r;
            this.r = Math.sqrt(sum / Math.PI);
            return true;
        }
        return false;
    }

    move(v, limitX, limitY) {

        if((this.pos.x + v.x < limitX && this.pos.x + v.x > -limitX) && (this.pos.y + v.y < limitY && this.pos.y + v.y > -limitY)){
            this.pos.add(v);
        }
    }
}

module.exports = Player;