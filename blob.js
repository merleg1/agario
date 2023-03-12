const Vector = require('./vector.js')

class Blob {
    constructor(x, y, r) {
        this.pos = new Vector(x, y);
        this.r = r;
        this.color = '#FFFFFF';
    }

    collides(other) {
        return this.pos.dist(other.pos) < this.r + other.r;
    }
}

module.exports = Blob;
