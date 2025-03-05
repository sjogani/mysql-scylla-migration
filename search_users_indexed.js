const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();

const sqlConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

app.get('/search-indexed', async (req, res) => {
    const { name } = req.query;
    let mysqlStart = Date.now();

    sqlConnection.query(`SELECT * FROM users WHERE name = ?`, [name], (err, mysqlResults) => {
        if (err) return res.status(500).send(err);
        let mysqlTime = Date.now() - mysqlStart;

        res.send({ mysqlIndexed: { time: mysqlTime + "ms", results: mysqlResults } });
    });
});

app.listen(3000, () => console.log("Server running on port 3000"));
