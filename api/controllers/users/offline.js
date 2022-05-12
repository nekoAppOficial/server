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
                    query = `SELECT * FROM friends inner join users on friends.userId = users.id or friends.friendId = users.id WHERE friends.userId = ${user.id} and users.username != '${user.username}' OR friends.friendId = ${user.id}
                        and users.username != '${user.username}'`;
                    conn.query(query, (err, resultE) => {
                        if(!err){
                            resultE.forEach((userB, index) => {
                                resultE[index].token = undefined
                                resultE[index].password = undefined
                                resultE[index].socketid = undefined
                                resultE[index].email = undefined
                                socket.broadcast.to(userB.keyEncrypt).emit('offlineB', user);
                            })
                        } else{
                            // console.log(err)
                        }
                    })
                });
            } else {
                console.log(`Invalid socket`)
            }
        }
    });
}
