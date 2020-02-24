const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host: 'localhost',
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: 'root',
  // Your password
  password: 'P@ssW0rd',
  database: 'tracker_db',
});

connection.connect((err) => {
  if (err) throw err;
  init();
});
function showTable() {
  connection.query(
    "SELECT first_name, last_name, title, salary, dept_name, (SELECT CONCAT(first_name, ' ', last_name) FROM tracker_db.employee WHERE id = a.manager_id) AS manager FROM tracker_db.employee a " +
    "left join tracker_db.role on role_id = tracker_db.role.id " +
    "left join tracker_db.department on tracker_db.role.dept_id = tracker_db.department.id",
    (err, res) => {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.table(res);
    },
  );
}
function createEmployee(first_name, last_name, role_id, manager_id) {
  connection.query(
    'INSERT INTO employee SET ?',
    {
      first_name: first_name,
      last_name: last_name,
      role_id: role_id,
      manager_id: manager_id,
    },
    (err, res) => {
      if (err) throw err;
      console.log(`${res.affectedRows} Employee inserted!\n`);
    },
  );
}
function createRole(title, salary, dept_id) {
  connection.query(
    'INSERT INTO role SET ?',
    {
      title: title,
      salary: salary,
      dept_id: dept_id,
    },
    (err, res) => {
      if (err) throw err;
      console.log(`${res.affectedRows} Role inserted!\n`);
    },
  );
}
function createDepartment(dept_name) {
  connection.query(
    'INSERT INTO department SET ?',
    {
      dept_name: dept_name,
    },
    (err, res) => {
      if (err) throw err;
      console.log(`${res.affectedRows} Department inserted!\n`);
    },
  );
}
function updateEmployeeRole(id, role_id) {
  connection.query(
    'UPDATE employee SET ? WHERE ?',
    [
      {
        role_id: role_id,
      },
      {
        id: id,
      },
    ],
    (err, res) => {
      if (err) throw err;
      console.log(`${res.affectedRows} Employee role updated!\n`);
    },
  );
}
function updateEmployeeManager(id, manager_id) {
  connection.query(
    'UPDATE employee SET ? WHERE ?',
    [
      {
        manager_id: manager_id,
      },
      {
        id: id,
      },
    ],
    (err, res) => {
      if (err) throw err;
      console.log(`${res.affectedRows} Employee manager updated!\n`);
    },
  );
}
function deleteEmployee(id) {
  connection.query(
    'DELETE FROM employee WHERE ?',
    {
      id: id,
    },
    (err, res) => {
      if (err) throw err;
      console.log(`${res.affectedRows} Employee deleted!\n`);
    },
  );
}

function readEmployees() {
  // Run Query
  connection.query('SELECT * FROM employee', (err, res) => {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);
  });
}
function readRoles() {
  // Run Query
  connection.query('SELECT * FROM role', (err, res) => {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);
  });
}
function readDepartments() {
  // Run Query
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);
  });
}
function init() {

  showTable();

  // End DB Connection
  connection.end();
}
