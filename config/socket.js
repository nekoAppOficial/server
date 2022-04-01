module.exports = (app) => {
    const http = require('http').Server(app);
    const io = require('socket.io')(http);
    io.on('connection', (socket) => {
        socket.on('message', (data) => {
        console.log(data)
        socket.emit('message', data)
        })
    })
    return io
}