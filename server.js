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
            case 'Update Employee Manager':
                await updateEmployeeManager();
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

// deplaying departments
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
// main menu
        init();
    }
}

// adding role function 

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
        console.error('Failure to add role', error);
        init();
    }
}

//  function to delete role
async function deleteRole (){
    try {
        const roles =await db.promise().query('SELECT * FROM role');
        const roleChoices = roles[0].map(role => ({
            name: role.title,
            value: role.id,
        }));

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'roleId',
                message: 'which role will be deleted?',
                choices: roleChoices,
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

//  function to view employees

async function viewEmployees (){
    try {
        const [rows, fields] = await db.promise().query(`
        SELECT e.id, e.first_name, e.last_name, r.title AS title, d.name AS department, r.salary, CONCAT(m.first_name,"", m.last_name) AS manager
        FROM employee e
        LEFT JOIN role r ON e role_id = r.id
        LEFT JOIN department d ON r department_id = d.id
        LEFT JOIN employee m ON e.manger_id = m.id`);

        console.log('Displaying employees.');
        console.table(rows);
        init();
    } catch (error) {
        console.error('error, cant show employees', error);
        init();
    }
}

//  function to add new employees
 async function addEmployee() {
    try {
        const roles = await db.promise().query('SELECT * FROM role');
        const managers = await db.promise().query('SELECT * FROM employee WHERE manager_id IS NULL');

        const roleChoices = roles[0].map(role => ({
            name: role.title,
            value: role.id,
        }));

        // manager choices array
        const managerChoices = [
            ...managers[0].map(manager => ({
                name: `${manager.first_name} ${manager.last_name}`,
                value: manager.id,
            })),
            {
                name: 'None',
                value: null,
            },
        ];

        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message:' Employess first name?',
            },
            {
                type: 'input',
                name:'lastName',
                message:'Employees last_name?',
            },
            {
                type: 'list',
                name:' employeeRole',
                message: 'Employess role?',
                choices: roleChoices,
            },
            {
                type: 'list',
                name: 'employeeManager',
                message: 'Employess manager?',
                choices: managerChoices,
            },
        ]);

        const result = await db.promise().query('INSERT INTO employee (first_name, last_name, role_id, manger_id) VALUES (?,?,?)', [answers.first_name, answers.last_name, answers.employeRole, answers.employeManager])
        console.log('employee added');
        viewEmployees();
    } catch (error) {
        console.error('error adding employee, please try again', error);
        init();
        }
    }

//     fucntion to delete employee

async function deleteEmployee () {
    try {
        const employees = await db.promise().query('SELECT * FROM employee');
        const employeeChoices = employees[0].map(employee => ({
            name:`${employee.first_name} ${employee.last_name}`,
            value: employee.id,
        }))

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: ' employeeId',
                message: 'Delete what employee',
                choices: employeeChoices
            }
        ])

        await db.promise().query('DELETE FROM employee WHERE id = ?', [answers.employeeeId]);
        console.log('employee deleted')
        viewEmployees();
    } catch (error) {
        console.error('error deleteing employing, please try again', error);
        init();
    }
}
   
   
    //  function to update an employes's role

    async function updateEmployeeRole () {
        try {
            const employees = await db.promise().query().query('SELECT * FROM employee');
            const roles = await db.promise().query('SELECT * FROM role ');

            const employeeChoices = employees[0].map(employee => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
            }));

            const roleChoices = roles[0].map(role => ({
                name: role.title,
                value: role.id,
            }));

            const answers = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeId',
                    message: ' what employee role do you want to update',
                    choices: employeeChoices,
                },
                {
                    type: 'list',
                    name: 'newRole',
                    message:' Employess new role?',
                    choices: roleChoices,
                },
            ]);

            await db.promise().query('UPDATE employee SET role_id = ? WHERE id = ?', [answers.newRole, answers.employeeId]);
            console.log('Employee Role updated');
            viewEmployees();
        } catch (error) {
            console.error('error updating employeee role, please try again', error);
            init();
        }
    }

    // updating employees manager function 

async function updateEmployeeManager (){
    try {
        const employee = await db.promise().query('SELECT * FROM employee');
        const managers = await db.promise().query('SELECT * FROM employee WHERE manager_id is NULL');

        const employeeChoices = employee[0].map(employee => ({
            name:  `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
        }));

        // managers choices array
        const managerChoices = [
            ...managers[0].map(manager => ({
                name: `${manager.first_name} ${manager.last_name} `,
                value: manager.id,
            })),
            {
                name: 'None',
                value: null, 
            },
        ];

        const answers = await inquirer.prompt ([
            {
                type: 'list',
                name: 'employeeId',
                message:'what employee manager would you like to update?',
                choices: employeeChoices,
            },
            {
                type: 'list',
                name: 'newManager',
                message: ' Employees new manager',
                choices: managerChoices,
            },
        ]);

        await db.promise().query ('UPDATE employee SET manager_id = ? WHERE id = ?,', [answers.newManager, answers.employeeId]);
        console.log('Employees Manager updated');
        viewEmployees();
    } catch (error) {
        console.error('Error updated employess manager, please try again', error);
        init();
    }
}

// View employee by department 

async function viewEmployeeByDepartment () {
    try {
        const [rows, fields] = await db.promise().query(`
        SELECT d.name AS department, e.first_name e.last_name, r.title AS title
        FROM employee e
        JOIN role r ON e.role_id = r.id
        JOIN department d ON r.department_id = d.id`);

        console.log('Displaying employess by department');
        console.table(rows);
        init();
    } catch (error) {
        console.error('Error viewing employess by department, please try again', error)
        init();
    }
}

//  view employee manager function
async function viewEmployeeByManager () {
    try {
        const [rows, fields] = await db.promise().query(`
        SELECT CONCAT( m.first_name, '', m.last_name) AS manager_name, e.first_name, e.last_name, r.title AS title
        FROM employee e
        LEFT JOIN employee m ON e. manager_id = m.id
        JOIN role r on e.role_id = r.id`);

        console.log('Displaying employess by manager ')
        console.table(rows);
        init();
    } catch (error) {
        console.error('Error viewing employess by manager, please try again', error);
    }
}


// function to call 
init ();
