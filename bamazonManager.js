// Including NPM packages
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

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
    menuOption();
});

var table = new Table({
    head: ['item_id', 'product_name', 'price ($)', 'stock_quantity'],
    colWidths: [10, 20, 15, 20]
});

// Function to display different options to manager
var menuOption = function () {
    inquirer.prompt([{
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory",
            "Add to Inventory", "Add New Product"
        ]
    }]).then(function (answer) {
        switch (answer.action) {
        case "View Products for Sale":
            viewProductsForSale();
            break;
        case "View Low Inventory":
            viewLowInventory();
            break;
        case "Add to Inventory":
            addToInventory();
            break;
        case "Add New Product":
            addNewProduct();
            break;
        }
    });
};


var viewProductsForSale = function () {
    productQuery = "SELECT item_id, product_name, price, stock_quantity FROM products";
    connection.query(productQuery, function (err, res) {
        for (var i = 0; i < res.length; i++) {

            table.push(
                [res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]
            );
        }
        console.log(table.toString());
    });
};

var viewLowInventory = function () {
    lowInventoryQuery = "SELECT item_id, product_name, price, stock_quantity FROM products where stock_quantity < 5";
    connection.query(lowInventoryQuery,
        function (err, res) {
            for (var i = 0; i < res.length; i++) {

                table.push(
                    [res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]
                );
            }
            console.log(table.toString());

        });
};

var addTo = function () {

    inquirer.prompt([{
        name: "id",
        type: "input",
        message: "Enter the Id of product which you want to add in inventory?"
    }, {
        name: "num",
        type: "input",
        message: "how many you want to add ? "
    }]).then(function (answer) {
        console.log(answer.num);
        connection.query("SELECT item_id, stock_quantity FROM products where ?", {
            item_id: answer.id
        }, function (err, res) {
            console.log(res[0].stock_quantity);
            connection.query("UPDATE products SET ? WHERE ?", [{
                stock_quantity: parseInt(res[0].stock_quantity) + parseInt(answer.num)
            }, {
                item_id: answer.id
            }], function (err, resp) {
                if (err) throw err;
                console.log(resp);
            });
        });
    });
};

var addToInventory = function () {
    viewProductsForSale();
    addTo();
};

var addNewProduct = function () {
    inquirer.prompt([{
        type: "input",
        name: "product_name",
        message: "Product name:"
    }, {
        type: "input",
        name: "department_name",
        message: "Which department does this product belong to?"
    }, {
        type: "input",
        name: "price",
        message: "Product price:"
    }, {
        type: "input",
        name: "stock_quantity",
        message: "How many in stock?"
    }]).then(function (answer) {
        connection.query('INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES (?,?,?,?)', [answer.product_name, answer.department_name, answer.price, answer.stock_quantity], function (err, res) {
            if (err) throw err;
            console.log("New item added to inventory.");

        });
    });
};