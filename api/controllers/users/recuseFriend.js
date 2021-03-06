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
                                query = `SELECT * FROM friends WHERE (userID = ${user.id} AND friendID = ${userPara.id}) 
                                                                OR (userID = ${userPara.id} AND friendID = ${user.id})`;
                                conn.query(query, (err, result) => {
                                    if(!err){
                                        if(result.length > 0){
                                            //Delete friend
                                            query = `DELETE FROM friends WHERE (
                                                userID = ${user.id} AND friendID = ${userPara.id})
                                                OR (userID = ${userPara.id} AND friendID = ${user.id})`
                                            conn.query(query, (err, result) => {
                                                socket.broadcast.to(user.keyEncrypt).emit('recuseFriend', userPara);
                                                socket.broadcast.to(userPara.keyEncrypt).emit('recuseFriend', user);
                                                socket.emit('recuseFriend', userPara);
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
