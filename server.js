require('dotenv').config();
const inquirer = require('inquirer');
const {
  getDepartments,
  getRoles,
  getEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
} = require('./config/queries');

const start = () => {
  inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role',
      'Exit',
    ],
  }).then((answer) => {
    switch (answer.action) {
      case 'View all departments':
        viewDepartments();
        break;
      case 'View all roles':
        viewRoles();
        break;
      case 'View all employees':
        viewEmployees();
        break;
      case 'Add a department':
        promptAddDepartment();
        break;
      case 'Add a role':
        promptAddRole();
        break;
      case 'Add an employee':
        promptAddEmployee();
        break;
      case 'Update an employee role':
        promptUpdateEmployeeRole();
        break;
      case 'Exit':
        console.log('Goodbye!');
        process.exit();
        break;
    }
  });
};

const viewDepartments = async () => {
  const departments = await getDepartments();
  console.table(departments);
  start();
};

const viewRoles = async () => {
  const roles = await getRoles();
  console.table(roles);
  start();
};

const viewEmployees = async () => {
  const employees = await getEmployees();
  console.table(employees);
  start();
};

const promptAddDepartment = () => {
  inquirer.prompt({
    name: 'name',
    type: 'input',
    message: 'Enter the department name:',
  }).then(async (answer) => {
    await addDepartment(answer.name);
    console.log(`Added department: ${answer.name}`);
    start();
  });
};

const promptAddRole = async () => {
  const departments = await getDepartments();
  const departmentChoices = departments.map(({ id, name }) => ({ name, value: id }));

  inquirer.prompt([
    {
      name: 'title',
      type: 'input',
      message: 'Enter the role title:',
    },
    {
      name: 'salary',
      type: 'input',
      message: 'Enter the role salary:',
    },
    {
      name: 'department_id',
      type: 'list',
      message: 'Select the department:',
      choices: departmentChoices,
    },
  ]).then(async (answer) => {
    await addRole(answer.title, answer.salary, answer.department_id);
    console.log(`Added role: ${answer.title}`);
    start();
  });
};

const promptAddEmployee = async () => {
  const roles = await getRoles();
  const employees = await getEmployees();

  const roleChoices = roles.map(({ id, title }) => ({ name: title, value: id }));
  const managerChoices = employees.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
  managerChoices.unshift({ name: 'None', value: null });

  inquirer.prompt([
    {
      name: 'first_name',
      type: 'input',
      message: 'Enter the employee\'s first name:',
    },
    {
      name: 'last_name',
      type: 'input',
      message: 'Enter the employee\'s last name:',
    },
    {
      name: 'role_id',
      type: 'list',
      message: 'Select the role:',
      choices: roleChoices,
    },
    {
      name: 'manager_id',
      type: 'list',
      message: 'Select the manager:',
      choices: managerChoices,
    },
  ]).then(async (answer) => {
    await addEmployee(answer.first_name, answer.last_name, answer.role_id, answer.manager_id);
    console.log(`Added employee: ${answer.first_name} ${answer.last_name}`);
    start();
  });
};

const promptUpdateEmployeeRole = async () => {
  const employees = await getEmployees();
  const roles = await getRoles();

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
  const roleChoices = roles.map(({ id, title }) => ({ name: title, value: id }));

  inquirer.prompt([
    {
      name: 'employee_id',
      type: 'list',
      message: 'Select the employee to update:',
      choices: employeeChoices,
    },
    {
      name: 'role_id',
      type: 'list',
      message: 'Select the new role:',
      choices: roleChoices,
    },
  ]).then(async (answer) => {
    await updateEmployeeRole(answer.employee_id, answer.role_id);
    console.log('Updated employee role');
    start();
  });
};

start();
