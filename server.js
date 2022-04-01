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
  socket.on(`disconnect`, () => {
    offline(conn, socket.id)
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


