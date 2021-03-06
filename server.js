const inquirer = require("inquirer");
const db = require("./db/connection");
const cTable = require('console.table');

function firstQuestion() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "first",
        message: "Would you like to?",
        choices: [
          "view all departments",
          "view all roles",
          "view all employees",
          "add a department",
          "add a role",
          "add an employee",
          "update an employee role",
          "I'm done exit application",
        ],
      },
    ])
    // logic to move to another function depending on users input .then etc
    .then(({ first }) => {
      if (first === "view all departments") {
        // no need to have if with error since we are using promise.
        db.promise()
          .query("SELECT * FROM department")
          .then((viewDepartments) => {
            console.table(viewDepartments[0]);
            firstQuestion();
          });
      } else if (first === "view all employees") {
        // no need to have if with error since we are using promise.
        db.promise()
          .query("SELECT * FROM employee")
          .then((viewDepartments) => {
            console.table(viewDepartments[0]);
            firstQuestion();
          });
      } else if (first === "view all roles") {
        // no need to have if with error since we are using promise.
        db.promise()
          .query("SELECT * FROM job_role")
          .then((viewDepartments) => {
            console.table(viewDepartments[0]);
            firstQuestion();
          });
      } else if (first === "add a department") {
        addDepartment();
      } else if (first === "add a role") {
        addRole();
      } else if (first === "add an employee") {
        addEmployee();
      } else if (first === "update an employee role") {
        upDateEmployeeRole();
      } else if (first === "I'm done exit application") {
        console.log("goodbye");
      }
    });
}

async function addDepartment() {
  const { departmentName } = await 
  inquirer
  .prompt([
      {
        type: "input",
        name: "departmentName",
        message: "What is the name of the department you would like to add?",
      },
    ])
  const deptQuery = await db
  .promise()
  .query(`INSERT INTO department (name) VALUES (?)`, departmentName);  
  console.log(`success! ${departmentName} added`);
  firstQuestion();
}

async function addRole() {
  const departmentList = await db
    .promise()
    .query("SELECT name,id FROM department");
  const inquirerList = departmentList[0].map((dept) => ({
    name: dept.name,
    value: dept.id,
  }));
  const { roleName, roleSalary, roleDepartment } = await inquirer.prompt([
    {
      type: "input",
      name: "roleName",
      message: "what is the name of the role you would like to add?",
    },
    {
      type: "input",
      name: "roleSalary",
      message: "what is the salary of the role?",
    },
    {
      type: "list",
      name: "roleDepartment",
      message: "what is the department of the role?",
      choices: inquirerList,
    },
  ]);
  const roleQuery = await db
    .promise()
    .query(
      "INSERT INTO job_role  (title, salary, department_id) VALUES (?, ?, ?)",
      [roleName, roleSalary, roleDepartment]
    );
  console.log(`success ${roleName} added!`);
  firstQuestion();
}

async function addEmployee() {
  const roleList = await db.promise().query("SELECT title,id FROM job_role");
  const inquirerListRole = roleList[0].map((role) => ({
    // need name value format for inquirer it will show the name and can store the value if you would like to access later
    name: role.title,
    value: role.id,
  }));
  const employeeList = await db
    .promise()
    .query("SELECT manager_id,CONCAT (first_name,' ',last_name) as name FROM employee");
  const inquirerListManager = employeeList[0].map((manager) => ({
    name: manager.name,
    value: manager.manager_id,
  }));
  const { employeeFirstName, employeeLastName, employeeRole, employeeManager } =
    await inquirer.prompt([
      {
        type: "input",
        name: "employeeFirstName",
        message:
          "what is the first name of the employee you would like to add?",
      },
      {
        type: "input",
        name: "employeeLastName",
        message: "what is the last name of the employee you would like to add?",
      },
      {
        type: "list",
        name: "employeeRole",
        message: "what is the employees role?",
        choices: inquirerListRole,
      },
      {
        type: "list",
        name: "employeeManager",
        message: "who is the manager of the employee?",
        choices: inquirerListManager,
      },
    ]);
  const employeeQuery = await db
    .promise()
    .query(
      "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
      [employeeFirstName, employeeLastName, employeeRole, employeeManager]
    );
  console.log(
    `success the employee ${employeeFirstName} ${employeeLastName} was created!`
  );
  firstQuestion();
}

async function upDateEmployeeRole() {
  const roleList = await db.promise().query("SELECT title,id FROM job_role");
  const inquirerListRole = roleList[0].map((role) => ({
    name: role.title,
    value: role.id,
  }));
  const employeeList = await db
    .promise()
    .query(
      "SELECT id, CONCAT(first_name, ' ', last_name) as name FROM employee"
    );
  const inquirerListEmployee = employeeList[0].map((employee) => ({
    name: employee.name,
    value: employee.id,
  }));
  const { employeeName, employeeNewRole } = await inquirer.prompt([
    {
      type: "list",
      name: "employeeName",
      message: "What is the name of the employee?",
      choices: inquirerListEmployee,
    },
    {
      type: "list",
      name: "employeeNewRole",
      message: "What is the new role of the employee?",
      choices: inquirerListRole,
    }
  ]);
  const updateQuery = await db
  .promise().query(
    `UPDATE employee
    SET role_id = (?)
    WHERE id = (?)`,
    [employeeNewRole, employeeName]
  );
  console.log(`the employees role has been updated `);
  firstQuestion();
}

firstQuestion();
