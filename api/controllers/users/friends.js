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
                         //Get minhas solitacoes de amizade
                        query = `SELECT * FROM friends WHERE userID = ${user.id} OR friendId = ${user.id}`;
                        conn.query(query, (err, resultE) => {
                            if(!err){
                                if(resultE.length == 0){
                                    socket.emit(`getFriends`, [])
                                }
                            }
                            //GET USER INFORMATION FROM FRIENDS RESULT
                            resultE.forEach(friend => {
                                //Query
                                let id = friend.userId == user.id ? friend.friendId : friend.userId;
                                query = `SELECT * FROM users WHERE id = ${id}`;
                                conn.query(query, (err, resultsUser) => {
                                    if(!err){
                                        let friends = [];
                                        resultsUser.forEach(userB => {
                                            userB.token = undefined
                                            userB.password = undefined
                                            userB.socketid = undefined
                                            userB.email = undefined
                                            userB.statusAmizade = friend.status
                                            userB.keyEncrypt = undefined
                                            userB.createdBy = friend.createdBy
                                            friends.push(userB)
                                        })
                                        socket.emit(`getFriends`, friends)
                                    }
                                })
                            })
                        })
                    });
                });
            } else {
                console.log(`Invalid token`)
            }
        }
    });
}
