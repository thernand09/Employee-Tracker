const pool = require('./connection');

const getDepartments = async () => {
  const res = await pool.query('SELECT * FROM department');
  return res.rows;
};

const getRoles = async () => {
  const res = await pool.query('SELECT * FROM role');
  return res.rows;
};

const getEmployees = async () => {
  const res = await pool.query('SELECT * FROM employee');
  return res.rows;
};

const addDepartment = async (name) => {
  const res = await pool.query('INSERT INTO department (name) VALUES ($1) RETURNING *', [name]);
  return res;
};

const addRole = async (title, salary, department_id) => {
  const res = await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *', [title, salary, department_id]);
  return res;
};

const addEmployee = async (first_name, last_name, role_id, manager_id) => {
  const res = await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *', [first_name, last_name, role_id, manager_id]);
  return res;
};

const updateEmployeeRole = async (employee_id, role_id) => {
  const res = await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2 RETURNING *', [role_id, employee_id]);
  return res;
};

module.exports = {
  getDepartments,
  getRoles,
  getEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
};
