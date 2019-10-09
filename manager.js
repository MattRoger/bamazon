const mysql = require("mysql");
const inquirer = require("inquirer")
const lowInv=[];
const listItems=[]
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
                let lowItem=` id ${productId} ${name}...${quantity}`                
                lowInv.push(lowItem)
                console.log(`${quantity}....${name} ||Product ID ${productId}`)
            }
        }

            console.log("products low " + lowInv)
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

function orderMore() {
    console.log("order more working")
    console.log("products low" +lowInv[0])
    lowInv.forEach(list)
    function list(item, index){
     listItems.push('"'+item + " "+ index+'"'+",");
    }
    console.log(listItems)
    console.log("here we are")
   
    inquirer.prompt([
        {
             type: "checkbox",
             name: "addItem",
             message: "What would you like to order more of?",
             choices: listItems
         }
     ]).then(function(selection){
console.log(selection.addITem)
     })

    
    // connection.query(
    //     "UPDATE products SET ? WHERE ?",       
    //     [
    //     {
    //         quantity:newQuantity
    //     },
    //     {
    //         product_name: name
    //     }
    // ], function (err, res) {
    //     if (err) throw err;
    //     console.log(res.affectedRows + " products updated!\n");
    //     console.log(`There are now ${newQuantity} of ${name}`)
    // })
}