class Cell {
    constructor (i, j){
        this.i = i;
        this.j = j;
        this.walls = 0b1111;
        this.visited = false;
    }

    static walls = {
        TOP:    0b1000,
        RIGHT:  0b0100,
        BOTTOM: 0b0010,
        LEFT:   0b0001
    }
}

module.exports = Cell;