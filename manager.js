const mysql = require("mysql");
const inquirer = require("inquirer")
const lowInv = [];
const lowInvId = []
const listItems = []
let order = []
let idName = []
// var stockLevel = []

function Inventory(id, name, price, quantity, StockLevel) {
    this.id = id,
        this.name = name,
        this.price = price,
        this.quantity = quantity;
        this.StockLevel=StockLevel
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
                let lowItemId = productId;
                lowInvId.push(lowItemId)
                console.log(`${quantity}....${name} ||Product ID ${productId}`)
            }
        }

        inquirer.prompt([
            {
                type: "list",
                name: "additem",
                message: "Would you like to?",
                choices: ["order more", "exit"]
            }
        ]).then(function (answer) {
            switch (answer.additem) {
                case "order more":
                    orderMore()
                    break;
                case "exit":
                    console.log("Thank you come again")
                    exit()
                    break;
            }
        })

    })
}

function restock() {
    console.log("order more working")
    connection.query(query, function (err, items) {
        if (err) throw err;
        for (var i = 0; i < items.length; i++) {
            const name = items[i].product_name;
            productId = items[i].id;
            order.push(name)
            const quantity = items[i].quantity;
            
        }
        console.log(order)
        inquirer.prompt([
            {
                type: "checkbox",
                name: "addInv",
                message: "What would you like to restock?",
                choices: order
            }
        ]).then(function (selection) {
            x = selection.addInv
            x.forEach(fill)
            function fill(order) {

                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            product_name: order[i]
                        },
                        {
                            quantity: stockLevel[z]
                        }
                    ], function (err, res) {
                        if (err) throw err;
                        console.log(res.affectedRows + " products updated!\n");
                        console.log(`There are now ${stockLevel[z]} of ${order[x]}`)

                    })



            }
        })

    })
}



function orderMore() {
    // console.log("products low" +lowInv[0])
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
        console.log("orderItem" + orderItem)     
        connection.query(query, function (err, items){
            console.log("here we are")
            if (err) throw err;           
            for (var i = 0; i < items.length; i++) {
                 name = items[i].product_name;
                 stockLevel = items[i].stock_level;
                 if(orderItem===name){
                    inventory1 = new Inventory( name, stockLevel)
                    restockAmount=inventory1.name
                    addInv()
                 }
                }
         })

    })

}

function addInv(){
    console.log("addinv working")
    
        console.log(restockAmount)
        console.log("orderItem")
        console.log("working")
        connection.query(
            "UPDATE products SET ? WHERE ?",
            [
                {
                    quantity:restockAmount
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