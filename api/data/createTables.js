module.exports = createTable => (conn) => {
    // Create table users
    conn.query(`CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, 
        token VARCHAR(255), 
        admin INT,
        username VARCHAR(255), 
        password VARCHAR(255), 
        photo LONGTEXT, 
        coverPhoto LONGTEXT,
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
        friendId int,
        status VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        token VARCHAR(255),
        keyEncrypt VARCHAR(255)
        )`, (err, results) => {
        if(err){
        }
    });
    //Create table messagesPrivate
    conn.query(`CREATE TABLE IF NOT EXISTS messagesPrivate
        (
        id INT AUTO_INCREMENT PRIMARY KEY,
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
    conn.query(`CREATE TABLE IF NOT EXISTS messagesPrivate
        (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId int,
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