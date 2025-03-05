const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

connection.query(`CREATE INDEX idx_name ON users(name)`, (err, result) => {
    if (err) throw err;
    console.log("Index created successfully.");
    connection.end();
});
