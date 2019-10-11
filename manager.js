const mysql = require("mysql");
const inquirer = require("inquirer")
const lowInv = [];
const listItems = []
const inventoryAdding = []
function Inventory(id, name, price, quantity, StockLevel) {
    this.id = id,
        this.name = name,
        this.price = price,
        this.quantity = quantity;
    this.StockLevel = StockLevel
}
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
                inventory()
                break;
            case "low inventory":
                lowInventory()
                break;
            case "add stock":
                addInventory()
                break;
            case "remove product":
                remove()
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
        console.log("Quantity Name  ID#")
        for (var i = 0; i < items.length; i++) {
            const productId = items[i].id;
            const name = items[i].product_name;
            const quantity = items[i].quantity;
            console.log(`${quantity}....${name} ||Product ID ${productId}`)
            console.log("----------------------------")
        } backend();
    })
}
function lowInventory() {
    console.log("The following are below 50% stock level")
    connection.query(query, function (err, items) {
        if (err) throw err;
        for (var i = 0; i < items.length; i++) {
            const productId = items[i].id;
            const name = items[i].product_name;
            const quantity = items[i].quantity;
            const low = items[i].order_more;
            if (quantity <= low) {
                let lowItem = `${name}`
                lowInv.push(lowItem)
                console.log(`${quantity}....${name} ||Product ID ${productId}`)
            }
        }
        inquirer.prompt([
            {
                type: "list",
                name: "additem",
                message: "Would you like to?",
                choices: ["order more", "main menu", "exit"]
            }
        ]).then(function (answer) {
            switch (answer.additem) {
                case "order more":
                    orderMore()
                    break;
                case "main menu":
                    backend()
                    break;
                case "exit":
                    console.log("Thank you come again")
                    exit()
                    break;
            }
        })

    })
}

function orderMore() {
    lowInv.forEach(list)
    function list(item) {
        listItems.push(item);
    }
    console.log(listItems)
    inquirer.prompt([
        {
            type: "list",
            name: "addItem",
            message: "What would you like to order more of?",
            choices: listItems
        }
    ]).then(function (selection) {
        orderItem = selection.addItem
        connection.query(query, function (err, items) {
            if (err) throw err;
            for (var i = 0; i < items.length; i++) {
                name = items[i].product_name;
                stockLevel = items[i].stock_level;
                if (orderItem === name) {
                    inventory1 = new Inventory(name, stockLevel)
                    restockAmount = inventory1.name
                    addInv()
                }
            }
        })

    })

}

function addInventory() {
    connection.query(query, function (err, items) {
        if (err) throw err;
        for (var i = 0; i < items.length; i++) {
            const name = items[i].product_name;
            inventoryAdding.push(name)
        }
        inventoryAdding.push("menu")
        inquirer.prompt([
            {
                type: "list",
                name: "invAdd",
                message: "what you you like to add?",
                choices: inventoryAdding
            },
            {
                type: "number",
                name: "addAmount",
                message: "how many?",
            }
        ]).then(function (selection) {
            const temp = [];
            selectedInv = selection.invAdd
            restockAmount = selection.addAmount
            for (var i = 0; i < items.length; i++) {
                const name = items[i].product_name;
                temp.push(name)
                x = temp.indexOf(selectedInv)
            }
            amount = items[x].quantity;
            restockAmount = restockAmount + amount

            if (selectedInv === "menu") {
                backend()
            } else {
                add();
            }
        })

    })
}
function add() {
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                quantity: restockAmount
            },
            {
                product_name: selectedInv
            }
        ], function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " products updated!\n");
            console.log(`There are now ${restockAmount} of ${selectedInv}`)
            next();
        });



}
function next() {
    inquirer.prompt([
        {
            type: "list",
            name: "nextStep",
            message: "What Would You Like To Do? ",
            choices: ["add more stock", "main menu", "exit"]
        }
    ]).then(function (answer) {
        switch (answer.nextStep) {
            case "add more stock":
                inventory()
                break;
            case "main menu":
                lowInventory()
                break;

            case "exit":
                console.log("Thank you come again")
                exit()
                break;
        }
    })
}

function addInv() {
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                quantity: restockAmount
            },
            {
                product_name: orderItem
            }
        ], function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " products updated!\n");
            console.log(`There are now ${restockAmount} of ${orderItem}`)

        })
}


function exit() {
    connection.end()
}

function remove() {
    connection.query(query, function (err, items) {
        if (err) throw err;
        for (var i = 0; i < items.length; i++) {
            const inventoryRemoving = [];
            for (var i = 0; i < items.length; i++) {
                const name = items[i].product_name;
                inventoryRemoving.push(name)
            }
            inquirer.prompt([
                {
                    type: "list",
                    name: "invRemove",
                    message: "what you you like to remove?",
                    choices: inventoryRemoving
                },
                {
                    type: "confirm",
                    name: "confirmation",
                    message: "are you sure?",
                }
            ]).then(function (answer) {
                if (answer.confirmation) {
                    const deleteItem = answer.invRemove;
                    connection.query(
                        "DELETE FROM products WHERE ?",
                        [
                            {
                                product_name: deleteItem
                            }
                        ], function (err, res) {
                            if (err) throw err;
                            console.log(res.affectedRows + " products updated!\n");
                            console.log(`${deleteItem} has be removed`)
                
                        }
                    )
                }
            })
        }


    })
}
