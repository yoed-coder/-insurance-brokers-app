const mysql = require('mysql2/promise');

const dbConfig = {
    connectionLimit: 10,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST
};

console.log(process.env); 


const pool = mysql.createPool(dbConfig);


async function query(sql, params) {
    const [rows, fields] = await pool.execute(sql, params);
    return rows;
}

module.exports = { query, pool };
