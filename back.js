document.getElementById("disc-name0").style.display = "none";

// Adds items to the user's cart table
function addToCart(x, desc, form, prc, max_qty, qty) {
    // Call the shopping cart table by id="tbl2"
    var table = document.getElementById("tbl2");
    // Create a new row
    var row = table.insertRow(x);
    // Construct cells
    var cell0 = row.insertCell(0);
    var cell1 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    var cell3 = row.insertCell(3);
    var cell4 = row.insertCell(4);
    var cell5 = row.insertCell(5);
    
    // Creates cells as HTML tags containting the correct description from the function params
    cell0.outerHTML = "<td>" + desc + "</td>";
    cell1.outerHTML = "<td>" + form + "</td>";
    cell2.outerHTML = "<td>" + prc + "</td>";
    cell3.outerHTML = "<td>" + qty + "</td>";
    // Cell to contain plus/minus buttons that imcrement/decrement each item's quantity
    cell4.outerHTML = "<td class=\"qty-plus-minus-cell\"><button class=\"plus-minus minus\", onclick=\"decrement(this.parentElement.parentElement.cells[3]);updateTotal();\">-</button><button class=\"plus-minus plus\", onclick=\"increment(this.parentElement.parentElement.cells[3]," + max_qty + ");updateTotal();\">+</button></td>";
    // Cell to contain a button that removes this row's item from the cart and restores the item to the "store" table
    cell5.outerHTML = "<td><button  class=\"store-col-4\", onclick=\"addToStore('" + desc + "','" + form + "'," + parseInt(prc.substring(1), 10) + "," + max_qty + "); this.parentElement.parentElement.parentElement.removeChild(this.parentElement.parentElement);updateTotal();\">Remove</button></td>";
}

// Adds items back to the store with the original quantities after removing from the shopping cart
function addToStore(desc, form, prc, max_qty) {
    // Call the store table by id="tbl1"
    var table = document.getElementById("tbl1");
    // Create a new row
    var row = table.insertRow(1);
    // Construct cells
    var cell0 = row.insertCell(0);
    var cell1 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    var cell3 = row.insertCell(3);
    var cell4 = row.insertCell(4);
    
    // Creates cells as HTML tags containting the correct description from the function params
    cell0.outerHTML = "<td>" + desc + "</td>";
    cell1.outerHTML = "<td>" + form + "</td>";
    cell2.outerHTML = "<td>$" + prc + ".00</td>";
    cell3.outerHTML = "<td>" + max_qty + "</td>";
    // Cell to contain a button that removes this row's item from the store and adds it to the shopping cart
    cell4.outerHTML = "<td><button onclick=\"addToCart(1,this.parentElement.parentElement.cells[0].innerHTML,this.parentElement.parentElement.cells[1].innerHTML,this.parentElement.parentElement.cells[2].innerHTML,this.parentElement.parentElement.cells[3].innerHTML,0);this.parentElement.parentElement.parentElement.removeChild(this.parentElement.parentElement);updateTotal();\">Add to cart</button></td>";
}

// Function takes a cell containing an item's quantity and decrements that value by 1
function decrement(cell) {
    var q = cell.innerHTML;
    q = parseInt(q, 10);
    if (q > 0){
        cell.innerHTML = q - 1;
    }
}

// Function takes a cell containing an item's quantity and increments that value by 1
function increment(cell, max_qty) {
    var q = cell.innerHTML;
    q = parseInt(q, 10);
    if (q < max_qty){
        cell.innerHTML = q + 1;
    }
}

// Called after most user actions to update the total, checking for discounts as well
function updateTotal() {
    checkForDiscount(); // See function below
    var total = 0;
    var total_amount = 0;
    // Call the shopping cart table by id="tbl2"
    var table = document.getElementById("tbl2");
    var len = document.getElementById("tbl2").rows.length;
    
    // For each row (item) in shopping cart, checks to see if a discount for that item is avaliable, and applies the discount to that item's cost (discount displayed only in the total cost of the purchase)
    for (i = 1; i < len;i++){
        row = table.rows[i];
        qty = parseInt(row.cells[3].innerHTML,10);
        // DVD discount
        if (document.getElementById("disc-name0").style.visibility === "visible" && row.cells[1].innerHTML === 'DVD') {
            price = parseInt(row.cells[2].innerHTML.substring(1),10);
            total = total + qty * (price*0.90);
        // Blue-Ray discount
        } else if (document.getElementById("disc-name1").style.visibility === "visible" && row.cells[1].innerHTML === 'Blu-Ray') {
            price = parseInt(row.cells[2].innerHTML.substring(1),10);
            total = total + qty * (price*0.85);
        // Calculate total as normal (no item-specific discount found)
        } else {
            price = parseInt(row.cells[2].innerHTML.substring(1),10);
            total = total + qty * price;
        }
        total_amount = total_amount + qty // Update the total items count displayed next to purchase total
    }
    // Check for Bulk Discount (100 items in shopping cart)
    if (total_amount >= 100) {
        total = total * 0.95
        document.getElementById("disc-name2").style.visibility = "visible";
    } else {
        document.getElementById("disc-name2").style.visibility = "hidden";
    }
    // Display new total cost and item count
    document.getElementById("amt").innerHTML = total_amount;
    document.getElementById("tot").innerHTML = "$"+total.toFixed(2);
}

// Checks to see if a discount is available based on information from the store table
function checkForDiscount() {
    // Call the store table by id="tbl1"
    var table = document.getElementById("tbl1");
    var len = document.getElementById("tbl1").rows.length;
    var bool1 = true; // Is DVD discount avaliable
    var bool2 = true; // Is Blu-Ray discount available
    if (len <= 1) {
        applyDiscount('DVD');
        applyDiscount('Blu-Ray');
    }
    // A discount for each item type is applied if all of the items of that type have been placed in the shopping cart. For each item in "store" table, if a type is present, that type's discount is not applied 
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
    // If no items of either type were found in the "store" table, apply the appropriate discount
    if (document.getElementById("tbl1").rows.length-1 > 0) {
        if (bool1) {
            applyDiscount('DVD');
        }
        if (bool2){
            applyDiscount('Blu-Ray');
        }
    }
}

// Displays discount to page based on type passed in
function applyDiscount(type){
    total = document.getElementById("tot").innerHTML.substring(1);
    if (type === 'DVD') {
        document.getElementById("disc-name0").style.visibility = "visible";
    } else if (type === 'Blu-Ray') {
        document.getElementById("disc-name1").style.visibility = "visible";
    }
}

// Hides discount from page based on type passed in
function revokeDiscount(type){
    if (type === 'DVD') {
        document.getElementById("disc-name0").style.visibility = "hidden";
    } else if (type === 'Blu-Ray') {
        document.getElementById("disc-name1").style.visibility = "hidden";
    }
}