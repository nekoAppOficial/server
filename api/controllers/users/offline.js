module.exports = (conn, socket)  => {
    //Validar o usuário pelo token mysql
    let query = `SELECT * FROM users WHERE socketid = '${socket.id}'`;
    conn.query(query, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (result.length > 0) {
                const user = result[0];
                user.password = undefined;
                conn.query(query, (err, result) => {
                    //Update status to online
                    query = `UPDATE users SET status = 'offline' WHERE socketid = '${socket.id}'`;
                    user.password = undefined;
                    user.token = undefined
                    conn.query(query, (err, result) => {
                        //Send to all users
                        socket.broadcast.to(user.keyEncrypt).emit('userOffline', user);
                    });
                });
            } else {
                console.log(`Invalid socket`)
            }
        }
    });
}
