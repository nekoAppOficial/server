module.exports = auth => (conn, req, res) => {
    //Use JWT
    const jwt = require('jsonwebtoken');
    const encryptPassword = require('encrypt-password')
    const {
        username,
        password
    } = req.body;
    if(password && username){
        const encryptedPassword = encryptPassword(password+`_kaway123`, 'mysignaturekaway')
        let query = `SELECT * FROM users WHERE username = '${username}'`;
        conn.query(query, (err, result) => {
            if (err) {
                res.status(200).send({
                    error: `A senha tem que ser maior que 6`
                });
            } else {
                if (result.length > 0) {
                    const user = result[0];
                    if (user.password === encryptedPassword) {
                        const token = jwt.sign({
                            id: user.id + `_kaway`
                        }, `kaway404`);
                        user.token = token
                        //Update token in database
                        query = `UPDATE users SET token = '${token}' WHERE id = ${user.id}`;
                        user.password = undefined;
                        conn.query(query, (err, result) => {
                            res.status(200).send({
                                user
                            });
                        });
                    } else {
                        res.status(200).send({
                            error: 'Usuario ou senha incorretos'
                        });
                    }
                } else {
                    res.status(200).send({
                        error: 'Usuario ou senha incorretos'
                    });
                }
            }
        });
    } else{
        res.status(200).send({
            error: 'Please provide username and password'
        });
    }
}
