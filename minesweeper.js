/* Initializes the field */
var table = document.getElementsByTagName("tbody")[0];

for (var i = 0; i < 10; i++) {
    var row = table.insertRow();
    for (var j = 0; j < 10; j++) {
        var td = row.insertCell();
        td.textContent = " ";
        td.id = "f"+i+j;
    }
}

/* Listen for clicks on the field */
var tds = document.getElementsByTagName("td");

for (var i = 0; i < tds.length; i++) {
    tds[i].addEventListener("click", function() {
        console.log("td: " + this.textContent);
        //this.textContent = "x";
        this.style.background = "#ffffff";
        if (this.innerHTML !== " ") {
            console.log("YOU LOST! " + this.id);
            var c = document.getElementById(this.id).children[0];
            c.style.display = "inline";
            console.log("YOU LOST! " + c);
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

mines.forEach(function(m) {
    var row = m.row;
    var col = m.col;
    console.log("Mines: " + row + " " + col);
    var id = "f"+row+col;
    var field = document.getElementById(id);
    field.innerHTML = "<span>b</span>";
});
