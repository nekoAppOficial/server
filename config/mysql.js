module.exports = conn => (database) => {
    const mysql = require('mysql');

    const conn  = mysql.createPool({
        connectionLimit : 10,
        host            : database.host,
        user            : database.username,
        password        : database.password,
        database        : database.db
    });

    return conn;
}