-- drop and create, if database exist drop it, db doesnt exist create the db.

DROP DATABASE IF EXISTS employees_db;

CREATE DATABASE employees_db;



-- table for department
CREATE TABLE department (
    id INT PRIMARY KEY,
    department_name VARCHAR(30),
);

-- Table for role
CREATE TABLE role (
    id INT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    
);

-- Table for employee
CREATE TABLE employee (
    id INT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NOT NULL,
    manager_id INT,
    
);

