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
            this.ctx.fillRect(x-0.5, y-0.5, tileSize+0.5, tileSize+0.5);
        }
    }
    
}

module.exports = Canvas;