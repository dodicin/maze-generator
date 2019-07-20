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

    initCanvas(prows, pcols, ptileSize, pinstant) {

        this.props = {
            instant: pinstant,

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
        //this.player = new Player();

        this.canvas.width = this.grid.cols*this.props.tileSize;
        this.canvas.height = this.grid.rows*this.props.tileSize;
        //this.ctx.translate(0.5, 0.5);
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

    generate() {
        this.grid.update();
        while (this.grid.stack.length > 0){
            this.grid.update();
        }
        this.drawGrid();
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
        var defaultWalls = cell.defaultWalls;

        this.ctx.beginPath();

        if ((walls & defaultWalls.TOP) > 0) {
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x+tileSize, y);
            this.ctx.stroke();
        }
        if ((walls & defaultWalls.LEFT) > 0) {
            this.ctx.moveTo(x, y+tileSize);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }
        /* 
        // Drawing left and top walls is enough to draw the whole maze
        if ((walls & defaultWalls.RIGHT) > 0) {
            this.ctx.moveTo(x+tileSize, y);
            this.ctx.lineTo(x+tileSize, y+tileSize);
            this.ctx.stroke();
        }
        if ((walls & defaultWalls.BOTTOM) > 0) {
            this.ctx.moveTo(x+tileSize, y+tileSize);
            this.ctx.lineTo(x, y+tileSize);
            this.ctx.stroke();
        } */
        
        if (cell.visited) {
            this.ctx.fillStyle = this.props.visitedCellColor;
            this.ctx.fillRect(x, y, tileSize, tileSize);
        }

        if (cell == this.grid.current) {
            this.ctx.fillStyle = this.props.currentCellColor;
            this.ctx.fillRect(x, y, tileSize, tileSize);
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

        this.defaultWalls = {
            TOP:    0b1000,
            RIGHT:  0b0100,
            BOTTOM: 0b0010,
            LEFT:   0b0001
        }
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

        let defaultWalls = target.defaultWalls;

        if (target.j == this.current.j) {
            // Remove vertical wall
            let orientation = this.current.i - target.i;
            if (orientation == 1) {
                // Remove top
                this.current.walls ^= defaultWalls.TOP;
                target.walls ^= defaultWalls.BOTTOM;
            }else{
                // Remove bottom
                this.current.walls ^= defaultWalls.BOTTOM;
                target.walls ^= defaultWalls.TOP;
            }

        }else{
            // Remove horizontal wall
            let orientation = this.current.j - target.j;
            if (orientation == 1) {
                // Remove left
                this.current.walls ^= defaultWalls.LEFT;
                target.walls ^= defaultWalls.RIGHT;
            }else{
                // Remove right
                this.current.walls ^= defaultWalls.RIGHT;
                target.walls ^= defaultWalls.LEFT;
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
    instant = document.getElementById('instant');
    buttonSet = document.getElementById('set');

    default_rows = 20;
    default_cols = 20;
    default_tile = 20;

    rows.value = default_rows;
    cols.value = default_cols;
    tileSize.value = default_tile;

    var cvs = new Canvas();
    cvs.initCanvas(parseInt(rows.value), parseInt(cols.value), parseInt(tileSize.value), instant.checked);

    buttonSet.addEventListener('click',function(){
        cvs.initCanvas(parseInt(rows.value), parseInt(cols.value), parseInt(tileSize.value), instant.checked);
        if (instant.checked){
            cvs.generate();
        }
    })

    window.addEventListener("load", () => { cvs.update(); } );

})();
},{"./canvas":1}]},{},[4]);
