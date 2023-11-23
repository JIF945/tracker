-- drop and create, if database exist drop it, db doesnt exist create the db.

DROP DATABASE IF EXISTS employees_db;

CREATE DATABASE employees_db;



-- table for department
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

-- Table for role
CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT NOT NULL
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE CASCADE
);

-- Table for employee
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    FOREIGN KEY (role_id)
    REFERENCES role(id)
    ON DELETE CASCADE,
    manager_id INT,
    FOREIGN Key (manager_id)
    REFERENCES employee(id)
    ON DELETE SET NULL
);

module.exports = table;