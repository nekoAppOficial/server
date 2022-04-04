module.exports =  (conn, socket, token, userID) => {
    //Validar o usuário pelo token mysql
    let query = `SELECT * FROM users WHERE token = '${token}'`;
    conn.query(query, (err, result) => {
        if(!err){
            if(result.length > 0){
                const userEu = result[0]
                query = `SELECT * FROM friends inner join users on friends.userId = users.id or friends.friendId = users.id WHERE friends.userId = ${userID} 
                    and friends.friendId = ${userEu.id}
                    and users.username != '${user.username}' OR friends.friendId = ${userID} and friends.usersId = ${userEu.id}
                    and users.username != '${user.username}'`;
                conn.query(query, (err, result) => {
                    if (err) {
                        console.log(err )
                    } else {
                        if (result.length > 0) {
                            const user = result[0];
                            user.token = undefined
                            user.password = undefined;
                            //Get user messages
                            query = `SELECT * FROM messagesPrivate WHERE userId = ${userID} AND friendId = ${userEu.id}
                            OR userId = ${userEu.id} AND friendId = ${userID} ORDER BY id ASC LIMIT 200`;
                            //And get who send the message
                            conn.query(query, (err, msgResults) => {
                                if(!err){
                                    socket.emit(`getUserProfile`, {
                                        user,
                                        messages: msgResults
                                    })
                                }
                            })
                        } else {
                            
                        }
                    }
                });
            }
        }
    })
    
}
