(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
//const Player = require("./player");
//const Input = require("./input");

const Grid = require("./grid");
const Cell = require("./cell");

class Canvas {
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.grid = new Grid();
        //this.player = new Player();

        this.setCanvasDimensions();

        window.addEventListener("load", () => { this.update(); } );
    }

    setCanvasDimensions() {
        this.canvas.width = this.grid.width+1;
        this.canvas.height = this.grid.height+1;
        this.ctx.translate(0.5, 0.5);

    }

    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Movement
        //this.player.move(this.input.getHorizontal(), this.input.getVertical());

        // Collisions

        // Drawing
        this.drawGrid();
        //this.player.draw();

        requestAnimationFrame(() => { this.update(); });
    }

    drawGrid() {
        for (var i = 0; i < this.grid.cells.length; i++) {
            this.drawCell(this.grid.cells[i]);
        }
    }

    drawCell(cell) {
        var tileSize = this.grid.tileSize;
        var x = cell.i*tileSize;
        var y = cell.j*tileSize;

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

        if(cell.visited) {
            this.ctx.fillStyle = "rgb(100,149,237)";
            this.ctx.fillRect(x, y, tileSize, tileSize);
        }
        
    }
}

(function() {
    let requestAnimationFrame = window.requestAnimationFrame || 
                                window.mozRequestAnimationFrame || 
                                window.webkitRequestAnimationFrame || 
                                window.msRequestAnimationFrame;

    window.requestAnimationFrame = requestAnimationFrame;

    let cvs = new Canvas();
})();
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
        return {
            TOP:    this.getCell(x-1, y),
            RIGHT:  this.getCell(x  , y+1),
            BOTTOM: this.getCell(x+1, y),
            LEFT:   this.getCell(x  , y-1),
        }
    }
}

module.exports = Grid;
},{"./cell":2}]},{},[1]);
