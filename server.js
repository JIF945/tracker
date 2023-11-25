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
      choices: ["View All Departments", "Add Departments", "View All Roles", "Add Role"],
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
init();

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
        name: "roleName",
        message: "Name of New Role?",
        validate: function (input) {
          if (input.trim() === "") {
            return " Role name cant be blank.";
          }
          return true;
        },
      },
    ])
    .then((answer) => {
      const roleName = answer.roleName;
      const title = answer.title;
      const salary = answer.salary;
      const departmentid = answer.departmentid
      console.log(roleName);
      db.query("INSERT INTO role (title),(salary),(department_id)  VALUES (?,?,?)", [roleName], [title], [salary], departmentid);
      console.log("Role Added");
      init();
    })
  } catch (error){
    console.error("Error adding role", error);
  }
}

init();

