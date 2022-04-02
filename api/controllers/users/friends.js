module.exports = (conn, socket, token) => {
    //Validar o usuário pelo token mysql
    let query = `SELECT * FROM users WHERE token = '${token}'`;
    conn.query(query, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (result.length > 0) {
                const user = result[0];
                user.token = undefined
                user.password = undefined;
                conn.query(query, (err, result) => {
                    //Update status to online
                    query = `UPDATE users SET socketid = '${socket.id}' WHERE id = ${user.id}`;
                    user.password = undefined;
                    conn.query(query, (err, result) => {
                        query = `SELECT * FROM friends inner join users on friends.userId = users.id or friends.friendId = users.id WHERE friends.userId = ${user.id} and users.username != '${user.username}' OR friends.friendId = ${user.id}
                        and users.username != '${user.username}'`;
                        conn.query(query, (err, resultE) => {
                            if(!err){
                                resultE.forEach((userB, index) => {
                                    console.log(userB)
                                    resultE[index].token = undefined
                                    resultE[index].password = undefined
                                    resultE[index].socketid = undefined
                                    resultE[index].email = undefined
                                    resultE[index].keyEncrypt = undefined
                                })
                                socket.emit(`getFriends`, resultE)
                            } else{
                                console.log(err)
                            }
                        })
                    });
                });
            } else {
                console.log(`Invalid token`)
            }
        }
    });
}
