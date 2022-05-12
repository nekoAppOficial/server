module.exports = (conn, socket, token, userID)  => {
    if(token && userID){
        //Validar o usuário pelo token mysql
        let query = `SELECT * FROM users WHERE token = '${token}'`;
        conn.query(query, (err, result) => {
            if (err) {
                socket.emit(`notifications`, {
                    sucess: false,
                    message: `Hum, não funcionou. Verifique a caixa alta, ortografia, espaços e números pra ver se está tudo certo mesmo.`,
                    page: `addFriend`
                })
            } else {
                if (result.length > 0) {
                    const user = result[0];
                    user.token = undefined
                    user.password = undefined;
                    if(user.id == userID){
                        socket.emit(`notifications`, {
                            sucess: false,
                            message: `Hum, acho que você não pode se adicionar, espertinho...`,
                            page: `addFriend`
                        })
                    }
                    //Add friend 
                    //Valida se o usuario userID username existe
                    query = `SELECT * FROM users WHERE username = '${userID}'`;
                    conn.query(query, (err, result) => {
                        if(!err){
                            const userPara = result[0];
                            if(result.length > 0){
                                //Validation if not exist pending friend
                                query = `SELECT * FROM friends WHERE (userID = ${user.id} AND friendID = ${userPara.id}) 
                                                                OR (userID = ${userPara.id} AND friendID = ${user.id})`;
                                conn.query(query, (err, result) => {
                                    if(!err){
                                        if(result.length == 0){
                                            if(user.id != userPara.id){
                                                query = `INSERT INTO friends (friendId, userId, statusAmizade, createdBy)
                                                 VALUES (${userPara.id}, ${user.id}, "pending", ${user.id})`;
                                                conn.query(query, (err, result) => {
                                                    //Send to user
                                                    userPara.statusAmizade = `pending`
                                                    user.statusAmizade = `pending`
                                                    user.createdBy = user.id
                                                    userPara.createdBy = user.id
                                                    socket.broadcast.to(user.keyEncrypt).emit('addFriend', userPara);
                                                    socket.broadcast.to(userPara.keyEncrypt).emit('addFriend', user);
                                                    socket.emit('addFriend', userPara);
                                                    socket.emit(`notifications`, {
                                                        sucess: true,
                                                        message: `Pedido de amizade para ${userPara.username}  enviado com sucesso!`,
                                                        page: `addFriend`
                                                    })
                                                })
                                            }
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
                                    message: `Hum, não funcionou. Verifique a caixa alta, ortografia, espaços e números pra ver se está tudo certo mesmo.`,
                                    page: `addFriend`
                                })
                            }
                        }
                    })
                    
                } else {
                    socket.emit(`notifications`, {
                        sucess: false,
                        message: `Hum, não funcionou. Verifique a caixa alta, ortografia, espaços e números pra ver se está tudo certo mesmo.`,
                        page: `addFriend`
                    })
                }
            }
        });
    } else{
        socket.emit(`notifications`, {
            sucess: false,
            message: `Hum, não funcionou. Verifique a caixa alta, ortografia, espaços e números pra ver se está tudo certo mesmo.`,
            page: `addFriend`
        })
    }
}
