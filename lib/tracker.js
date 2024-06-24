const inquirer = require('inquirer');
const cTable = require('console.table');

class Tracker {
  constructor(pool) {
    this.pool = pool;
  }

 // View all departments
  async viewDepartments(callback) {
    try {
      const res = await this.pool.query('SELECT * FROM departments');
      console.table(res.rows);
      callback();
    } catch (err) {
      console.error(err);
      callback();
    }
  }

  // View all roles
  async viewRoles(callback) {
    try {
      const res = await this.pool.query('SELECT roles.id, roles.title, roles.salary, departments.department_name AS department FROM roles LEFT JOIN departments ON roles.department_id = departments.id');
      console.table(res.rows);
      callback();
    } catch (err) {
      console.error(err);
      callback();
    }
  }

  // View all employees
  async viewEmployees(callback) {
    try {
      const res = await this.pool.query(`SELECT employees.id, employees.first_name, employees.last_name, roles.title, 
                                        departments.department_name AS department, roles.salary 
                                        FROM employees 
                                        LEFT JOIN roles ON employees.role_id = roles.id 
                                        LEFT JOIN departments ON roles.department_id = departments.id`);
      console.table(res.rows);
      callback();
    } catch (err) {
      console.error(err);
      callback();
    }
  }

  // Add a department
  async addDepartment(callback) {
    const { newDepartment } = await inquirer.prompt([
      {
        type: 'input',
        name: 'newDepartment',
        message: 'What department would you like to add?'
      }
    ]);
    try {
      await this.pool.query('INSERT INTO departments(department_name) VALUES ($1)', [newDepartment]);
      console.log(`${newDepartment} added to departments!`);
      callback();
    } catch (err) {
      console.error(err);
      callback();
    }
  }

  // Add a role
  async addRole(callback) {
    const { newRole, salary, department } = await inquirer.prompt([
      {
        type: 'input',
        name: 'newRole',
        message: 'What is the title of the role you would like to add?'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'What is the salary of this role?'
      },
      {
        type: 'input',
        name: 'department',
        message: 'What is the department id for this role?'
      }
    ]);
    try {
      await this.pool.query('INSERT INTO roles(title, salary, department_id) VALUES ($1, $2, $3)', [newRole, salary, department]);
      console.log(`${newRole} added to roles!`);
      callback();
    } catch (err) {
      console.error(err);
      callback();
    }
  }

  // Add an employee
  async addEmployee(callback) {
    const { firstName, lastName, role, manager } = await inquirer.prompt([
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
        message: 'What is the role id for this employee?'
      },
      {
        type: 'input',
        name: 'manager',
        message: 'What is the manager id for this employee? (if applicable)'
      }
    ]);
    try {
      await this.pool.query('INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [firstName, lastName, role, manager]);
      console.log(`${firstName} ${lastName} added to employees!`);
      callback();
    } catch (err) {
      console.error(err);
      callback();
    }
  }

  // View employees by department
  async viewEmployeesByDepartment(callback) {
    try {
      const res = await this.pool.query(`SELECT departments.department_name, employees.first_name, employees.last_name 
                                        FROM employees 
                                        JOIN roles ON employees.role_id = roles.id 
                                        JOIN departments ON roles.department_id = departments.id 
                                        ORDER BY departments.department_name`);
      console.table(res.rows);
      callback();
    } catch (err) {
      console.error(err);
      callback();
    }
  }

  // Update employee role
  async updateEmployee(callback) {
    const { firstName, lastName, role } = await inquirer.prompt([
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
        message: 'What is the new role id for this employee?'
      }
    ]);
    try {
      await this.pool.query('UPDATE employees SET role_id = $1 WHERE first_name = $2 AND last_name = $3', [role, firstName, lastName]);
      console.log('Successfully updated employee role');
      callback();
    } catch (err) {
      console.error(err);
      callback();
    }
  }
}

module.exports = Tracker;
