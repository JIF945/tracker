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
                await viewDepartments();
                break;
            case 'Add Department':
                 await addDepartment();
                 break;
            case 'Delete Department':
                await deleteDepartment();
                break;
            case 'View Roles':
                await viewRoles();
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
async function viewDepartments() {
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
        const [departments] = await db.promise().query('SELECT * FROM department');

        //  list of departments
        const departmentChoices = departments.map(department => department.name);

        //  update task list
        taskList.forEach(task => {
            if(['Add Role', 'Delete Department', 'Add Employee', 'Update Employee Manager', 'View Employee By Department'].includes(task.name)){
                task.choices = departmentChoices;
            }
        });

        console.table(departments);
        init();
    } catch (error) {
        console.error('Cant add department', error);
        init();
    }
}


// Function to delete department

async function deleteDepartment() {
    try {
        const departments = await db.promise().query('SELECT * FROM department');
        const departmentChoices = departments[0].map(department => ({
            name: department.name,
            value: department.id,
        }));

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'departmentId',
                message: 'select which department to delete',
                choices: departmentChoices,
            },
        ]);

        await db.promise().query('Delete FROM department WHERE id = ?', [answers.departmentId]);
        console.log('Department deleted');
        viewDepartment();
    } catch (error) {
        console.error('deleting unsuccessful', error);
        init();
    }
}

// display roles

async function viewRoles() {
    try {

        // quering database
        const [rows, fields] = await db.promise().query('SELECT * FROM role');
        console.log('Displaying roles');
        console.table(rows);

        init();
    } catch (error) {
        console.error('Error', error);

        init();
    }
}

// adding role

async function addRole () {
    try {
        const departments = await db.promise().query('SELECT * FROM department');
        const departmentChoices = departments[0].map(department => ({
            name: department.name,
            value: department.id,
        }));

        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'role',
                message: 'Name of Role?',
                validate: function (input) {
                    if(input.trim() === '') {
                        return 'role cant be empty';
                    }
                    return true;
                },
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Salary of Role?',
                validate: function (input) {
                    if (isNaN(parsedSalary) || parsedSalary <= 0) {
                        return 'invalid salary. postive numbers only';
                    }
                    return true;
                },
            },
            {
                type: 'list',
                name: 'addRoleDepartment',
                message: 'Department Role belongs to?',
                choices: departmentChoices,
            },
        ]);

        await db.promise().query('INSERT INTO role (title, salary, department_id) VALUES (?,?,?)', [answers.roleName, answers.salary, answers.addRoleDepartment]);
        console.log( 'Role added ')
        // displaying roles
        viewRoles();
    } catch (error) {
        console.error('Faile to add role', error);
        init();
    }
}

//  function to delete role
async function deleteRole (){
    try {
        const roles =await db.promise().query('SELECT * FROM role');
        const roleChooices = roles[0].map(role => ({
            name: role.title,
            value: role.id,
        }));

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'roleId',
                message: 'which role will be deleted?',
                choices: roleChooices,
            }
        ]);
// line added to delete role
        await db.promise().query('DELETE FROM role WHERE id = ?', [answers.roleId]);
        console.log('Role deleted');
        viewRoles();
    } catch (error) {
        console.error('Cant delete Role',error);
        init();
    }
}