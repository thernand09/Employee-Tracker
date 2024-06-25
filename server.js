require('dotenv').config();
const inquirer = require('inquirer');
const { Pool } = require('pg');
const cTable = require('console.table');

// Create Connection to Database
const pool = new Pool({
  user: '',         // PostgreSQL username
  host: 'localhost',        // Database host
  database: 'my_company_db', // Correct database name
  password: '',             // PostgreSQL password
  port: 5432,               // Default PostgreSQL port
});

pool.connect();

console.log('Connected to the my_company_db database!');

// Tracker object containing all methods for different operations
const tracker = {
  viewDepartments: function (callback) {
    const sql = 'SELECT department.id, department.department_name AS Department FROM department;';
    pool.query(sql, (err, res) => {
      if (err) {
        console.log(err);
        return;
      }
      console.table(res.rows);
      callback();
    });
  },
  
  viewRoles: function (callback) {
    const sql = 'SELECT role.id, role.title AS Role, role.salary, department.department_name AS Department FROM role INNER JOIN department ON department.id = role.department_id;';
    pool.query(sql, (err, res) => {
      if (err) {
        console.log(err);
        return;
      }
      console.table(res.rows);
      callback();
    });
  },
  
  viewEmployees: function (callback) {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS Role, department.department_name AS Department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager 
                 FROM employee 
                 LEFT JOIN employee manager ON manager.id = employee.manager_id 
                 INNER JOIN role ON role.id = employee.role_id 
                 INNER JOIN department ON department.id = role.department_id 
                 ORDER BY employee.id;`;
    pool.query(sql, (err, res) => {
      if (err) {
        console.log(err);
        return;
      }
      console.table(res.rows);
      callback();
    });
  },
  
  addDepartment: function (callback) {
    inquirer.prompt([
      {
        type: 'input',
        name: 'department',
        message: 'What is the name of the department?',
      }
    ]).then((answer) => {
      const sql = 'INSERT INTO department (department_name) VALUES($1);';
      pool.query(sql, [answer.department], (err, res) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(`Added ${answer.department} to the database`);
        callback();
      });
    });
  },
  
  addRole: function (callback) {
    const sql = 'SELECT * FROM department;';
    pool.query(sql, (err, res) => {
      if (err) {
        console.log(err);
        return;
      }
      const departmentList = res.rows.map(department => ({
        name: department.department_name,
        value: department.id,
      }));
      inquirer.prompt([
        {
          type: 'input',
          name: 'title',
          message: 'What is the name of the role?',
        },
        {
          type: 'input',
          name: 'salary',
          message: 'What is the salary of the role?',
        },
        {
          type: 'list',
          name: 'department',
          message: 'Which Department does the role belong to?',
          choices: departmentList,
        }
      ]).then((answers) => {
        const sql = 'INSERT INTO role (title, salary, department_id) VALUES($1, $2, $3);';
        pool.query(sql, [answers.title, answers.salary, answers.department], (err, res) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log(`Added ${answers.title} to the database`);
          callback();
        });
      });
    });
  },
  
  // Define other methods like viewRoleByManager, viewEmployeesByDepartment, addEmployee, updateEmployee
  
  quit: function () {
    console.log("\nGoodbye!");
    pool.end();
    process.exit();
  }
};

// Function that opens company tracker and prompts user with options
function startTracker() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'prompt',
      message: 'What would you like to do?',
      choices: ['View all departments', 'View employees by department', 'Add department', 'View all roles', 'View roles by manager', 'Add role', 'View all employees', 'Add employee', 'Update employee role', 'Quit']
    }
  ]).then((data) => {
    switch (data.prompt) {
      case 'View all departments':
        tracker.viewDepartments(startTracker);
        break;
      case 'View all roles':
        tracker.viewRoles(startTracker);
        break;
      case 'View all employees':
        tracker.viewEmployees(startTracker);
        break;
      case 'View roles by manager':
        // tracker.viewRoleByManager(startTracker);
        break;
      case 'View employees by department':
        // tracker.viewEmployeesByDepartment(startTracker);
        break;
      case 'Add department':
        tracker.addDepartment(startTracker);
        break;
      case 'Add role':
        tracker.addRole(startTracker);
        break;
      case 'Add employee':
        // tracker.addEmployee(startTracker);
        break;
      case 'Update employee role':
        // tracker.updateEmployee(startTracker);
        break;
      case 'Quit':
        tracker.quit();
        break;
    }
  });
}

// Initialize the application
startTracker();
