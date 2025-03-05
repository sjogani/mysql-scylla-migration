const mysql = require('mysql2');
const cassandra = require('cassandra-driver');
const express = require('express');
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

app.get('/migrate', async (req, res) => {
    sqlConnection.query('SELECT * FROM users', async (err, results) => {
        if (err) return res.status(500).send(err);
        let migrated = 0;

        for (let user of results) {
            const query = `INSERT INTO users (id, name, email, username, createdAt) VALUES (?, ?, ?, ?, ?)`;
            await scyllaClient.execute(query, [
                user.id, user.name, user.email, user.username, user.createdAt
            ], { prepare: true });
            migrated++;
        }

        res.send({ migrated });
    });
});

app.listen(3000, () => console.log("Server running on port 3000"));
