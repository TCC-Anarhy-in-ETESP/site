const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'ag250507',
    database: 'Jogo',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function conn(sqlquery, list) {
    let connection;
    try {
        connection = await pool.getConnection();
        let result;
        if (!list) {
            console.log(sqlquery);
            [result] = await connection.query(sqlquery);
        } else {
            console.log(sqlquery, list);
            [result] = await connection.query(sqlquery, list);
        }
        return result;
    } catch (err) {
        console.error(err);
        return err;
    } finally {
        if (connection) connection.release();
    }
}

module.exports = conn;
