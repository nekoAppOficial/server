module.exports = (conn, socket)  => {
    //Validar o usuário pelo token mysql
    let query = `SELECT * FROM users WHERE socketid = '${socket}'`;
    conn.query(query, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (result.length > 0) {
                const user = result[0];
                user.password = undefined;
                conn.query(query, (err, result) => {
                    //Update status to online
                    query = `UPDATE users SET status = 'offline' WHERE socketid = '${socket}'`;
                    user.password = undefined;
                    conn.query(query, (err, result) => {
                        
                    });
                });
            } else {
                console.log(`Invalid socket`)
            }
        }
    });
}
