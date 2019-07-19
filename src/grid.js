const Cell = require("./cell");

class Grid {
    constructor (cols = 5, rows = 5, tileSize = 50){
        this.cols = cols;
        this.rows = rows;
        this.tileSize = tileSize;

        this.width = this.cols * this.tileSize;
        this.height = this.rows * this.tileSize;

        this.cells = [];

        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                var cell = new Cell(i, j);
                this.cells.push(cell);
            }
        }

        this.current = this.cells[0];
        this.dummy = new Cell(-1, -1);
        this.dummy.visited = true;
    }

    getCell(x, y){
        if (x < 0 || x > this.rows || y < 0 || y > this.cols) {
            return this.dummy;
        }else{
            return this.cells[x*this.rows + y];
        }
    }

    getNeighbors(x, y) {
        var neigh = {
            top:    this.getCell(x-1, y),
            right:  this.getCell(x  , y+1),
            bottom: this.getCell(x+1, y),
            left:   this.getCell(x  , y-1),
        }

        var unvisited = [];

        for (const [key, value] of Object.entries(neigh)) {
            if (!value.visited) {
                unvisited.push(value);
            }
        }

        if (unvisited.length > 0) {
            var r = floor(random(0, unvisited.length));
            return unvisited[r];
        } else {
            return undefined;
        }
    }
}

module.exports = Grid;