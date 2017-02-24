var SIZE = 10;
var NUM_MINES = SIZE*2;

var vr = [-1, -1, -1, 0, 0, 1, 1, 1];
var vc = [-1, 0, 1, -1, 1, -1, 0, 1];
var table;
var matrix;
var mines;
var available;
var active;

var newGameBt = document.getElementById("newGame");
newGameBt.addEventListener("click", startGame);

startGame();

function startGame() {
    active = true;
    available = SIZE*SIZE;
    mines = [];

    initializeTable();
    initializeListener();
    distributeMines();
    placeMines();
    placeMinesOnTable();
}

function initializeTable() {
    table = document.getElementsByTagName("tbody")[0];
    table.innerHTML = "";
    matrix = [];
    for (var i = 0; i < SIZE; i++) {
        var row = table.insertRow();
        matrix[i] = [];
        for (var j = 0; j < SIZE; j++) {
            var td = row.insertCell();
            td.innerHTML = "<span></span>";
            td.id = "f"+i+j;
            matrix[i][j] = 0;
        }
    }
}

function initializeListener() {
    var tds = document.getElementsByTagName("td");

    for (var i = 0; i < tds.length; i++) {
        tds[i].addEventListener("click", function() {
            if (!active) {
                return;
            }
            this.style.background = "#ffffff";
            var row = Number(this.id[1]);
            var col = Number(this.id[2]);
            if (matrix[row][col] === -1) {
                console.log("You lost!");
                var curr = document.getElementById("f"+row+col);
                curr.style.background = "#ffffff";
                curr.children[0].style.color = "#ff0000";
                openMines();
                active = false;
            } else {
                openBlank(row, col);
            }
            
            if (available === NUM_MINES) {
                console.log("Congratulations! You won the game...");
                active = false;
            }
        });
    }
}

function distributeMines() {
    while (mines.length < NUM_MINES) {
        var r = Math.floor(Math.random()*SIZE);
        var c = Math.floor(Math.random()*SIZE);
        var pos = {
            row: r,
            col: c 
        };
        var valid = true;
        for (var j = 0; j < mines.length; j++) {
            if (mines[j].row === pos.row && mines[j].col === pos.col) {
                valid = false;
                break;
            }
        }   
        if (valid) {
            mines.push(pos);
        }
    }
}

function placeMines() {
    mines.forEach(function(m) {
        var row = m.row;
        var col = m.col;
        matrix[row][col] = -1; // mine
        for (var i = 0; i < 8; i++) {
            var r = row + vr[i];
            var c = col + vc[i];
            if (r < 0 || c < 0 || r >= SIZE || c >= SIZE || matrix[r][c] === -1) {
                continue;
            }
            matrix[r][c]++;
        }
    });
}

function placeMinesOnTable() {
    for (var row = 0; row < SIZE; row++) {
        for (var col = 0; col < SIZE; col++) {
            var id = "f"+row+col;
            var field = document.getElementById(id).children[0];
            if (matrix[row][col] === -1) {
                field.innerHTML = "<i class='fa fa-bomb' aria-hidden='true'></i>";
            } else if (matrix[row][col] != 0) {
                field.innerHTML = matrix[row][col];
            } 
        }
    }
}

function openBlank(row, col) {
    if (row < 0 || col < 0 || row >= SIZE || col >= SIZE || matrix[row][col] === -2) {
        return;
    }
    
    var curr = document.getElementById("f"+row+col);
    curr.style.background = "#ffffff";
    curr.children[0].style.display = "inline";
    available -= 1;
    if (matrix[row][col] !== 0) {
        matrix[row][col] = -2;
        return;
    }
    matrix[row][col] = -2;
    for (var i = 0; i < 8; i++) {
        var nextRow = row + vr[i];
        var nextCol = col + vc[i];
        openBlank(nextRow, nextCol);
    }
}

function openMines() {
    mines.forEach(function(m) {
        var row = m.row;
        var col = m.col;
        document.getElementById("f"+row+col).children[0].style.display = "inline";
    });
}
