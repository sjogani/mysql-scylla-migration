const cassandra = require('cassandra-driver');
require('dotenv').config();

const client = new cassandra.Client({
    contactPoints: [process.env.SCYLLA_HOST],
    localDataCenter: process.env.SCYLLA_DC,
    keyspace: process.env.SCYLLA_KEYSPACE
});

const query = `
    CREATE TABLE IF NOT EXISTS users (
        name TEXT,
        createdAt TIMESTAMP,
        email TEXT,
        username TEXT,
        PRIMARY KEY ((name), createdAt)
    )
`;

client.execute(query)
    .then(() => console.log("ScyllaDB partitioning updated"))
    .catch(err => console.error(err))
    .finally(() => client.shutdown());
