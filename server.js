require('dotenv').config();
const inquirer = require('inquirer');
const { Pool } = require('pg');
const cTable = require('console.table');

// Create Connection to Database
const pool = new Pool({
  user: process.env.DB_USER,         
  host: process.env.DB_HOST,       
  database: process.env.DB_DATABASE, 
  password: process.env.DB_PASSWORD,             
  port: process.env.DB_PORT,               
});

pool.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to the my_company_db database!');
  startTracker();
});

// Function that opens company tracker and prompts user with options
function startTracker() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'prompt',
      message: 'What would you like to do?',
      choices: [
        'View all departments', 
        'View employees by department', 
        'Add department', 
        'View all roles', 
        'View roles by manager', 
        'Add role', 
        'View all employees', 
        'Add employee', 
        'Update employee role', 
        'Quit'
      ]
    }
  ]).then((answer) => {
    switch (answer.prompt) {
      case 'View all departments':
        viewDepartments();
        break;
      case 'View all roles':
        viewRoles();
        break;
      case 'View all employees':
        viewEmployees();
        break;
      case 'View roles by manager':
        viewRoleByManager();
        break;
      case 'View employees by department':
        viewEmployeesByDepartment();
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
      case 'Update employee role':
        updateRole();
        break;
      case 'Quit':
        console.log('Good Bye!');
        pool.end();
        break;
    }
  });
}

// Function to View Departments
function viewDepartments() {
  const sql = `SELECT id, department_name AS department FROM department;`;
  pool.query(sql, (err, res) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(res.rows);
    startTracker();
  });
};

// Function to View Roles
function viewRoles() {
  const sql = `SELECT role.id, role.title AS role, role.salary, department.department_name AS department 
               FROM role 
               INNER JOIN department ON department.id = role.department_id;`;
  pool.query(sql, (err, res) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(res.rows);
    startTracker();
  });
};

// Function to View Employees
function viewEmployees() {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, 
                      department.department_name AS department, role.salary, 
                      CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
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
    startTracker();
  });
};

// Function to Add A Department
function addDepartment() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'department',
      message: 'What is the name of the department?',
    }
  ]).then((answer) => {
    const sql = `INSERT INTO department (department_name) VALUES($1);`;
    pool.query(sql, [answer.department], (err, res) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Added " + answer.department + " to the database");
      startTracker();
    });
  });
};

// Function to Add a Role
function addRole() {
  const sql = `SELECT * FROM department;`;
  pool.query(sql, (err, res) => {
    if (err) {
      console.log(err);
      return;
    }
    const departmentList = res.rows.map(department => ({
      name: department.department_name,
      value: department.id
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
        choices: departmentList
      }
    ]).then((answers) => {
      const sql = `INSERT INTO role (title, salary, department_id) VALUES($1, $2, $3);`;
      pool.query(sql, [answers.title, answers.salary, answers.department], (err, res) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Added " + answers.title + " to the database");
        startTracker();
      });
    });
  });
};

// Function to Add an Employee
function addEmployee() {
  const sqlEmployee = `SELECT * FROM employee;`;
  pool.query(sqlEmployee, (err, res) => {
    if (err) {
      console.log(err);
      return;
    }
    const employeeList = res.rows.map(employee => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id
    }));

    const sqlRole = `SELECT * FROM role;`;
    pool.query(sqlRole, (err, res) => {
      if (err) {
        console.log(err);
        return;
      }
      const roleList = res.rows.map(role => ({
        name: role.title,
        value: role.id
      }));
      inquirer.prompt([
        {
          type: 'input',
          name: 'first',
          message: "What is the employee's first name?",
        },
        {
          type: 'input',
          name: 'last',
          message: "What is the employee's last name?",
        },
        {
          type: 'list',
          name: 'role',
          message: "What is the employee's role?",
          choices: roleList
        },
        {
          type: 'list',
          name: 'manager',
          message: "Who is the employee's manager?",
          choices: employeeList
        }
      ]).then((answers) => {
        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
                     VALUES($1, $2, $3, $4);`;
        pool.query(sql, [answers.first, answers.last, answers.role, answers.manager], (err, res) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log("Added " + answers.first + " " + answers.last + " to the database");
          startTracker();
        });
      });
    });
  });
};

// Function to Update a Role
function updateRole() {
  const sqlEmployee = `SELECT * FROM employee;`;
  pool.query(sqlEmployee, (err, res) => {
    if (err) {
      console.log(err);
      return;
    }
    const employeeList = res.rows.map(employee => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id
    }));

    const sqlRole = `SELECT * FROM role;`;
    pool.query(sqlRole, (err, res) => {
      if (err) {
        console.log(err);
        return;
      }
      const roleList = res.rows.map(role => ({
        name: role.title,
        value: role.id
      }));
      inquirer.prompt([
        {
          type: 'list',
          name: 'employee',
          message: "Which employee's role do you want to update?",
          choices: employeeList
        },
        {
          type: 'list',
          name: 'role',
          message: "Which role do you want to assign the selected employee?",
          choices: roleList
        },
        {
          type: 'list',
          name: 'manager',
          message: "Who will be this employee's manager?",
          choices: employeeList
        }
      ]).then((answers) => {
        const sql = `UPDATE employee 
                     SET role_id = $1, manager_id = $2 
                     WHERE id = $3;`;
        pool.query(sql, [answers.role, answers.manager, answers.employee], (err, res) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log("Employee role updated");
          startTracker();
        });
      });
    });
  });
};