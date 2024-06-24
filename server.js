const inquirer = require('inquirer');
const { Pool } = require('pg');
const cTable = require('console.table');
const Tracker = require('./lib/tracker'); // Import the Tracker class

// Create Connection to Database
const pool = new Pool({
  user: 'postgres',         // PostgreSQL username
  host: 'localhost',        // Database host
  database: 'my_company_db', // Correct database name
  password: 'Cfm578ry!',    // PostgreSQL password
  port: 5432,               // Default PostgreSQL port
});

console.log('Connected to the my_company_db database!');

// Initialize the Tracker class
const tracker = new Tracker(pool);

// Function that opens company tracker and prompts user with options
function startTracker() {
  inquirer.prompt([
    {
      type: 'list',
      name: "prompt",
      message: "What would you like to do?",
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
        tracker.viewRoleByManager(startTracker);
        break;
      case 'View employees by department':
        tracker.viewEmployeesByDepartment(startTracker);
        break;
      case 'Add department':
        tracker.addDepartment(startTracker);
        break;
      case 'Add role':
        tracker.addRole(startTracker);
        break;
      case 'Add employee':
        tracker.addEmployee(startTracker);
        break;
      case 'Update employee role':
        tracker.updateEmployee(startTracker);
        break;
      case 'Quit':
        quit();
        break;
    }
  });
}

//Function to view Departments
function viewDepartments () {
    const sql  = 'SELECT department.id, department.name AS Department FROM department;'
   pool.query(sql, (err, res)=> {
        if (err){
            console.log(err);
            return;
        }
        //Access the rows property for results
        console.table(res.rows);
        startTracker();
    });
}

//Function to view Roles

// Quit the application
function quit() {
  console.log("\nGoodbye!");
  pool.end();
  process.exit();
}

// Initialize the application
startTracker();
