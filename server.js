const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let listUsers = [];

app.use(express.static(path.join(__dirname, './')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {

    socket.on('disconnect', () => {
        const index = listUsers.findIndex((e) => e.id === socket.id);
        
        console.log(listUsers[index] ? listUsers[index].name : 'Some users', 'exit the room..');
        socket.broadcast.emit('dc', listUsers[index]);
        
        listUsers.splice(index, 1);
        socket.emit('users',  listUsers);
        socket.broadcast.emit('users',  listUsers);
    });
    
    socket.on('chat', data => {
        socket.broadcast.emit('chat', data);
    })

    socket.on('users', username => {
        listUsers.push({ name: username, id: socket.id} );
        console.log(username, 'join the room..');
        socket.emit('users', listUsers);
        socket.broadcast.emit('users', listUsers);
    })
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});