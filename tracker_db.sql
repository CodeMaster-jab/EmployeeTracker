DROP DATABASE IF EXISTS tracker_db;

CREATE DATABASE tracker_db;

USE tracker_db;

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL,
  role_id INT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  dept_name VARCHAR(30) NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NULL,
  salary DECIMAL(10,2) NULL,
  dept_id INT NULL,
  PRIMARY KEY (id)
);

INSERT INTO employee (first_name, last_name)
VALUES ("Jeff", "Bell");

INSERT INTO employee (first_name, last_name)
VALUES ("Scott", "Tefft");

INSERT INTO department (dept_name)
VALUES ("Enginerring");

INSERT INTO department (dept_name)
VALUES ("Human Resources");

INSERT INTO role (title, salary)
VALUES ("Developer", 250.00);

-- ### Alternative way to insert more than one row
-- INSERT INTO products (flavor, price, quantity)
-- VALUES ("vanilla", 2.50, 100), ("chocolate", 3.10, 120), ("strawberry", 3.25, 75);
