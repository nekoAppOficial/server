module.exports = (conn, socket, token, userID)  => {
    if(token && userID){
        //Validar o usuário pelo token mysql
        let query = `SELECT * FROM users WHERE token = '${token}'`;
        conn.query(query, (err, result) => {
            if (err) {
                socket.emit(`notifications`, {
                    sucess: false,
                    message: `Usuário não encontrado`,
                    page: `addFriend`
                })
            } else {
                if (result.length > 0) {
                    const user = result[0];
                    user.token = undefined
                    user.password = undefined;
                    //Add friend 
                    //Valida se o usuario userID username existe
                    query = `SELECT * FROM users WHERE username = '${userID}'`;
                    conn.query(query, (err, result) => {
                        if(!err){
                            const userPara = result[0];
                            if(result.length > 0){
                                //Validation if not exist pending friend
                                query = `SELECT * FROM friends WHERE (userID = ${user.id} AND friendID = ${userPara.id}) OR (userID = ${user.id} AND friendID = ${userPara.id})`;
                                conn.query(query, (err, result) => {
                                    if(!err){
                                        if(result.length == 0){
                                            query = `INSERT INTO friends (friendId, userId, status) VALUES (${userPara.id}, ${user.id}, "pending")`;
                                            conn.query(query, (err, result) => {
                                                //Send to user
                                                socket.broadcast.to(user.keyEncrypt).emit('receiveFriend', user);
                                                socket.emit(`notifications`, {
                                                    sucess: true,
                                                    message: `Pedido de amizade para ${userPara.username}  enviado com sucesso!`,
                                                    page: `addFriend`
                                                })
                                            })
                                        } else{
                                            socket.emit(`notifications`, {
                                                sucess: false,
                                                message: `Usuário já é seu amigo ou você já enviou um pedido de amizade para este usuário!`,
                                                page: `addFriend`
                                            })
                                        }
                                    }
                                    
                                });
                            } else{
                                socket.emit(`notifications`, {
                                    sucess: false,
                                    message: `Usuário não encontrado`,
                                    page: `addFriend`
                                })
                            }
                        }
                    })
                    
                } else {
                    socket.emit(`notifications`, {
                        sucess: false,
                        message: `Usuário não encontrado`,
                        page: `addFriend`
                    })
                }
            }
        });
    } else{
        socket.emit(`notifications`, {
            sucess: false,
            message: `Usuário não encontrado`,
            page: `addFriend`
        })
    }
}
