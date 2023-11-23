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

// deplaying departments using db connection
async function viewDepartment() {
    try {
        const [rows, fields] = await db.promise().query('SELECT * FROM department');
        console.log('Displaying Departments');
        console.table(rows);
        init();
    } catch (error) {
        console.error('Cant show departments', error);
        init();
    }
}

//  Add new department with user input and db connection 
async function addDepartment () {
    try {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'departmentName',
                message: 'Name of Department?',
                validate: function (input) {
                    if (input.trim() === '') {
                        return 'Department name cant be empty.';
                    }
                    return true;
                },
            },
        ]);

// insert department in to database
        await db.promise().query('INSERT INTO department (name) VALUES (?)', [answers.departmentName]);
        console.log('Department Added');

        // fetch departments after insertion
        const [department] = await db.promise().query('SELECT * FROM department');

        //  list of departments
        const departmentChoices = department.map(department => department.name);

        //  update task list
        taskList.forEach(task => {
            if(['Add Role', 'Delete Department', 'Add Employee', 'Update Employee Manager', 'View Employee By Department'].includes(task.name)){
                task.choices = departmentChoices;
            }
        });

        console.table(department);
        init();
    } catch (error) {
        console.error('Cant add department', error);
        init();
    }
}
