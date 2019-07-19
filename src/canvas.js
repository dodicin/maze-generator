//const Player = require("./player");
//const Input = require("./input");

const Grid = require("./grid");
const Cell = require("./cell");

class Canvas {
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.props = {
            playerColor: "rgb(0,0,0)",
            exitColor: "rgb(255,255,255)",

            cols: 20,
            rows: 20,

            tileSize: 30,
            wallSize: 2,
            gridBackgroundColor: "rgba(0, 0, 0, 0.5)",
            wallsColor: "#222A33",
            currentCellColor: "rgb(227,227,227,125)",
            visitedCellColor: "rgb(197,174,204,125)",
        }

        this.grid = new Grid(this.props.cols, this.props.rows);
        //this.player = new Player();

        this.initCanvas();

        window.addEventListener("load", () => { this.update(); } );
    }

    initCanvas() {
        this.canvas.width = this.grid.cols*this.props.tileSize;
        this.canvas.height = this.grid.rows*this.props.tileSize;
        this.ctx.translate(0.5, 0.5);
        this.ctx.lineWidth = 2;
    }

    update() {
        this.ctx.fillStyle = this.props.wallsColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

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
        this.grid.update();
    }

    drawCell(cell) {
        var tileSize = this.props.tileSize;
        var x = cell.i*tileSize;
        var y = cell.j*tileSize;

        var walls = cell.walls;

        this.ctx.beginPath();
        this.ctx.strokeStyle = this.props.wallsColor;

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