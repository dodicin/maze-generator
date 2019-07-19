const Cell = require("./cell");

class Grid {
    constructor (cols = 5, rows = 5){
        this.cols = cols;
        this.rows = rows;

        this.cells = [];
        this.stack = [];

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let cell = new Cell(i, j);
                this.cells.push(cell);
            }
        }
        
        this.current = this.cells[0];
        this.dummy = new Cell(-1, -1);
        this.dummy.visited = true;
    }

    getCell(i, j){
        if (i < 0 || i > this.rows-1 || j < 0 || j > this.cols-1) {
            return this.dummy;
        }else{
            return this.cells[i*this.cols + j];
        }
    }

    getNeighbor(cell) {
        let i = cell.i;
        let j = cell.j;

        var neigh = {
            top:    this.getCell(i-1, j),
            right:  this.getCell(i  , j+1),
            bottom: this.getCell(i+1, j),
            left:   this.getCell(i  , j-1),
        }

        let unvisited = [];
        for (const [key, value] of Object.entries(neigh)) {
            if (!value.visited) {
                unvisited.push(value);
            }
        }

        if (unvisited.length > 0) {
            let r = Math.floor(Math.random() * unvisited.length);
            return unvisited[r];
        } else {
            return undefined;
        }
    }

    removeWall(target) {

        if (target.j == this.current.j) {
            // Remove vertical wall
            let orientation = this.current.i - target.i;
            if (orientation == 1) {
                // Remove top
                this.current.walls ^= Cell.walls.TOP;
                target.walls ^= Cell.walls.BOTTOM;
            }else{
                // Remove bottom
                this.current.walls ^= Cell.walls.BOTTOM;
                target.walls ^= Cell.walls.TOP;
            }

        }else{
            // Remove horizontal wall
            let orientation = this.current.j - target.j;
            if (orientation == 1) {
                // Remove left
                this.current.walls ^= Cell.walls.LEFT;
                target.walls ^= Cell.walls.RIGHT;
            }else{
                // Remove right
                this.current.walls ^= Cell.walls.RIGHT;
                target.walls ^= Cell.walls.LEFT;
            }
        }
        
    }

    update() {
        let next = this.getNeighbor(this.current);

        this.current.visited = true;
        if(next) {
            this.stack.push(this.current);

            this.removeWall(next);
            this.current = next;
        }else if (this.stack.length > 0) {
            // Backtrack
            this.current = this.stack.pop();
        }
    }
}

module.exports = Grid;