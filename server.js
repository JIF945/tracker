// immport and require inquirer
const inquirer = require('inquirer');

// import and require connection 
const db = require('./db/connection');

//  import the console table module
require('console.table');


// created array
const taskList = [
{
    type: 'list',
    message: 'Select an option',
    choices: ['view Departments', 'Add department', 'Delete Department', 'View Roles', 'Add Role', 'Delete Role', 'View Employees', 'Add Employee', 'Delete Employee', 'Update Employee Role', 'Update Employee Manager', 'View Employee By Department', 'View Employee by Manager', 'Exit'],
},
];

//  Create a function to initalize app
async function init() {
    try {
        const answers = await inquirer.prompt(taskList);
        switch (answers.task) {
            case 'View Departments':
                await viewDepartment();
                break;
            case 'Add Department':
                 await addDepartment();
                 break;
            case 'Delete Department':
                await deleteDepartment();
                break;
            case 'View Roles':
                await viewRole();
                break;
            case 'Add Role':
                await addRole();
                break;
            case 'Delete Role':
                await deleteRole();
                break;
            case 'View Employees':
                await viewEmployees();
                break;
            case 'Add Employee':
                await addEmployee();
                break;
            case 'Delete Employee':
                await deleteEmployee();
                break;
            case 'Update Employee Role':
                await updateEmployeeRole();
                break;
            case 'View Employee Manager':
                await viewEmployeeManager();
                break;
            case 'View Employee By Department':
                await viewEmployeeByDepartment();
                break;
            case 'View Employee By Manager':
                await viewEmployeeByManager();
                break;
                default:
                console.log('Exiting the application: Bye!');
                process.exit();
        }
    } catch (error) {
        console.error ('Error:', error);
        process.exit();
    }
}

