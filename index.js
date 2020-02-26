const mysql = require('mysql');
const { prompt } = require('enquirer');
const figlet = require('figlet');

let next = 'Menu';
const users = [];
const roles = [];
const departments = [];
const managers = [];

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
function quit() {
  connection.end();
  process.exit(0);
}
function showEmployees() {
  connection.query(
    "SELECT a.id, first_name, last_name, title, salary, dept_name, (SELECT CONCAT(first_name, ' ', last_name) FROM tracker_db.employee WHERE id = a.manager_id) AS manager FROM tracker_db.employee a " +
    "left join tracker_db.role on role_id = tracker_db.role.id " +
    "left join tracker_db.department on tracker_db.role.dept_id = tracker_db.department.id",
    (err, res) => {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.log('\n');
      console.table(res);
      console.log('\n\n\n\n\n\n\n\n\n\n\n');
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
function removeEmployee(id) {
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
function readRoles() {
  // Run Query
  connection.query('SELECT * FROM role', (err, res) => {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log('\n');
    console.table(res);
    console.log('\n');
    console.log('\n');
    console.log('\n');
    console.log('\n');
    console.log('\n');
    console.log('\n');
    console.log('\n');
  });
}
function readDepartments() {
  // Run Query
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log('\n');
    console.table(res);
    console.log('\n');
    console.log('\n');
    console.log('\n');
    console.log('\n');
    console.log('\n');
    console.log('\n');
  });
}
function getUsers() {
  // Run Query
  connection.query("SELECT CONCAT(first_name, ' ', last_name) as name, id as value FROM employee", (err, res) => {
    if (err) throw err;
    users.length = 0;
    managers.length = 0;
    managers.push({ message: 'None', value: '0' });
    res.forEach((element) => {
      const user = { message: '', value: '' };
      user.message = element.name;
      user.value = element.value.toString();
      users.push(user);
      managers.push(user);
    });
  });
}
function getRoles() {
  // Run Query
  connection.query("SELECT title as name, id as value FROM role", (err, res) => {
    if (err) throw err;
    roles.length = 0;
    res.forEach((element) => {
      const user = { message: '', value: '' };
      user.message = element.name;
      user.value = element.value.toString();
      roles.push(user);
    });
  });
}
function getDepartments() {
  // Run Query
  connection.query("SELECT dept_name as name, id as value FROM department", (err, res) => {
    if (err) throw err;
    departments.length = 0;
    res.forEach((element) => {
      const user = { message: '', value: '' };
      user.message = element.name;
      user.value = element.value.toString();
      departments.push(user);
    });
  });
}
async function mainMenu() {
  await getUsers();
  await getRoles();
  await getDepartments();
  const choices = [
    'Quit',
    'View all Employees',
    'View Roles',
    'View Departments',
    'Add an Employee',
    'Add a Role',
    'Add a Department',
    'Update Employee Role',
    'Update Employee Manager',
    'Delete an Employee',
  ];
  await prompt([
    {
      type: 'select',
      message: 'What would you like to do?',
      name: 'func',
      choices: choices,
    },
  ]).then((answers) => {
    if (answers.func === 'Quit') {
      // quit();
      next = 'Quit';
    }
    if (answers.func === 'View all Employees') {
      next = 'showEmployees';
    }
    if (answers.func === 'View Roles') {
      next = 'showRoles';
    }
    if (answers.func === 'View Departments') {
      next = 'showDepartments';
    }
    if (answers.func === 'Add an Employee') {
      next = 'addEmployee';
    }
    if (answers.func === 'Add a Role') {
      next = 'addRole';
    }
    if (answers.func === 'Add a Department') {
      next = 'addDepartment';
    }
    if (answers.func === 'Update Employee Role') {
      next = 'updateRole';
    }
    if (answers.func === 'Update Employee Manager') {
      next = 'updateManager';
    }
    if (answers.func === 'Delete an Employee') {
      next = 'deleteEmployee';
    }
  });
}
async function addEmployee() {
  await prompt([
    {
      type: 'input',
      message: 'Enter First Name: ',
      name: 'firstName',
    },
    {
      type: 'input',
      message: 'Enter Last Name: ',
      name: 'lastName',
    },
    {
      type: 'select',
      message: 'Choose a Role: ',
      name: 'roleID',
      choices: roles,
    },
    {
      type: 'select',
      message: 'Choose a Manager: ',
      name: 'managerID',
      choices: managers,
    },
  ]).then((answers) => {
    const roleID = +answers.roleID;
    const managerID = (answers.managerID === '0') ? null : +answers.managerID;
    createEmployee(answers.firstName, answers.lastName, roleID, managerID);
  });
}
async function addRole() {
  await prompt([
    {
      type: 'input',
      message: 'Enter Title: ',
      name: 'title',
    },
    {
      type: 'input',
      message: 'Enter Salary: ',
      name: 'salary',
    },
    {
      type: 'select',
      message: 'Choose a Department: ',
      name: 'deptID',
      choices: departments,
    },
  ]).then((answers) => {
    createRole(answers.title, answers.salary, +answers.deptID);
  });
}
async function addDepartment() {
  await prompt([
    {
      type: 'input',
      message: 'Department Name: ',
      name: 'deptName',
    },
  ]).then((answers) => {
    createDepartment(answers.deptName);
  });
}
async function updateRole() {
  await prompt([
    {
      type: 'select',
      message: 'Which Employee: ',
      name: 'emplID',
      choices: users,
    },
    {
      type: 'select',
      message: 'Choose a Role: ',
      name: 'roleID',
      choices: roles,
    },
  ]).then((answers) => {
    updateEmployeeRole(answers.emplID, answers.roleID);
  });
}
async function updateManager() {
  await prompt([
    {
      type: 'select',
      message: 'Which Employee: ',
      name: 'emplID',
      choices: users,
    },
    {
      type: 'select',
      message: 'Choose Manager: ',
      name: 'managerID',
      choices: managers,
    },
  ]).then((answers) => {
    updateEmployeeManager(answers.emplID, answers.managerID);
  });
}
async function deleteEmployee() {
  await prompt([
    {
      type: 'select',
      message: 'Which Employee: ',
      name: 'emplID',
      choices: users,
    },
  ]).then((answers) => {
    removeEmployee(answers.emplID);
  });
}
async function init() {
  console.log(figlet.textSync('Employee', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default',
  }));
  console.log(figlet.textSync('Tracker', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default',
  }));
  while (next !== 'Quit') {
    switch (next) {
      case 'Menu':
        await mainMenu();
        break;
      case 'showEmployees':
        await showEmployees();
        next = 'Menu';
        break;
      case 'showRoles':
        await readRoles();
        next = 'Menu';
        break;
      case 'showDepartments':
        await readDepartments();
        next = 'Menu';
        break;
      case 'addEmployee':
        await addEmployee();
        next = 'Menu';
        break;
      case 'addRole':
        await addRole();
        next = 'Menu';
        break;
      case 'addDepartment':
        await addDepartment();
        next = 'Menu';
        break;
      case 'updateRole':
        await updateRole();
        next = 'Menu';
        break;
      case 'updateManager':
        await updateManager();
        next = 'Menu';
        break;
      case 'deleteEmployee':
        await deleteEmployee();
        next = 'Menu';
        break;
      default:
        break;
    }
  }
  quit();
}
