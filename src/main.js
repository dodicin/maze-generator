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