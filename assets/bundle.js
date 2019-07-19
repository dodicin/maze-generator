(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
//const Player = require("./player");
//const Input = require("./input");

const Grid = require("./grid");
const Cell = require("./cell");

class Canvas {
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
    }

    initCanvas(prows, pcols, ptileSize) {
        
        this.props = {
            cols: pcols,
            rows: prows,
            tileSize: ptileSize,

            playerColor: "rgb(0,0,0)",
            exitColor: "rgb(255,255,255)",
            gridBackgroundColor: "rgba(0, 0, 0, 0.5)",
            wallsColor: "#222A33",
            currentCellColor: "rgb(197,174,204,125)",
            visitedCellColor: "rgb(227,227,227,125)",
        }

        this.grid = new Grid(this.props.cols, this.props.rows);
        window.addEventListener("load", () => { this.update(); } );
        //this.player = new Player();

        this.canvas.width = this.grid.cols*this.props.tileSize;
        this.canvas.height = this.grid.rows*this.props.tileSize;
        this.ctx.translate(0.5, 0.5);
        this.ctx.lineWidth = 2;

        this.ctx.fillStyle = this.props.wallsColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.strokeStyle = this.props.wallsColor;
    }

    update() {
        // Movement
        //this.player.move(this.input.getHorizontal(), this.input.getVertical());

        // Collisions

        // Drawing
        this.drawGrid();
        //this.player.draw();

        requestAnimationFrame(() => { this.update();});

    }

    drawGrid() {
        for (var i = 0; i < this.grid.cells.length; i++) {
            this.drawCell(this.grid.cells[i]);
        }
        this.grid.update();
    }

    drawCell(cell) {
        var tileSize = this.props.tileSize;
        var x = cell.j*tileSize;
        var y = cell.i*tileSize;

        var walls = cell.walls;

        this.ctx.beginPath();

        if ((walls & Cell.walls.TOP) > 0) {
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x+tileSize, y);
            this.ctx.stroke();
        }
        if ((walls & Cell.walls.RIGHT) > 0) {
            this.ctx.moveTo(x+tileSize, y);
            this.ctx.lineTo(x+tileSize, y+tileSize);
            this.ctx.stroke();
        }
        if ((walls & Cell.walls.BOTTOM) > 0) {
            this.ctx.moveTo(x+tileSize, y+tileSize);
            this.ctx.lineTo(x, y+tileSize);
            this.ctx.stroke();
        }
        if ((walls & Cell.walls.LEFT) > 0) {
            this.ctx.moveTo(x, y+tileSize);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }
        
        if (cell.visited) {
            this.ctx.fillStyle = this.props.visitedCellColor;
            this.ctx.fillRect(x-0.5, y-0.5, tileSize, tileSize);
        }

        if (cell == this.grid.current) {
            this.ctx.fillStyle = this.props.currentCellColor;
            this.ctx.fillRect(x-0.5, y-0.5, tileSize, tileSize);
        }
    }
    
}

module.exports = Canvas;
},{"./cell":2,"./grid":3}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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

        console.log("Removing wall");
        console.log(JSON.stringify(this.current));
        console.log(JSON.stringify(target));

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

        console.log("After removal");
        console.log(JSON.stringify(this.current));
        console.log(JSON.stringify(target));
        
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
},{"./cell":2}],4:[function(require,module,exports){
const Canvas = require("./canvas");

(function() {
    let requestAnimationFrame = window.requestAnimationFrame || 
                                window.mozRequestAnimationFrame || 
                                window.webkitRequestAnimationFrame || 
                                window.msRequestAnimationFrame;

    window.requestAnimationFrame = requestAnimationFrame;

    rows = document.getElementById('rows');
    cols = document.getElementById('cols');
    tileSize = document.getElementById('tileSize');
    buttonSet = document.getElementById('set');

    default_rows = 3;
    default_cols = 3;
    default_tile = 30;

    rows.value = default_rows;
    cols.value = default_cols;
    tileSize.value = default_tile;

    var cvs = new Canvas();
    cvs.initCanvas(parseInt(rows.value), parseInt(cols.value), parseInt(tileSize.value));

    buttonSet.addEventListener('click',function(){
        cvs.initCanvas(parseInt(rows.value), parseInt(cols.value), parseInt(tileSize.value));
    })

    
})();
},{"./canvas":1}]},{},[4]);
