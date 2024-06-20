// Include packages and assign them to variables
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

require('dotenv').config();

// Create Connection to Database
const db = mysql.createConnection(
    {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    console.log('connected to the database')
);

// Function that opens company tracker and prompts user with options 
const tracker = () => {
        inquirer.prompt([
            {
                type: 'list',
                name: "prompt",
                message: "What would you like to do?",
                choices: ['View all departments', 'View employees by department', 'Add department','delete department', 'View all roles', 'View roles by manager',  'Add role', 'delete role', 'View all employees', 'Add employee',  'delete employee', 'update employee role', 'quit']
            }
        ]).then((data) => {
            switch(data.prompt){
                case 'View all departments':
                    viewDepartments();
                    break;
                case 'View all roles':
                    viewRoles();
                    break;
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'view roles by manager':
                    viewRoleByManager();
                    break;
                case 'view employees by department':
                    viewEmployeesByDepartment();
                    break;
                case 'delete department':
                    deleteDepartment();
                    break;
                case 'delete role':
                    deleteRole();
                    break;
                case 'delete employee':
                    deleteEmployee();
                    break;
                case 'Add department':
                    addDepartment();
                    break;
                case 'Add role':
                    addRole();
                    break;
                case 'Add employee':
                    addEmployee();
                    break;
                case 'update employee role':
                    updateEmployee();
                    break;
                case 'quit':
                    quit();
                    break;
            }
        });
    };

// View all Departments
const viewDepartments = () => {
        db.query('SELECT * FROM departments', async function (err, results) {
        const table = await cTable.getTable(results);
        console.log(table);
        tracker();
    });

};

// View all
const viewRoles = () => {
    db.query('SELECT * FROM roles LEFT JOIN departments ON roles.department_id = departments.id', async function (err, results) {
        const table = await cTable.getTable(results);
        console.log(table);
        tracker();
    });   
};

const viewEmployees = () => {
    db.query("SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department_name AS department, roles.salary FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id;", async function (err, results) {
        if(err){
            console.log(err);
            tracker();
        } else {
            const table = await cTable.getTable(results);
            console.log(table);
            tracker();
        }
    });
};

const addDepartment = () => {
        inquirer.prompt([
            {
                type: 'input',
                name: 'newDepartment',
                message: 'What department would you like to add?'
            }
        ]).then((data) => {
            db.query('INSERT INTO departments(department_name) VALUES (?)', data.newDepartment, async function (err, results) {
                await console.log(`${data.newDepartment} added to departments!`);
                tracker();
            } );
        });
    };

const addRole = () => {
        inquirer.prompt([
            {
                type: 'input',
                name: 'newRole',
                message: 'What is the title of the role would you like to add?'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of this role?'
            },
            {
                type: 'input',
                name: 'department',
                message: 'what is the department id for this role?'
            }
        ]).then((data) => {
            db.query('INSERT INTO roles(title, salary, department_id) VALUES (?,?,?)', [data.newRole, data.salary, data.department], async function (err, results) {
                await console.log(`${data.newRole} added to roles!`);
                tracker();
            } );
        });
    };



    const addEmployee = () => {
        inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'What is the first name of the employee you would like to add?'
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'What is the last name of the employee you would like to add?'
            },
            {
                type: 'input',
                name: 'role',
                message: 'what is the role id for this employee?'
            },
            {
                type: 'input',
                name: 'manager',
                message: 'What is the manager id for this employee ? (if applicable)'
            }
        ]).then((data) => {
            db.query('INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)', [data.firstName, data.lastName, data.role, data.manager], async function (err, results) {
                await console.log(`${data.firstName} added to roles!`);
                tracker();
            } );
        });
    };

const viewRoleByManager = () => {

};

const viewEmployeesByDepartment = () => {
    db.query('SELECT ')
};

const deleteDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'What is the id of the department you want to delete?'
        }
    ]).then((data) => {
        
        db.query('DELETE FROM departments WHERE id = ?', data.department, async (err, result) => {
            if (err){
                console.log(err);
            } else {
                await console.log('Successfully deleted department');
                tracker();
            }
        })
    })
};

const deleteEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'What is the first name of the employee you want to delete?'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is the last name of the employee you want to delete?'
        }
    ]).then((data) => {
        db.query(`DELETE FROM employee WHERE first_name = ? AND last_name = ?`, [data.firstName, data.lastName], (err, result) => {
            if (err){
                console.log(err);
            } else {
                console.log('Successfully deleted employee');
            }
        })
    }).then(() => tracker())
};

const deleteRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: 'What is the id of the role you want to delete?'
        }
    ]).then((data) => {
        
        db.query('DELETE FROM roles WHERE id = ?', data.id, async (err, result) => {
            if (err){
                console.log(err);
            } else {
                await console.log('Successfully deleted role');
                tracker();
            }
        })
    })    
}

const updateEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'What is the first name of the employee you want to update?'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is the last name of the employee you want to update?'
        },
        {
            type: 'input',
            name: 'role',
            message: 'What is the new role id for this emloyee?'
        }
    ]).then((data) => {
        db.query('UPDATE employees SET role_id = ? WHERE first_name = ? AND last_name = ?', [data.role, data.firstName, data.lastName], async (err, result) => {
            if(err){
                console.log(err);
            } else {
                console.log('Successfully update employee role')
            }
        })
    }).then(() => tracker());
};

function quit() {
        console.log("\nGoodbye!");
        process.exit();
      };


tracker();