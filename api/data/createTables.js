module.exports = createTable => (conn) => {
    // Create table users
    conn.query(`CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, 
        token VARCHAR(255), 
        admin INT,
        username VARCHAR(255), 
        password VARCHAR(255), 
        photo LONGTEXT, 
        coverPhoto LONGTEXT,
        backgroundColor LONGTEXT,
        aboutMe VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(255),
        verified INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(255) DEFAULT "offline",
        keyEncrypt VARCHAR(255),
        socketid VARCHAR(255)
        )
        `, (err, results) => {
        if (err) {
            console.log(err)
        }
    });
    //Create table servers
    conn.query(`CREATE TABLE IF NOT EXISTS servers 
        (
        id INT AUTO_INCREMENT PRIMARY KEY,
        createBy INT,
        name VARCHAR(255),
        token VARCHAR(255),
        photo LONGTEXT,
        banner LONGTEXT,
        description VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(255),
        verified INT,
        keyEncrypt VARCHAR(255)
        )`, (err, results) => {
        if(err){
        }
    });
    //Create table friends
    conn.query(`CREATE TABLE IF NOT EXISTS friends 
        (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId int,
        createdBy int,
        friendId int,
        statusAmizade VARCHAR(255),
        created_at_f TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        token_f VARCHAR(255),
        keyEncrypt_f VARCHAR(255)
        )`, (err, results) => {
        if(err){
        }
    });
    //Create table messagesPrivate
    conn.query(`CREATE TABLE IF NOT EXISTS messagesPrivate
        (
        id INT AUTO_INCREMENT PRIMARY KEY,
        createdBy int,
        userId int,
        friendId int,
        message LONGTEXT,
        photo LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(255),
        deleted boolean,
        token VARCHAR(255)
        )`, (err, results) => {
        if(err){
        }
    });
    //Create table messagesServer
    conn.query(`CREATE TABLE IF NOT EXISTS messagesServer
        (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId int,
        createdBy int,
        serverId int,
        message LONGTEXT,
        photo LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(255),
        deleted boolean,
        token VARCHAR(255)
        )`, (err, results) => {
        if(err){
        }
    });
}