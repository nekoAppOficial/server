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
                    query = `SELECT * FROM users WHERE id = '${userID}'`;
                    conn.query(query, (err, result) => {
                        if(!err){
                            const userPara = result[0];
                            if(result.length > 0){
                                //Validation if not exist pending friend
                                query = `SELECT * FROM friends WHERE (userID = ${user.id} AND friendId = ${userPara.id}) 
                                                                OR (userID = ${userPara.id} AND friendId = ${user.id})`;
                                conn.query(query, (err, result) => {
                                    if(!err){
                                        if(result.length > 0){
                                            //Accept friend
                                            query = `UPDATE friends SET statusAmizade = 'accept' WHERE (userID = ${user.id} AND friendID = ${userPara.id})
                                            OR (userID = ${userPara.id} AND friendID = ${user.id})`;
                                            conn.query(query, (err, result) => {
                                                userPara.statusAmizade = `accept`
                                                user.statusAmizade = `accept`
                                                user.createdBy = user.id
                                                userPara.createdBy = user.id
                                                socket.broadcast.to(user.keyEncrypt).emit('acceptFriend', userPara);
                                                socket.broadcast.to(userPara.keyEncrypt).emit('acceptFriend', user);
                                                socket.emit('acceptFriend', userPara);
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
