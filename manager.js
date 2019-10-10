const mysql = require("mysql");
const inquirer = require("inquirer")
const lowInv = [];
const lowInvId = []
const listItems = []
let order = []
let idName = []
var stockLevel = []

function Inventory(id, name, price, quantity) {
    this.id = id,
        this.name = name,
        this.price = price,
        this.quantity = quantity;
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
                inventory1 = new Inventory(productId, name, quantity)
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
                    restock()
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
            const stockLevel = items[i].stock_level;
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



// function orderMore() {
//     // console.log("products low" +lowInv[0])
//     lowInv.forEach(list)
//     function list(item) {
//         listItems.push(item);
//     }
//     console.log(listItems)
//     inquirer.prompt([
//         {
//             type: "checkbox",
//             name: "addItem",
//             message: "What would you like to order more of?",
//             choices: listItems
//         }
//     ]).then(function (selection) {
//         orderItem = selection.addItem
//         console.log("orderItem" + orderItem)
//         order = orderItem.splice(",")
//         connection.query(query, function (err, items){
//             if (err) throw err;
//             x=order.length-1
//             for (var i = 0; i < items.length; i++) {
//               const sl = items[i].stock_level;
//               stockLevel.push(sl)
//                nid = items[i].product_name;
//               idName.push(nid)
//               if(order[x]==idName[i]){

//                   z= idName.indexOf(idName[i])
//                   console.log(z + "ZZZZ")
//                   console.log("hit" + order[x] + idName[i]);
//                     addInv()
//                 }
//             } 
//             x=-1


//             console.log("here we are")
//             console.log(x)
//             console.log(order[x-1])
//             console.log(stockLevel)
//             console.log(idName)
//                 // console.log(stock)


//         })



//     })

// }

// function addInv(){
//     console.log("addinv working")
//     for (i = 0; i < order.length; i++) {
//         console.log("working")

//         connection.query(
//             "UPDATE products SET ? WHERE ?",
//             [
//                 {
//                     product_name: order[i]
//                 },
//                 {
//                     quantity:stockLevel[z]
//                 }
//             ], function (err, res) {
//                 if (err) throw err;
//                 console.log(res.affectedRows + " products updated!\n");
//                 console.log(`There are now ${stockLevel[z]} of ${order[x]}`)

//             })

//     }
// }