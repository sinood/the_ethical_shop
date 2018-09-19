document.getElementById("disc-name0").style.display = "none";

function addToCart(x, desc, form, prc, max_qty, qty) {
    var table = document.getElementById("tbl2");
    var row = table.insertRow(x);
    var cell0 = row.insertCell(0);
    var cell1 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    var cell3 = row.insertCell(3);
    var cell4 = row.insertCell(4);
    var cell5 = row.insertCell(5);
    cell0.outerHTML = "<td>" + desc + "</td>";
    cell1.outerHTML = "<td>" + form + "</td>";
    cell2.outerHTML = "<td>" + prc + "</td>";
    cell3.outerHTML = "<td>" + qty + "</td>";
    cell4.outerHTML = "<td class=\"qty-plus-minus-cell\"><button class=\"plus-minus minus\", onclick=\"decrement(this.parentElement.parentElement.cells[3]);updateTotal();\">-</button><button class=\"plus-minus plus\", onclick=\"increment(this.parentElement.parentElement.cells[3]," + max_qty + ");updateTotal();\">+</button></td>";
    cell5.outerHTML = "<td><button  class=\"store-col-4\", onclick=\"addToStore('" + desc + "','" + form + "'," + parseInt(prc.substring(1), 10) + "," + max_qty + "); this.parentElement.parentElement.parentElement.removeChild(this.parentElement.parentElement);updateTotal();\">Remove</button></td>";
}

function addToStore(desc, form, prc, max_qty) {
    var table = document.getElementById("tbl1");
    var row = table.insertRow(1);
    var cell0 = row.insertCell(0);
    var cell1 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    var cell3 = row.insertCell(3);
    var cell4 = row.insertCell(4);
    cell0.outerHTML = "<td>" + desc + "</td>";
    cell1.outerHTML = "<td>" + form + "</td>";
    cell2.outerHTML = "<td>$" + prc + ".00</td>";
    cell3.outerHTML = "<td>" + max_qty + "</td>";
    cell4.outerHTML = "<td><button onclick=\"addToCart(1,this.parentElement.parentElement.cells[0].innerHTML,this.parentElement.parentElement.cells[1].innerHTML,this.parentElement.parentElement.cells[2].innerHTML,this.parentElement.parentElement.cells[3].innerHTML,0);this.parentElement.parentElement.parentElement.removeChild(this.parentElement.parentElement);updateTotal();\">Add to cart</button></td>";
}

function removeRow() {
}

function decrement(cell) {
    var q = cell.innerHTML;
    q = parseInt(q, 10);
    if (q > 0){
        cell.innerHTML = q - 1;
    }
}

function increment(cell, max_qty) {
    var q = cell.innerHTML;
    q = parseInt(q, 10);
    if (q < max_qty){
        cell.innerHTML = q + 1;
    }
}

function updateTotal() {
    checkForDiscount();
    var total = 0;
    var total_amount = 0;
    var table = document.getElementById("tbl2");
    var len = document.getElementById("tbl2").rows.length;
    for (i = 1; i < len;i++){
        row = table.rows[i];
        qty = parseInt(row.cells[3].innerHTML,10);
        if (document.getElementById("disc-name0").style.visibility === "visible" && row.cells[1].innerHTML === 'DVD') {
            price = parseInt(row.cells[2].innerHTML.substring(1),10);
            total = total + qty * (price*0.90);
        } else if (document.getElementById("disc-name1").style.visibility === "visible" && row.cells[1].innerHTML === 'Blu-Ray') {
            price = parseInt(row.cells[2].innerHTML.substring(1),10);
            total = total + qty * (price*0.85);
        } else {
            price = parseInt(row.cells[2].innerHTML.substring(1),10);
            total = total + qty * price;
        }
        total_amount = total_amount + qty
    }
    if (total_amount >= 100) {
        total = total * 0.95
        document.getElementById("disc-name2").style.visibility = "visible";
    } else {
        document.getElementById("disc-name2").style.visibility = "hidden";
    }
    document.getElementById("amt").innerHTML = total_amount;
    document.getElementById("tot").innerHTML = "$"+total.toFixed(2);
}

function checkForDiscount() {
    var table = document.getElementById("tbl1");
    var len = document.getElementById("tbl1").rows.length;
    var sameCount = 0;
    var bool1 = true;
    var bool2 = true;
    if (len <= 1) {
        applyDiscount('DVD');
        applyDiscount('Blu-Ray');
    }
    if (document.getElementById("amt").innerHTML >= 100) {
        applyDiscount('100');
    } else {
        revokeDiscount('100');
    }
    for (i = 1; i < len;i++){
        row = table.rows[i];
        mediaFormat = row.cells[1].innerHTML;
        if (mediaFormat ==='DVD'){
            bool1 = false;
            revokeDiscount('DVD');
        } else if (mediaFormat ==='Blu-Ray') {
            bool2 = false;
            revokeDiscount('Blu-Ray');
        }
    }
    if (document.getElementById("tbl1").rows.length-1 > 0) {
        if (bool1) {
            applyDiscount('DVD');
        }
        if (bool2){
            applyDiscount('Blu-Ray');
        }
    }
}

function applyDiscount(type){
    total = document.getElementById("tot").innerHTML.substring(1);
    if (type === 'DVD') {
        document.getElementById("disc-name0").style.visibility = "visible";
    } else if (type === 'Blu-Ray') {
        document.getElementById("disc-name1").style.visibility = "visible";
    }
}

function revokeDiscount(type){
    if (type === 'DVD') {
        document.getElementById("disc-name0").style.visibility = "hidden";
    } else if (type === 'Blu-Ray') {
        document.getElementById("disc-name1").style.visibility = "hidden";
    }
}