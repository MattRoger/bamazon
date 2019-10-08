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
    ask()
});
function ask() {
    inquirer.prompt([
        {
            type: "list",
            name: "searchtype",
            message: "Search by: ",
            choices: ["all", "department", "exit"]
        }
    ]).then(function (answer) {
        switch (answer.searchtype) {
            case "all":
                console.log(answer)
                showAll()
                break;
        }
        switch (answer.searchtype) {
            case "exit":
                console.log("Thank you come again")
                exit()
                break;
            }
        })
    }
const query="SELECT * FROM products"    
function showAll() {
    console.log("working")
    connection.query(query, function (err, items) {
        if (err) throw err;
        console.log("Available for Purchase")
        for (var i = 0; i < items.length; i++) {
            const productId = items[i].id;
            const name = items[i].product_name;
            const dep = items[i].department;
            const price = "$" + items[i].price;
            const quantity = items[i].quantity;
            console.log(
                `Product ID ${productId} ||${name}....${price}  ||${quantity}`
            )
            
        }
        purchase()
        
    });

}

function purchase() {
    console.log("what would you like to buy?")
    inquirer.prompt([
        {
            type:"integer",
            name:"purchaseId",
            message:"Please enter Product ID# "
        },
        {
            type:"integer",
            name:"quant",
            message:"How many? "
        }
    ]).then(function(buy){
        const buyID=buy.purchaseId;
        const productId=buyID;      
        const total=buy.quant;
        connection.query(query, function (err, items){
            
            name = items[buyID-1].product_name;
            console.log("thank you")
            console.log(`You wish to purchase ${total} ${name} ${productId} `)

            exit()
        })
    })
}

function exit() {
    connection.end()

}