const mysql = require('mysql2');
require('dotenv').config();
// connect to database
console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'employee_tracker'
  },
  console.log('Connected to the election database.')
);

module.exports = db;