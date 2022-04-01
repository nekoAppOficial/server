module.exports = search => (conn, req, res) => {
    const {
        username
    } = req.body;

    if(username){
        //Validar o usuário pelo token mysql
        let query = `SELECT * FROM users WHERE username LIKE N'%${username}%' ORDER BY id`
        conn.query(query, (err, result) => {
            if (err) {
                res.status(500).send(err);
            } else {
                if (result.length > 0) {
                    let results = [...result];
                    results.forEach((user, index) => {
                        results[index].token = undefined
                        results[index].password = undefined;
                    })
                    conn.query(query, (err, result) => {
                        res.status(200).send({
                            total: (result.length - 1),
                            found: true,
                            results
                        });
                    });
                } else {
                    res.status(401).send({
                        error: {found: false}
                    });
                }
            }
        });
    } else{
        res.status(401).send({
            error: {found: false, message: 'O campo username é obrigatório'}
        });
    }
}
