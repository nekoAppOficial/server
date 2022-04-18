module.exports = auth => (conn, req, res) => {
    const {
        username,
        password,
        email
    } = req.body;
    if(password && username){
        const jwt = require('jsonwebtoken');
        const encryptPassword = require('encrypt-password')
        const encryptedPassword = encryptPassword(password+`_kaway123`, 'mysignaturekaway')
        //Register with usernamd and password and jwt token
        //Validate username if exist on database
        const keyEncrypt = jwt.sign({
            id: encryptedPassword + `_kaway`+ username
        }, `kaway404`);
        let query = `SELECT * FROM users WHERE username = '${username}'`;

        conn.query(query, (err, result) => {
            if (err) {
                res.status(500).send(err);
            } else {
                if(result.length == 0){
                    const token = jwt.sign({
                        id: username + `_kaway`
                    }, `kaway404`);
                    query = `INSERT INTO users (
                        username, password,
                        verified, keyEncrypt, token
                        ) VALUES ('${username}','${encryptedPassword}', 0, '${keyEncrypt}', '${token}')`;
                    conn.query(query, (err, result) => {
                        if(!err){
                            res.status(200).send({
                                message: `User ${username} has been registered`,
                                sucess: true,
                                token
                            });
                        } else{
                            res.status(200).send(err);
                        }
                    })
                } else{
                    res.status(200).send({
                        message: 'Este nome de usuário já existe',
                        sucess: false
                    });
                }
            }
        });
    } else{
        res.status(200).send({
            message: 'Por favor, preencha todos os campos',
            sucess: false
        });
    }
}
