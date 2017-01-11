// Including NPM packages
var mysql = require("mysql");
var inquirer = require("inquirer");

// Establishing connection with database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "P@20011989@m",
    database: "Bamazon"
});
connection.connect(function (err) {
    if (err) throw err;
    displayItems();
});

// Function to ask user their choice of product id and quantity they require
var buyItems = function () {
    inquirer.prompt([{
        name: "id",
        type: "input",
        message: "Enter the ID of the the product which you would like to buy:"
    }, {
        name: "unit",
        type: "input",
        message: "Enter number of units you want to buy : "
    }]).then(function (answer) {
        var query = "SELECT * FROM products where ?";
        connection.query(query, {
            item_id: answer.id
        }, function (err, res) {
            if (err) throw err;
            // If the units entered by user are greater that than the stock quantity then display insufficient quantity
            if (answer.unit > res[0].stock_quantity) {
                console.log('SORRY!! Insufficient quantity!');
            } else {
                // Process the order if all the requirements meet
                processOrder(answer.id, answer.unit, res[0].stock_quantity);
            }
        });


    });
};

// Function to display all the items in a table to the user
displayItems = function () {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log('\nLIST OF PRODUCTS!!!!\n');
        console.log('ID ' + ' PRODUCT ' + ' PRICE');
        for (i = 0; i < res.length; i++) {
            console.log(res[i].item_id + '  ' + res[i].product_name + ' = $' + res[i].price);
        }
        buyItems();
    });

};

// Function to update the db and calculate the total cost to be paid by user
processOrder = function (id, units, stock_quantity) {
    var processOrderQuery = "UPDATE products SET ? WHERE ?";
    connection.query(processOrderQuery, [{
        stock_quantity: stock_quantity - units
    }, {
        item_id: id
    }], function (err, res) {
        connection.query("SELECT * FROM products WHERE ?", {
            item_id: id
        }, function (err, res) {
            console.log("Congratulations!!! your order has been processed.\n Total Cost = $" + res[0].price * units);
        });
    });
};