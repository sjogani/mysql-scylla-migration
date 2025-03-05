const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
app.use(express.json());

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

function generateRandomUser() {
    const name = `User${Math.floor(Math.random() * 100000)}`;
    const email = `${name.toLowerCase()}@example.com`;
    const username = `${name.toLowerCase()}_${Math.floor(Math.random() * 100)}`;
    return { name, email, username };
}

app.post('/insert', (req, res) => {
    const { X } = req.body;
    let values = [];
    for (let i = 0; i < X; i++) {
        const user = generateRandomUser();
        values.push([user.name, user.email, user.username]);
    }

    const query = `INSERT INTO users (name, email, username) VALUES ?`;
    connection.query(query, [values], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ inserted: result.affectedRows });
    });
});

app.listen(3000, () => console.log("Server running on port 3000"));
