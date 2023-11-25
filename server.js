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
      choices: ["View all departments", "Add Departments", "View all roles"],
    })
    // different cases for each answer
    .then((answer) => {
      switch (answer.action) {
        case "View all departments":
          viewAllDepartments();
          break;
        case "Add Departments":
          addDepartment();
          break;
        case "View all roles":
          viewAllRoles();
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

// function viewAllRoles() {
//   // Query to select all roles from the roles table. 
//   const query = " SELECT * From role";

//   //  Execute the query 
//   db.query(query, (err, results) => {
//      if( err) {
//       console.error(err);
//       return
//      }
//      console.table(results);
//      init();
//   })
// }


