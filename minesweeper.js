/* Initializes the field */
var table = document.getElementsByTagName("tbody")[0];

for (var i = 0; i < 10; i++) {
    var row = table.insertRow();
    for (var j = 0; j < 10; j++) {
        var td = row.insertCell();
        td.innerHTML = "<span></span>";
        td.id = "f"+i+j;
    }
}

/* Listen for clicks on the field */
var tds = document.getElementsByTagName("td");

for (var i = 0; i < tds.length; i++) {
    tds[i].addEventListener("click", function() {
        this.style.background = "#ffffff";
        var curr = document.getElementById(this.id).children[0];
        console.log("td: " + curr.innerHTML);
        if (curr.innerHTML !== "") {
            console.log("YOU LOST! " + this.id);
            curr.style.display = "inline";
            console.log("YOU LOST! " + curr);
        }
    });
}

/* Distribute mines */
var mines = [];

while (mines.length < 20) {
    var r = Math.floor(Math.random()*10);
    var c = Math.floor(Math.random()*10);
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

vr = [-1, -1, -1, 0, 0, 1, 1, 1];
vc = [-1, 0, 1, -1, 1, -1, 0, 1];

mines.forEach(function(m) {
    var row = m.row;
    var col = m.col;
    console.log("Mines: " + row + " " + col);
    var id = "f"+row+col;
    var field = document.getElementById(id).children[0];
    field.innerHTML = "b";
    for (var i = 0; i < 8; i++) {
        var r = row + vr[i];
        var c = col + vc[i];
        if (r < 0 || c < 0 || r >= 10 || c >= 10 || document.getElementById("f"+r+c).children[0].textContent === "b") {
            continue;
        }
        var neighbor = document.getElementById("f"+r+c).children[0];
        neighbor.innerHTML = (neighbor.innerHTML === " ") ? "1" : Number(neighbor.innerHTML)+1;
    }
});


