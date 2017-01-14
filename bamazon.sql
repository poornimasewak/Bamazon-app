create database Bamazon;
use Bamazon;
create table products (
 item_id integer(11) auto_increment not null,
 product_name varchar(100) not null,
 department_name varchar(50) not null,
 price DECIMAL(10,4) not null,
 stock_quantity integer(11) not null,
 primary key (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Sofa", "Furniture", 1000.00, 10),
("Oatmeal", "Groceries", 2.75, 100),
("iphone 7", "Cell Phones", 850.99, 50),
("Soup", "Groceries", 1.54, 257),
("Earings", "Jewelry", 2678.34, 7),
("Chocolate", "Groceries", 9.78, 350),
("MySql", "Books", 34.78, 20),
("Necklace", "Jewelry", 21345.67, 9),
("Boots", "Shoes", 257.78, 67),
("Flats", "Shoes", 10.56, 999);

select * from products;