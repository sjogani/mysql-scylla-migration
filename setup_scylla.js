const cassandra = require('cassandra-driver');
require('dotenv').config();

const client = new cassandra.Client({
    contactPoints: [process.env.SCYLLA_HOST],
    localDataCenter: process.env.SCYLLA_DC,
    keyspace: process.env.SCYLLA_KEYSPACE
});

const query = `
    CREATE TABLE IF NOT EXISTS users (
        id BIGINT PRIMARY KEY,
        name TEXT,
        email TEXT,
        username TEXT,
        createdAt TIMESTAMP
    )
`;

client.execute(query)
    .then(() => console.log("ScyllaDB table created successfully"))
    .catch(err => console.error(err))
    .finally(() => client.shutdown());
