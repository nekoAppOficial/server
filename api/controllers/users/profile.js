module.exports = profile => (conn, req, res) => {
    const {
        username
    } = req.body;

    //Validar o usuário pelo token mysql
    let query = `SELECT * FROM users WHERE username = '${username}'`;
    conn.query(query, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (result.length > 0) {
                const user = result[0];
                user.token = undefined
                user.password = undefined;
                conn.query(query, (err, result) => {
                    res.status(200).send({
                        user
                    });
                });
            } else {
                res.status(401).send({
                    error: 'Invalid profile'
                });
            }
        }
    });
}
