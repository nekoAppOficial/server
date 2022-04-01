module.exports = (conn, socket, token)  => {
    //Validar o usuário pelo token mysql
    let query = `SELECT * FROM users WHERE token = '${token}'`;
    conn.query(query, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (result.length > 0) {
                const user = result[0];
                user.token = token
                user.password = undefined;
                conn.query(query, (err, result) => {
                    //Update status to online
                    query = `UPDATE users SET status = 'online' WHERE id = ${user.id}`;
                    user.password = undefined;
                    user.token = undefined
                    conn.query(query, (err, result) => {
                        socket.emit('online', user);
                    });
                });
            } else {
                console.log(`Invalid token`)
            }
        }
    });
}
