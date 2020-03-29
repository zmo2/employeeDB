DROP DATABASE IF EXISTS employeeDB;
CREATE DATABASE empoyeeDB;

USE employeeDB;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30),
    PRIMARY KEY (id)
);

CREATE TABLE role(
    id INT AUTO_INCREMENT,
    title VARCHAR(30),
    salary FLOAT,
    department_id INT,
    PRIMARY KEY (id)
);

CREATE TABLE employee(
    id INT AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    PRIMARY KEY (id)
);

