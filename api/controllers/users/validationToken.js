module.exports = validationToken => (conn, req, res) => {
    const {
        token
    } = req.body;

    //Validar o usuário pelo token mysql
    let query = `SELECT * FROM users WHERE token = '${token}'`;
    conn.query(query, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (result.length > 0) {
                const user = result[0];
                user.token = token
                user.password = undefined;
                conn.query(query, (err, result) => {
                    res.status(200).send({
                        user
                    });
                });
            } else {
                res.status(200).send({
                    error: 'Invalid TOKEN',
                    user: null
                });
            }
        }
    });
}
