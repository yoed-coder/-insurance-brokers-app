const mysql = require('mysql2/promise');

const dbConfig = {
    connectionLimit: 10,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST
};

console.log(process.env); // You can keep this for debugging

// Create the pool (this is async-capable because you're using mysql2/promise)
const pool = mysql.createPool(dbConfig);

// Custom wrapper to use the pool
async function query(sql, params) {
    const [rows, fields] = await pool.execute(sql, params);
    return rows;
}

module.exports = { query, pool };