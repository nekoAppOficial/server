module.exports = (conn, socket, backgroundColor, token) => {
    if(backgroundColor && token){
        let query = `SELECT * FROM users WHERE token = '${token}'`;
        conn.query(query, (err, result) => {
            if (err) {
                //
            } else {
                if (result.length > 0) {
                    const user = result[0];
                    if (user.token === token) {
                        //Update token in database
                        query = `UPDATE users SET backgroundColor = '${backgroundColor}' WHERE id = ${user.id}`;
                        user.password = undefined;
                        user.token = undefined
                        conn.query(query, (err, result) => {
                            query = `SELECT * FROM friends inner join users on friends.userId = users.id or friends.friendId = users.id WHERE friends.userId = ${user.id} and users.username != '${user.username}' OR friends.friendId = ${user.id}
                        and users.username != '${user.username}'`;
                            conn.query(query, (err, resultFriends) => {
                                if(!err){
                                    resultFriends.forEach(friend => {
                                        socket.broadcast.to(friend.keyEncrypt).emit('refreshFriends', true);
                                    });
                                    socket.emit('refreshFriends', true);
                                    socket.emit('refreshMe', true);
                                }
                            })
                        });
                    } else {
                        // res.status(401).send({
                        //     error: 'Invalid token'
                        // });
                    }
                } else {
                    // res.status(401).send({
                    //     error: 'Invalid token'
                    // });
                }
            }
        });
    } else{
        // res.status(401).send({
        //     error: 'Please provide token and base64'
        // });
    }
}
