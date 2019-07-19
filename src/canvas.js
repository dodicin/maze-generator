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