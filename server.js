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
      choices: ["View All Departments", "Add Departments", "View All Roles", "Add Role", "View All Employees", "Add Employee", "Modify Employee", "Exit"],
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
          break;
          case "Modify Employee":
          modifyEmployee();
          break;
          case "Exit":
            console.log("Goodbye ");
            process.exit();
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
      type: "input",
      name: "role_id",
      message: "select the employees role:",
      choices: db.viewAllRoles
    },
    {
      type: "input",
      name: "manager_id",
      message: " whos the employees manager",
      validate: function(input) {
        if (input.trim()=== ""){
          return "manager can not be blank"
        }
         return true;
      }
    }
  ])
    .then((answer) => {
      const first_name = answer.first_name;
      const last_name = answer.last_name;
      const role_id = answer.role_id;
      const manager_id = answer.manager_id;
      console.log(first_name);
      console.log(last_name);
      console.log(role_id);
      console.log(manager_id);
      db.query("INSERT INTO Employee ( first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)",[first_name, last_name, role_id, manager_id],
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

// modify employee

function modifyEmployee() {
  db.promise()
    .query("SELECT * FROM employee")
    .then((rows) => {
      const employees = rows[0];
      const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      }));



        db.promise()
        .query("SELECT * FROM role")
        .then((rows) => {
          const roles = rows[0];
          const roleChoices = roles.map(({ id, title }) => {
            return {
              name: title,
              value: id
            }
          });

          try {
            inquirer
              .prompt([
                {
                  type: "list",
                  name: "employee",
                  message: "Select an employee to modify",
                  choices: employeeChoices,
                },
                {
                  type: "list",
                  name: "newRole",
                  message: "Select the employee's new role",
                  choices: roleChoices,
                },
                {
                  type: "input",
                  name: "newManager",
                  message: "Enter the employee's new manager",
                },
              ])
              .then((answer) => {
                const employee = answer.employee;
                const newManager = answer.newManager;
                const newRole = answer.newRole;

                db.query(
                  "UPDATE employee SET manager_id = ?, role_id = ? WHERE id = ?",
                  [newManager, newRole, employee],
                  (err, result) => {
                    if (err) {
                      console.error("Error modifying employee", err);
                      return;
                    }
                    console.log("Employee modified");
                    init();
                  }
                );
              });
          } catch (error) {
            console.error("Error modifying employee", error);
          }
        });
    });
}

  

init();

