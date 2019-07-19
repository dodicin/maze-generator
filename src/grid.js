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

    getCell(x, y){
        if (x < 0 || x > this.rows-1 || y < 0 || y > this.cols-1) {
            return this.dummy;
        }else{
            return this.cells[x*this.rows + y];
        }
    }

    getNeighbor(cell) {
        let x = cell.i;
        let y = cell.j;

        let neigh = {
            top:    this.getCell(x  , y-1),
            right:  this.getCell(x+1, y),
            bottom: this.getCell(x  , y+1),
            left:   this.getCell(x-1, y),
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
        if (target.i == this.current.i) {
            // Remove vertical wall
            let orientation = this.current.j - target.j;
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
            let orientation = this.current.i - target.i;
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
        this.current.visited = true;
        let next = this.getNeighbor(this.current);

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