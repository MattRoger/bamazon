const mysql = require("mysql");
const inquirer = require("inquirer")
const connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "matrix",
    database: "bamazon_db"
});
connection.connect(function (err) {
    if (err) throw err;
    console.log(`connected to ${connection.threadId}`)
    backend()
});
function backend() {
    inquirer.prompt([
        {
            type: "list",
            name: "searchtype",
            message: "What Would You Like To Do ",
            choices: ["inventory", "low inventory", "add stock", "remove product", "exit"]
        }
    ]).then(function (answer) {
        switch (answer.searchtype) {
            case "inventory":
                console.log(answer)
                inventory()
                break;
            case "low inventory":
                console.log(answer)
                lowInventory()
                break;
            case "exit":
                console.log("Thank you come again")
                exit()
                break;
        }
    })
}
const query = "SELECT * FROM products"
function inventory() {
    connection.query(query, function (err, items) {
        if (err) throw err;
        console.log("Current Inventory")
        for (var i = 0; i < items.length; i++) {
            const productId = items[i].id;
            const name = items[i].product_name;
            const quantity = items[i].quantity;
            console.log(`${quantity}....${name} ||Product ID ${productId}`)
        }
    })
}

function lowInventory(){
    console.log("The following are below 50% stock level")
    connection.query(query, function (err, items) {
        if (err) throw err;
             for (var i = 0; i < items.length; i++) {
            const productId = items[i].id;
            const name = items[i].product_name;
            const quantity = items[i].quantity;
            const lowInv=items[i].order_more
            if(quantity<=lowInv){
                console.log(`${quantity}....${name} ||Product ID ${productId}`)

            }
        }
    })
}