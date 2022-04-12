const {app, database, express} = require('./config/express')();
const socket = require("socket.io");
const port = app.get('port');
const serverPort = app.get('serverPort');
const routes = require('./api/routes/routes')();
const server = require('http').createServer(app)
const conn = require('./config/mysql')(database)(database);
const createTable = require('./api/data/createTables')()(conn);
const cors = require("cors");
const online = require('./api/controllers/users/online');
const offline = require('./api/controllers/users/offline');
const socketID = require('./api/controllers/users/socketID');
const addFriend = require('./api/controllers/users/addFriends');
const friends = require('./api/controllers/users/friends');
const acceptFriend = require('./api/controllers/users/acceptFriend');
const recuseFriend = require('./api/controllers/users/recuseFriend');
const profile = require('./api/controllers/users/profileSocket');
const sendMessagePrivate = require('./api/controllers/users/sendMessagePrivate');
const changePhotoSocket = require(`./api/controllers/users/config/changePhotoSocket`)

const io = require("socket.io")(server, {
  cors: {
    origin: "*"
  }
});

require('dotenv').config();
app.use(express());
app.use(cors());

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {
  socket.on(`userConnect`, token => {
    if(token){
      socketID(conn, socket, token)
      online(conn, socket, token)
    }
  })

  socket.on(`acceptFriend`, ({token, userID}) => {
    acceptFriend(conn, socket, token, userID)
    socket.emit('refreshFriends', true);
  })

  socket.on(`sendMessagePrivate`, ({token, userID, message, image}) => {
    if(token, userID, message){
      sendMessagePrivate(conn, socket, token, userID, message, image)
    }
  })

  socket.on(`change-avatar`, ({token, avatar}) => {
    if(token && avatar){
      changePhotoSocket(conn, socket, avatar, token)
    }
  })

  socket.on(`getUser`, ({token, userID}) => {
    profile(conn, socket, token, userID)
  })

  socket.on(`recuseFriend`, ({token, userID}) => {
    recuseFriend(conn, socket, token, userID)
    socket.emit('refreshFriends', true);
  })

  socket.on(`addFriend`, ({token, userID}) => {
    addFriend(conn, socket, token, userID)
  })

  socket.on(`getFriends`, token => {
    if(token){
      friends(conn, socket, token)
    } 
  })

  socket.on(`disconnect`, () => {
    offline(conn, socket)
  })
});

server.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
});


routes.forEach((route) => {
  try {
    const method = route.method;
    if(method == `post`){
      app.post(route.route, function(req, res) {
        route.controller(conn, req, res);
      });
    } else if(method == `get`){
      app.get(route.route, function(req, res) {
        route.controller(conn, req, res);
      });
    } else if(method == `put`){
      app.put(route.route, function(req, res) {
        route.controller(conn, req, res);
      });
    }
  } catch (error) {
    console.log(error);
  }
})


