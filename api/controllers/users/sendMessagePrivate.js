module.exports = (conn, socket, token, userID, message)  => {
    if(token && userID && message){
        //Validar o usuário pelo token mysql
        let query = `SELECT * FROM users WHERE token = '${token}'`;
        conn.query(query, (err, result) => {
            if (err) {
                socket.emit(`notifications`, {
                    sucess: false,
                    message: `Usuário não encontrado`,
                    page: `chatPrivado`
                })
            } else {
                if (result.length > 0) {
                    const user = result[0];
                    user.token = undefined
                    user.password = undefined;
                    //Add friend 
                    //Valida se o usuario userID username existe
                    query = `SELECT * FROM users WHERE id = ${userID}`;
                    conn.query(query, (err, result) => {
                        if(!err){
                            const userPara = result[0];
                            userPara.password = undefined
                            userPara.token = undefined
                            if(userPara){
                                //Send message private insert
                                query = `INSERT INTO messagesPrivate 
                                (userId, friendId, message, createdBy) VALUES (${user.id}, ${userID}, '${message}', ${user.id})`;
                                //Send to user
                                conn.query(query, (err, result) => {
                                    if(!err){
                                        socket.broadcast.to(user.keyEncrypt).emit('message', {
                                            message: message,
                                            userPara: userPara,
                                            userDe: user,
                                            createdBy: user.id
                                        });
                                        socket.broadcast.to(userPara.keyEncrypt).emit('message', {
                                            message: message,
                                            userPara: userPara,
                                            userDe: user,
                                            createdBy: user.id
                                        });
                                        socket.emit('message', {
                                            message: message,
                                            userPara: userPara,
                                            userDe: user,
                                            createdBy: user.id
                                        });
                                    }
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
