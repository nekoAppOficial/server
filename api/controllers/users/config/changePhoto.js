module.exports = changePhoto => (conn, req, res) => {
    //Use JWT
    const jwt = require('jsonwebtoken');
    const encryptPassword = require('encrypt-password')
    const {
        token,
        base64
    } = req.body;
    if(base64 && token){
        let query = `SELECT * FROM users WHERE token = '${token}'`;
        conn.query(query, (err, result) => {
            if (err) {
                res.status(500).send(err);
            } else {
                if (result.length > 0) {
                    const user = result[0];
                    if (user.token === token) {
                        const token = jwt.sign({
                            id: user.id + `_kaway`
                        }, `kaway404`);
                        user.token = token
                        //Update token in database
                        query = `UPDATE users SET photo = '${base64}' WHERE id = ${user.id}`;
                        user.password = undefined;
                        user.token = undefined
                        conn.query(query, (err, result) => {
                            res.status(200).send({
                                "message": "Photo updated successfully",
                                "user": user,
                                "newPhoto": base64,
                                "oldPhoto": user.photo
                            });
                        });
                    } else {
                        res.status(401).send({
                            error: 'Invalid token'
                        });
                    }
                } else {
                    res.status(401).send({
                        error: 'Invalid token'
                    });
                }
            }
        });
    } else{
        res.status(401).send({
            error: 'Please provide token and base64'
        });
    }
}
