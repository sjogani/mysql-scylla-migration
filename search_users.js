const express = require('express');
const mysql = require('mysql2');
const cassandra = require('cassandra-driver');
require('dotenv').config();

const app = express();

const sqlConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

const scyllaClient = new cassandra.Client({
    contactPoints: [process.env.SCYLLA_HOST],
    localDataCenter: process.env.SCYLLA_DC,
    keyspace: process.env.SCYLLA_KEYSPACE
});

app.get('/search', async (req, res) => {
    const { name } = req.query;
    let mysqlStart = Date.now();

    sqlConnection.query(`SELECT * FROM users WHERE name LIKE ?`, [`%${name}%`], (err, mysqlResults) => {
        if (err) return res.status(500).send(err);
        let mysqlTime = Date.now() - mysqlStart;

        let scyllaStart = Date.now();
        scyllaClient.execute(`SELECT * FROM users WHERE name = ?`, [name], { prepare: true })
            .then(scyllaResults => {
                let scyllaTime = Date.now() - scyllaStart;

                res.send({
                    mysql: { time: mysqlTime + "ms", results: mysqlResults },
                    scylla: { time: scyllaTime + "ms", results: scyllaResults.rows }
                });
            }).catch(err => res.status(500).send(err));
    });
});

app.listen(3000, () => console.log("Server running on port 3000"));
