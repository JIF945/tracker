// immport and require inquirer
const inquirer = require("inquirer");
const cTable = require("console.table");
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "jojames315$",
  database: "employee_db",
});

//  Create a function to initalize app
function init() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: ["View All Departments", "Add Departments", "View All Roles", "Add Role", "View All Employees", "Add Employee"],
    })
    // different cases for each answer
    .then((answer) => {
      switch (answer.action) {
        case "View All Departments":
          viewAllDepartments();
          break;
        case "Add Departments":
          addDepartment();
          break;
        case "View All Roles":
          viewAllRoles();
          break;
        case "Add Role":
          addRole();
          break;
        case "View All Employees":
          viewAllEmployees();
          break;
        case "Add Employee":
          addEmployee();
      }
    });
}

function viewAllDepartments() {
  // Query to select all departments from the 'department' table
  const query = "SELECT * FROM department";

  // Execute the query
  db.query(query, (err, results) => {
    if (err) {
      console.error(err); // Log the error
      return;
    }
    // Display the departments using console.table
    console.table(results);
    init();
  });
}

function addDepartment() {
  try {
    inquirer
      .prompt([
        {
          type: "input",
          name: "departmentName",
          message: "Name of Department?",
          validate: function (input) {
            if (input.trim() === "") {
              return "Department name cant be empty.";
            }
            return true;
          },
        },
      ])
      .then((answer) => {
        const departmentName = answer.departmentName;
        console.log(departmentName);
        db.query("INSERT INTO department (department_name) VALUES (?)", [departmentName ]);
        console.log("Department Added");
        init();
      });
   
  } catch (error) {
    console.error("Cant add department", error);
  }
}


function viewAllRoles() {
  // query to select all roles from the roles table. 
  const query = " SELECT * From role";

  //  Execute the query 
  db.query(query, (err, results) => {
     if( err) {
      console.error(err);
      return
     }
     console.table(results);
     init();
  })
}

// function to add roles

function addRole () {
  try {
    inquirer
    .prompt([
      {
        type: "input",
        name: 'title',
        message: " Name of new Title",
        validate: function (input) {
          if (input.trim() === "") {
            return " New title can not be blank"
          }
          return true;
        }
      },
      {
        type: "input",
        name: "department_id",
        message: "What department will the new role be in?",
        validate: function (input) {
          if (input.trim() === "") {
            return " department can not be added"
          }
          return true;
        },
      },
      {
        type: "input",
        name: "salary",
        message: " what is the salary for the new role",
        validate: function (input) {
          if (input.trim() === "") {
              return " Salary can not be added"
          }
          return true;
        }
      }
    ])
    .then((answer) => {
      const title = answer.title;
      const department_id = answer.department_id;
      const salary = answer.salary;
      console.log(title);
      console.log(salary);
      console.log(department_id);
      db.query("INSERT INTO role ( title, department_id, salary) VALUES (?, ?, ?)", [title, department_id, salary],
      (err, result) => {
        if (err) {
          console.error("Enter adding role", err);
          return;
        }
        console.log("Role Added");
        init();
      });
    });
  } catch (error){
    console.error("Error adding role", error);
  }
}


function viewAllEmployees() {
  // Query to select all employees from the employee table
  const query = "SELECT * FROM employee";

  // Execute the query
  db.query(query, (err, results) => {
    if(err) {
      console.error(err);
      return;
    }
    // displaying the employees using console.table
    console.table(results);
    init(); 
  })
}

function addEmployee() {
  try {
  inquirer.prompt([
    {
      type: "input",
      name:"first_name",
      message: " what is the employees first name",
      validate: function (input) {
        if (input.trim()=== "") {
          return "First name can not be blank"
        }
          return true;
      },
    },
    {
      type: "input",
      name: "last_name",
      message: " What is the employess last name",
      validate: function(input) {
        if (input.trim()=== "") {
          return " last name cant not be blank"
        }
          return true;
      },
    },
    {
      type: "list",
      name: "role_id",
      message: "select the empoyes role:",
      choices: addRole(role => ({name:role.title, value: role.department_id}))
    },
    {
      type: "input",
      name: "manager_id",
      message: " whos the employees new manager",
      validate: function(input) {
        if (input.trim()=== ""){
          return "manager can not be blank"
        }
         return true;
      }
    }
  ])
    .then((answer) => {
      const firstName = answer.first_name;
      const lastName = answer.las_name;
      const managerid = answer.manager_id;
      console.log(firstName);
      console.log(lastName);
      console.log(managerid);
      db.query("INSERT INTO Employee ( first_name, last_name, manager_id) VALUES (?,?,?,)",[firstName, lastName, managerid],
      (err, result) => {
        if (err) {
          console.error ("Enter adding employee", err);
          return;
        }
        console.log("employee added");
        init();
      });
    });
  } catch (error){
    console.error("Error adding employee", error);
  }
}

init();

