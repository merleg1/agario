function Vector(x, y) {

    this.x = x;
    this.y = y;

    this.Mag = Math.sqrt(x * x + y * y);

}

Vector.prototype.normalize = function () {

    this.x /= this.Mag;
    this.y /= this.Mag;

    this.Mag = 0;

}

Vector.prototype.setMag = function (m) {

    this.normalize();

    this.x *= m;
    this.y *= m;

    this.Mag = m;

}

Vector.prototype.add = function (v) {

    this.x += v.x;
    this.y += v.y;

    this.Mag = Math.sqrt(this.x * this.x + this.y * this.y);

}

Vector.prototype.dist = function (v) {
    return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2));
}

module.exports = Vector;

