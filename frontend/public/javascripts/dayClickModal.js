var data = [
];

window.onload = function(){
    var table = document.createElement('table');
    var targetPn = document.getElementById ('targetPn');
    targetPn.appendChild(table);
    table.border = 1;
    table.width = 200;
    for (var i=0; i<data.length; i++){
        var tr = document.createElement('tr');
        table.appendChild(tr);
        for (var j=0; j<data[i].length; j++){
            var td = document.createElement('td');
            tr.appendChild(td);
            td.innerHTML = data[i][j];
        }
    }
}

function sortTable(){
    var table = document.getElementsByTagName('table');
    var rows = table[0].rows;
    for (var i = 1; i < (rows.length - 1); i++) {
        var fCell = rows[i].cells[0];
        var sCell = rows[i + 1].cells[0];
        if (fCell.innerHTML.toLowerCase() > sCell.innerHTML.toLowerCase()) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        }
    }
}