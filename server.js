const inquirer = require("inquirer");
const db = require("./db/connection");

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
        ],
      },
    ])
    // logic to move to another function depending on users input .then etc
    .then(({ first }) => {
      if (first === "view all departments") {
        // no need to have if with error since we are using promise.
        db.promise().query('SELECT * FROM department').then((viewDepartments) => {
          console.log(viewDepartments[0]);
        });
      }
      else if (first === "view all employees") {
        // no need to have if with error since we are using promise.
        db.promise().query('SELECT * FROM employee').then((viewDepartments) => {
          console.log(viewDepartments[0]);
        });
      }
      else if (first === "view all roles") {
        // no need to have if with error since we are using promise.
        db.promise().query('SELECT * FROM job_role').then((viewDepartments) => {
          console.log(viewDepartments[0]);
        });
      }
      else if(first === "add a department"){
        addDepartment()
      }
      else if(first === "add a role"){
        addRole();
      }
      else if(first === "add a employee"){
        addEmployee();
      }
      else if(first === "update an employee role"){
        upDateEmployeeRole();
      }
    });
}

function addDepartment(){
  inquirer.prompt([
    {
      type: 'input',
      name: 'departmentName',
      message: 'what is the name of the department you would like to add?'
    }
  ])
  .then(({ departmentName }) => {
    db.query(`INSERT INTO department (name) VALUES (?)`, departmentName),(error) => {
      if (error){
        throw error;
      }
      else { 
        console.log(`success! ${departmentName} added`)
      }
    };
  });
};

function addRole(){
  db.query('SELECT name FROM department', (error, res) => {
    if(error) {
      throw error;
    } else {
      inquirer.prompt([
        {
          type: 'input',
          name: 'roleName',
          message: 'what is the name of the role you would like to add?'
        },
        {
          type: 'input',
          name: 'roleSalary',
          message: 'what is the salary of the role?'
        },
        {
          type: 'list',
          name: 'roleDepartment',
          message: 'what is the department of the role?',
          choices: res
        }
      ]).then(({ roleName, roleSalary, roleDepartment }) => { db.query('SELECT id FROM department WHERE name = ?',roleDepartment, (error, res) => {
        if(error){
          throw error;
        }
        else{
          db.query('INSERT INTO job_role  (title, salary, department_id) VALUES (?, ?, ?)', [roleName, roleSalary, res[0].id], (error, res) => {
            if(error){
              throw error;
            }
            else{console.log('success it worked!')}
          })
        }
      })
      })
    }
  })
};

function addEmployee(){
  inquirer.prompt([
    {
      type: 'input',
      name: 'employeeFirstName',
      message: 'what is the first name of the employee you would like to add?'
    },
    {
      type: 'input',
      name: 'employeeLastName',
      message: 'what is the last name of the employee you would like to add?'
    },
    {
      type: 'input',
      name: 'employeeRole',
      message: 'what is the employee role?'
    },
    {
      type: 'input',
      name: 'employeeManager',
      message: 'who is the manager of the employee?'
    }
  ])
  // .then() push dept name in to db or push into array that we will push into db later?
};

function upDateEmployeeRole(){
  inquirer.prompt([
    {
      type: "list",
      name: "employeeList",
      message: "Which employee would you like to update?",
      choices: [
        "list of employees from db",
        "more employees",
      ],
    },
    {
      type: 'input',
      name: 'updateNewRole',
      message: 'what is the new role of this employee?'
    },
    {
      type: 'input',
      name: 'employeeManager',
      message: 'who is the employees new manager?'
    }
  ])
  // .then() push dept name in to db or push into array that we will push into db later?
};

firstQuestion();

// instead of req.params.id pass employee or role from inquirer
// will have multiple queries for insert into job_role vs insert into department, and employee
// code from module work
// db.query(sql, req.params.id, (err, result) => {
//   if (err) {
//     res.status(400).json({ error: res.message });
//   } else if (!result.affectedRows) {
//     res.json({
//       message: 'Voter not found'
//     });
//   } else {
//     res.json({
//       message: 'deleted',
//       changes: result.affectedRows,
//       id: req.params.id
//     });
//   }
// })
