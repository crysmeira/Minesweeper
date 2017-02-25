var ROWS = 10;
var COLS = 10;
var NUM_MINES = 10;

var vr = [-1, -1, -1, 0, 0, 1, 1, 1];
var vc = [-1, 0, 1, -1, 1, -1, 0, 1];
var table;
var mapOfContent; // -2 = opened, -1 = mine, 0 = nothing, 1-8 = mines near
var visible; 
var mines;
var opened;
var active;

var newGameBt = document.getElementById("newGame");
newGameBt.addEventListener("click", startGame);

var gameStatus = document.getElementById("gameStatus");

var modeButtons = document.querySelectorAll(".mode");
for (var i = 0; i < modeButtons.length; i++) {
    modeButtons[i].addEventListener("click", function() {
        modeButtons[0].classList.remove("selected");
        modeButtons[1].classList.remove("selected");
        modeButtons[2].classList.remove("selected");
        
        this.classList.add("selected");
        if (this.innerHTML === "Medium") {
            ROWS = 15;
            COLS = 15;
            NUM_MINES = 40;
        } else if (this.innerHTML === "Hard") {
            ROWS = 15;
            COLS = 30;
            NUM_MINES = 80;
        } else {
            ROWS = 10;
            COLS = 10;
            NUM_MINES = 10;
        }
        startGame();
    });
}

startGame();

function startGame() {
    active = true;
    opened = ROWS*COLS;
    mines = [];
    gameStatus.innerHTML = "";
    
    initializeTable();
    initializeListener();
    distributeMines();
    updateMinesNeighbors();
}

/* Initialize table SIZE * SIZE */
function initializeTable() {
    table = document.getElementsByTagName("tbody")[0];
    table.innerHTML = ""; // clear the table
    mapOfContent = [];
    visible = [];
    for (var i = 0; i < ROWS; i++) {
        var row = table.insertRow();
        mapOfContent[i] = [];
        visible[i] = [];
        for (var j = 0; j < COLS; j++) {
            var td = row.insertCell();
            td.innerHTML = "<span class='cells'></span>";
            td.id = "f"+i+"-"+j;
            td.row = i;
            td.col = j;
            mapOfContent[i][j] = 0;
            visible[i][j] = 0;
        }
    }
}

function initializeListener() {
    var tds = document.getElementsByTagName("td");

    for (var i = 0; i < tds.length; i++) {
        tds[i].addEventListener("click", function() {
            if (!active) { // not a valid game
                return;
            }
            var row = Number(this.row);
            var col = Number(this.col);
            if (visible[row][col] === 0) { // if it is the first time clicking it
                placeFlag(row, col);
                return;
            }
            this.style.background = "#ffffff";
            if (mapOfContent[row][col] === -1) { // it is a mine
                gameStatus.innerHTML = "You lost!";
                changeMine(row, col);
                openMines();
                active = false;
            } else {
                openBlank(row, col);
            }
            
            if (opened === NUM_MINES) {
                openMines();
                gameStatus.innerHTML = "You won! =)";
                active = false;
            }
        });
    }
}

/* Insert a flag in the current position */
function placeFlag(row, col) {
    visible[row][col] = 1;
    var curr = document.getElementById("f"+row+"-"+col).children[0];
    curr.innerHTML = "<i class='fa fa-flag' aria-hidden='true'></i>";
    curr.style.display = "inline";
}

/* Change the style of the pressed mine */
function changeMine(row, col) {
    var curr = document.getElementById("f"+row+"-"+col);
    curr.style.background = "#ffffff";
    curr.children[0].style.color = "#ff0000";
}

/* Generate the position for the mines */
function distributeMines() {
    while (mines.length < NUM_MINES) {
        var r = Math.floor(Math.random()*ROWS);
        var c = Math.floor(Math.random()*COLS);
        if (mapOfContent[r][c] === 0) {
            mapOfContent[r][c] = -1; // mine
            var pos = {
                row: r,
                col: c 
            };
            mines.push(pos);
        }
    }
}

function updateMinesNeighbors() {
    mines.forEach(function(m) {
        var row = m.row;
        var col = m.col;
        for (var i = 0; i < 8; i++) {
            var r = row + vr[i];
            var c = col + vc[i];
            if (r < 0 || c < 0 || r >= ROWS || c >= COLS 
                || mapOfContent[r][c] === -1) {
                continue;
            }
            mapOfContent[r][c]++;
        }
    });
}

function openBlank(row, col) {
    if (row < 0 || col < 0 || row >= ROWS || col >= COLS
        || mapOfContent[row][col] === -2) {
        return;
    }
    
    var curr = document.getElementById("f"+row+"-"+col);
    curr.style.background = "#ffffff";
    curr.children[0].style.display = "inline";
    curr.children[0].innerHTML = "";
    visible[row][col] = 1;
    opened -= 1;
    if (mapOfContent[row][col] !== 0) {
        curr.children[0].innerHTML = mapOfContent[row][col];
        mapOfContent[row][col] = -2;
        return;
    }
    mapOfContent[row][col] = -2;
    for (var i = 0; i < 8; i++) {
        var nextRow = row + vr[i];
        var nextCol = col + vc[i];
        openBlank(nextRow, nextCol);
    }
}

/* Show all the mines */
function openMines() {
    mines.forEach(function(m) {
        var row = m.row;
        var col = m.col;
        var curr = document.getElementById("f"+row+"-"+col).children[0];
        curr.innerHTML = "<i class='fa fa-bomb' aria-hidden='true'></i>";
        curr.style.display = "inline";
    });
}
